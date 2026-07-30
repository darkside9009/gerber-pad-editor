/*
 * gerber.js - minimaler RS-274X Gerber Parser/Writer
 * Unterstützt: %FS %MO %AD (C,R,O + Makro-Passthrough) %AM %LP und andere Extended-Commands (passthrough)
 *              G-Codes (G01/G02/G03/G36/G37/G74/G75/G04...), D-Code Aperturauswahl, D01/D02/D03 Operationen
 * Ziel: Pads (D03 Flashes mit Standard-Apertur C/R/O) selektier- und editierbar machen (Position + Größe),
 *       Datei danach wieder als gültiges Gerber exportieren, ohne andere Inhalte zu verändern.
 */
(function (global) {
  'use strict';

  function parseGerber(text) {
    const layer = {
      units: 'MM',            // 'MM' | 'IN'
      fs: { zeroOmission: 'L', mode: 'A', xInt: 3, xDec: 4, yInt: 3, yDec: 4 },
      apertures: {},          // dcode -> {shape, params:[...], macroName, raw, holeRaw}
      commands: [],           // ordered statements, see below
      maxDcode: 9,
      texts: {},              // textId -> {id, text, x, y, height, strokeWidth, width, dcode} - editor-only
      maxTextId: 0            // metadata, not part of the Gerber format itself (lost on reload)
    };

    const stmts = tokenize(text);

    let curX = 0, curY = 0;      // current point, in real units (mm/inch), resolved
    let curAperture = null;      // currently selected aperture dcode
    let curPolarity = 'D';       // D = dark, C = clear
    let inRegion = false;
    let curGMode = 1;            // 1=linear, 2=cw arc, 3=ccw arc (modal)
    let curQuad = 'single';      // 'single' (G74) | 'multi' (G75)

    for (const s of stmts) {
      if (s.extended) {
        const body = s.raw; // content without leading/trailing %
        const parsed = parseExtended(body);
        if (parsed.kind === 'FS') {
          layer.fs = parsed.fs;
          layer.commands.push({ type: 'fs', raw: s.raw });
        } else if (parsed.kind === 'MO') {
          layer.units = parsed.unit;
          layer.commands.push({ type: 'mo', raw: s.raw });
        } else if (parsed.kind === 'AD') {
          layer.apertures[parsed.dcode] = {
            shape: parsed.shape,
            params: parsed.params,
            macroName: parsed.macroName || null,
            raw: s.raw
          };
          if (parsed.dcode > layer.maxDcode) layer.maxDcode = parsed.dcode;
          layer.commands.push({ type: 'ad', raw: s.raw, dcode: parsed.dcode });
        } else if (parsed.kind === 'LP') {
          curPolarity = parsed.polarity;
          layer.commands.push({ type: 'lp', raw: s.raw, polarity: parsed.polarity });
        } else {
          layer.commands.push({ type: 'extended', raw: s.raw });
        }
        continue;
      }

      const raw = s.raw;

      // standalone aperture select: D<n>, n>=10. Some (older/legacy, e.g. Sprint-Layout)
      // exporters prefix this with the obsolete "G54"/"G55" prepare-for-tool-selection code,
      // e.g. "G54D10*" - G54/G55 themselves are no-ops, only the D-code matters.
      let m = /^(?:G5[45])?D(\d+)$/.exec(raw);
      if (m && parseInt(m[1], 10) >= 10) {
        curAperture = parseInt(m[1], 10);
        layer.commands.push({ type: 'aselect', raw, dcode: curAperture });
        continue;
      }

      // pure G-code without coordinates (mode set) e.g. G01, G36, G37, G74, G75, G04 comment handled separately
      m = /^G0?4(.*)$/.exec(raw);
      if (m) {
        layer.commands.push({ type: 'comment', raw });
        continue;
      }
      m = /^G(\d{1,2})$/.exec(raw);
      if (m) {
        const code = parseInt(m[1], 10);
        if (code === 36) inRegion = true;
        if (code === 37) inRegion = false;
        if (code === 1 || code === 2 || code === 3) curGMode = code;
        if (code === 74) curQuad = 'single';
        if (code === 75) curQuad = 'multi';
        layer.commands.push({ type: 'gcode', raw, code });
        continue;
      }

      if (/^M0?[012]$/.test(raw)) {
        layer.commands.push({ type: 'mcode', raw });
        continue;
      }

      // combined operation block: optional G, X, Y, I, J, then D01/D02/D03
      m = /^(?:G(\d{1,2}))?(?:X(-?\d+))?(?:Y(-?\d+))?(?:I(-?\d+))?(?:J(-?\d+))?D0?([123])$/.exec(raw);
      if (m) {
        const gcode = m[1] !== undefined ? parseInt(m[1], 10) : null;
        if (gcode === 36) inRegion = true;
        if (gcode === 37) inRegion = false;
        if (gcode === 1 || gcode === 2 || gcode === 3) curGMode = gcode;
        const hasX = m[2] !== undefined, hasY = m[3] !== undefined;
        const hasI = m[4] !== undefined, hasJ = m[5] !== undefined;
        const xVal = hasX ? intToReal(m[2], layer.fs.xDec) : curX;
        const yVal = hasY ? intToReal(m[3], layer.fs.yDec) : curY;
        const iVal = hasI ? intToReal(m[4], layer.fs.xDec) : 0;
        const jVal = hasJ ? intToReal(m[5], layer.fs.yDec) : 0;
        const op = 'D0' + m[6];
        const stmt = {
          type: 'op', raw, op, gcode,
          x: xVal, y: yVal, i: iVal, j: jVal,
          hasX, hasY, hasI, hasJ,
          prevX: curX, prevY: curY,
          dcode: curAperture,
          polarity: curPolarity,
          region: inRegion && op !== 'D03',
          gmode: curGMode,
          quad: curQuad
        };
        curX = xVal; curY = yVal;
        layer.commands.push(stmt);
        continue;
      }

      // unknown/unsupported statement -> passthrough
      layer.commands.push({ type: 'raw', raw });
    }

    return layer;
  }

  function tokenize(text) {
    const out = [];
    let i = 0;
    const n = text.length;
    while (i < n) {
      const c = text[i];
      if (c === '\r' || c === '\n' || c === ' ' || c === '\t') { i++; continue; }
      if (c === '%') {
        const end = text.indexOf('%', i + 1);
        if (end === -1) { i = n; break; }
        let body = text.slice(i + 1, end).replace(/\s+$/, '');
        // strip trailing * inside the extended command, keep inner structure for AM blocks
        if (body.endsWith('*')) body = body.slice(0, -1);
        out.push({ extended: true, raw: body });
        i = end + 1;
        continue;
      }
      const star = text.indexOf('*', i);
      if (star === -1) { i = n; break; }
      const raw = text.slice(i, star).replace(/\s+/g, '');
      if (raw.length > 0) out.push({ extended: false, raw });
      i = star + 1;
    }
    return out;
  }

  function intToReal(intStr, decDigits) {
    const neg = intStr.startsWith('-');
    const digits = neg ? intStr.slice(1) : intStr;
    const val = parseInt(digits, 10) / Math.pow(10, decDigits);
    return neg ? -val : val;
  }

  function realToIntStr(value, decDigits) {
    let v = Math.round(value * Math.pow(10, decDigits));
    return String(v);
  }

  function parseExtended(body) {
    let m;
    if ((m = /^FS([LT])([AI])X(\d)(\d)Y(\d)(\d)$/.exec(body))) {
      return { kind: 'FS', fs: { zeroOmission: m[1], mode: m[2], xInt: +m[3], xDec: +m[4], yInt: +m[5], yDec: +m[6] } };
    }
    if ((m = /^MO(MM|IN)$/.exec(body))) {
      return { kind: 'MO', unit: m[1] };
    }
    if ((m = /^ADD(\d+)([A-Za-z_$][A-Za-z0-9_]*)(?:,([^*]*))?$/.exec(body))) {
      const dcode = parseInt(m[1], 10);
      const shapeToken = m[2];
      const paramStr = m[3] || '';
      if (shapeToken === 'C' || shapeToken === 'R' || shapeToken === 'O') {
        const params = paramStr.split('X').map(p => parseFloat(p)).filter(v => !isNaN(v));
        return { kind: 'AD', dcode, shape: shapeToken, params };
      }
      // Polygon or macro aperture -> passthrough, keep raw params for potential future use
      return { kind: 'AD', dcode, shape: shapeToken === 'P' ? 'P' : 'MACRO', params: [], macroName: shapeToken };
    }
    if ((m = /^LP([DC])$/.exec(body))) {
      return { kind: 'LP', polarity: m[1] };
    }
    return { kind: 'OTHER' };
  }

  // ---- Writer ----

  function layerToText(layer) {
    const lines = [];
    for (const cmd of layer.commands) {
      switch (cmd.type) {
        case 'fs':
        case 'mo':
        case 'ad':
        case 'lp':
        case 'extended':
          lines.push('%' + cmd.raw + '*%');
          break;
        case 'aselect':
          lines.push(cmd.raw + '*');
          break;
        case 'gcode':
        case 'mcode':
        case 'comment':
        case 'raw':
          lines.push(cmd.raw + '*');
          break;
        case 'op':
          lines.push(cmd.raw + '*');
          break;
        default:
          lines.push(cmd.raw + '*');
      }
    }
    return lines.join('\n') + '\n';
  }

  // Rebuild the raw text of an 'op' statement from its fields (used after edits)
  function rebuildOpRaw(stmt, fs) {
    let s = '';
    if (stmt.gcode !== null && stmt.gcode !== undefined) {
      s += 'G' + String(stmt.gcode).padStart(2, '0');
    }
    if (stmt.hasX) s += 'X' + realToIntStr(stmt.x, fs.xDec);
    if (stmt.hasY) s += 'Y' + realToIntStr(stmt.y, fs.yDec);
    if (stmt.hasI) s += 'I' + realToIntStr(stmt.i, fs.xDec);
    if (stmt.hasJ) s += 'J' + realToIntStr(stmt.j, fs.yDec);
    s += stmt.op;
    return s;
  }

  function rebuildAdRaw(dcode, shape, params, macroName) {
    if (shape === 'C' || shape === 'R' || shape === 'O') {
      return 'ADD' + dcode + shape + ',' + params.map(p => trimNum(p)).join('X');
    }
    // macro/polygon apertures aren't reconstructed from params (opaque) - caller should not hit this path
    return 'ADD' + dcode + (macroName || shape);
  }

  function trimNum(n) {
    // avoid float artifacts like 0.30000000000000004
    let s = n.toFixed(6);
    s = s.replace(/0+$/, '').replace(/\.$/, '.0');
    if (s.indexOf('.') === -1) s += '.0';
    return s;
  }

  // ---- Editing helpers ----

  function getFlashes(layer) {
    return layer.commands.filter(c => c.type === 'op' && c.op === 'D03');
  }

  function toFileUnits(layer, mm) {
    return layer.units === 'IN' ? mm / 25.4 : mm;
  }
  function toMm(layer, val) {
    return layer.units === 'IN' ? val * 25.4 : val;
  }

  // Some Gerber exporters omit X and/or Y on a command when it's unchanged from the current
  // point, e.g. "Y2000D03*" reuses the last X. If we then move an earlier command that feeds
  // that point, every command inheriting from it would silently shift too - even if the user
  // never selected it. To prevent that, freeze every downstream command that would otherwise
  // inherit the axis we're about to change: bake its current (unchanged) resolved coordinate
  // into its own raw text so it becomes independent of whatever happens upstream.
  function freezeDownstreamImplicitCoords(layer, fromIndex) {
    let xDone = false, yDone = false;
    for (let i = fromIndex + 1; i < layer.commands.length && !(xDone && yDone); i++) {
      const c = layer.commands[i];
      if (c.type !== 'op') continue;
      let changed = false;
      if (!xDone) { if (c.hasX) xDone = true; else { c.hasX = true; changed = true; } }
      if (!yDone) { if (c.hasY) yDone = true; else { c.hasY = true; changed = true; } }
      if (changed) c.raw = rebuildOpRaw(c, layer.fs);
    }
  }

  // Move a flash to a new position given in millimeters
  function setFlashPosition(layer, flashCmd, xMm, yMm) {
    const x = toFileUnits(layer, xMm);
    const y = toFileUnits(layer, yMm);
    const idx = layer.commands.indexOf(flashCmd);
    freezeDownstreamImplicitCoords(layer, idx);
    flashCmd.x = x;
    flashCmd.y = y;
    flashCmd.hasX = true;
    flashCmd.hasY = true;
    flashCmd.raw = rebuildOpRaw(flashCmd, layer.fs);
  }

  // Remove one or more flashes (pads) from the layer entirely. A D03 flash also advances the
  // "current point", so - same reasoning as setFlashPosition - any downstream command that
  // omits X/Y and would have inherited its position from a deleted flash is frozen (its
  // resolved coordinate baked into its own raw text) first, so deleting a pad never silently
  // shifts some other, unrelated command that happened to come after it.
  function removeFlashes(layer, flashCmds) {
    let removed = 0;
    flashCmds.forEach(f => {
      const idx = layer.commands.indexOf(f);
      if (idx === -1) return;
      freezeDownstreamImplicitCoords(layer, idx);
      layer.commands.splice(idx, 1);
      removed++;
    });
    return removed;
  }

  // Find an existing aperture definition with the given shape and params (within EPS), if any -
  // used by addFlash so placing several new pads of the same size reuses one AD line.
  function findMatchingAperture(layer, shape, params) {
    const EPS = 1e-6;
    for (const key in layer.apertures) {
      const ap = layer.apertures[key];
      if (ap.shape !== shape || ap.params.length !== params.length) continue;
      if (ap.params.every((v, i) => Math.abs(v - params[i]) < EPS)) return parseInt(key, 10);
    }
    return null;
  }

  // Add a brand-new flash (pad) to the layer at the given position. xMm/yMm and params are in
  // millimeters/inches matching the layer's own units (same convention as setFlashesSize/
  // apertureExtents). Reuses a matching existing aperture if one exists, otherwise defines a new
  // one. The new AD/aselect/flash are inserted right before any trailing M00/M02 at the end of
  // the command stream, so nothing downstream could ever inherit its coordinates.
  function addFlash(layer, shape, params, xMm, yMm) {
    if (shape !== 'C' && shape !== 'R' && shape !== 'O') {
      throw new Error('Unsupported aperture shape: ' + shape);
    }
    const x = toFileUnits(layer, xMm);
    const y = toFileUnits(layer, yMm);

    let dcode = findMatchingAperture(layer, shape, params);
    let insertIdx = layer.commands.length;
    while (insertIdx > 0 && layer.commands[insertIdx - 1].type === 'mcode') insertIdx--;

    if (dcode === null) {
      dcode = layer.maxDcode + 1;
      layer.maxDcode = dcode;
      const raw = rebuildAdRaw(dcode, shape, params, null);
      layer.apertures[dcode] = { shape, params, macroName: null, raw };
      let adInsertAt = 0;
      for (let i = 0; i < layer.commands.length; i++) {
        if (layer.commands[i].type === 'ad') adInsertAt = i + 1;
      }
      layer.commands.splice(adInsertAt, 0, { type: 'ad', raw, dcode });
      if (adInsertAt <= insertIdx) insertIdx++;
    }

    layer.commands.splice(insertIdx, 0, { type: 'aselect', raw: 'D' + dcode, dcode });
    insertIdx++;

    const flashCmd = {
      type: 'op', raw: '', op: 'D03', gcode: null,
      x, y, i: 0, j: 0,
      hasX: true, hasY: true, hasI: false, hasJ: false,
      prevX: x, prevY: y,
      dcode, polarity: 'D',
      region: false, gmode: 1, quad: 'single'
    };
    flashCmd.raw = rebuildOpRaw(flashCmd, layer.fs);
    layer.commands.splice(insertIdx, 0, flashCmd);

    return flashCmd;
  }

  // ---- Vector stroke font (for addText) ----
  // Gerber has no native text primitive - real Gerber silkscreen text is always plain vector
  // artwork (line draws), same as any trace. Each glyph below is defined on a fixed grid
  // (baseline y=0, cap-height y=10, x grows right) as one or more open polylines ("strokes");
  // a degenerate single-point stroke (start === end) intentionally renders as a round dot
  // (relies on the renderer's round line caps) for punctuation like '.' and ':'.
  // `w` is the glyph's advance width in the same grid units.
  const FONT_STROKES = {
    ' ': { w: 6, strokes: [] },
    '0': { w: 7, strokes: [[[2, 0], [0.5, 1.5], [0, 3], [0, 7], [0.5, 8.5], [2, 10], [4, 10], [6, 8.5], [6.5, 7], [6.5, 3], [6, 1.5], [4, 0], [2, 0]]] },
    '1': { w: 5, strokes: [[[0.5, 8], [2, 10], [2, 0]], [[0.5, 0], [3.5, 0]]] },
    '2': { w: 7, strokes: [[[0, 7], [0, 9], [2, 10], [4, 10], [6, 9], [6, 7], [0, 1], [0, 0], [6, 0]]] },
    '3': { w: 7, strokes: [[[0, 9], [1, 10], [5, 10], [6, 9], [6, 6], [3, 5], [6, 4], [6, 1], [5, 0], [1, 0], [0, 1]]] },
    '4': { w: 7, strokes: [[[4.5, 0], [4.5, 10], [0, 3], [6.5, 3]]] },
    '5': { w: 7, strokes: [[[6, 10], [0, 10], [0, 5], [4, 5], [6, 3.5], [6, 1], [5, 0], [1, 0], [0, 1]]] },
    '6': { w: 7, strokes: [[[6, 9], [4, 10], [2, 10], [0, 7], [0, 2], [2, 0], [4, 0], [6, 2], [6, 4], [4, 5.5], [0, 5]]] },
    '7': { w: 7, strokes: [[[0, 10], [6.5, 10], [2, 0]]] },
    '8': { w: 7, strokes: [[[2, 5], [0, 6.5], [0, 8.5], [2, 10], [4, 10], [6, 8.5], [6, 6.5], [2, 5], [6, 3.5], [6, 1.5], [4, 0], [2, 0], [0, 1.5], [0, 3.5], [2, 5]]] },
    '9': { w: 7, strokes: [[[4.5, 5.5], [2.5, 5.3], [1, 6.3], [0.7, 8], [1.7, 9.3], [3.5, 10], [5, 9.5], [5.8, 8], [5.5, 6.3], [4.5, 5.5]], [[5.6, 7], [5, 3], [3, 0.3], [1, 0]]] },
    'A': { w: 8, strokes: [[[0, 0], [4, 10], [8, 0]], [[1.6, 3.5], [6.4, 3.5]]] },
    'B': { w: 7, strokes: [[[0, 0], [0, 10], [4.5, 10], [6, 8.5], [6, 6.5], [4.5, 5], [0, 5]], [[0, 5], [5, 5], [6.5, 3.5], [6.5, 1.5], [5, 0], [0, 0]]] },
    'C': { w: 7, strokes: [[[6, 2], [4, 0], [2, 0], [0, 2], [0, 8], [2, 10], [4, 10], [6, 8]]] },
    'D': { w: 7, strokes: [[[0, 0], [0, 10], [3.5, 10], [6, 7.5], [6, 2.5], [3.5, 0], [0, 0]]] },
    'E': { w: 6.5, strokes: [[[6, 10], [0, 10], [0, 0], [6, 0]], [[0, 5], [4.5, 5]]] },
    'F': { w: 6.5, strokes: [[[6, 10], [0, 10], [0, 0]], [[0, 5], [4.5, 5]]] },
    'G': { w: 7.5, strokes: [[[7, 7], [5.5, 9.5], [3.5, 10], [1.5, 9], [0.3, 6.5], [0.3, 3.5], [1.5, 1], [3.5, 0], [5.5, 0.5], [7, 3]], [[7, 5], [3.5, 5], [3.5, 2]]] },
    'H': { w: 7, strokes: [[[0, 0], [0, 10]], [[6, 0], [6, 10]], [[0, 5], [6, 5]]] },
    'I': { w: 3, strokes: [[[1.5, 0], [1.5, 10]]] },
    'J': { w: 6, strokes: [[[5, 10], [5, 2], [3.5, 0], [1.5, 0], [0, 2]]] },
    'K': { w: 7, strokes: [[[0, 0], [0, 10]], [[6, 10], [0, 4.5]], [[1.8, 6], [6, 0]]] },
    'L': { w: 6, strokes: [[[0, 10], [0, 0], [6, 0]]] },
    'M': { w: 8.5, strokes: [[[0, 0], [0, 10], [4.25, 4], [8.5, 10], [8.5, 0]]] },
    'N': { w: 7.5, strokes: [[[0, 0], [0, 10], [7.5, 0], [7.5, 10]]] },
    'O': { w: 7.5, strokes: [[[2.5, 0], [0.5, 1.5], [0, 3], [0, 7], [0.5, 8.5], [2.5, 10], [5, 10], [7, 8.5], [7.5, 7], [7.5, 3], [7, 1.5], [5, 0], [2.5, 0]]] },
    'P': { w: 6.5, strokes: [[[0, 0], [0, 10], [4.5, 10], [6.5, 8], [6.5, 6], [4.5, 4], [0, 4]]] },
    'Q': { w: 7.5, strokes: [[[2.5, 0], [0.5, 1.5], [0, 3], [0, 7], [0.5, 8.5], [2.5, 10], [5, 10], [7, 8.5], [7.5, 7], [7.5, 3], [7, 1.5], [5, 0], [2.5, 0]], [[4, 2.5], [7.5, -1.5]]] },
    'R': { w: 7, strokes: [[[0, 0], [0, 10], [4.5, 10], [6.5, 8], [6.5, 6], [4.5, 4], [0, 4]], [[3, 4], [6.5, 0]]] },
    'S': { w: 7, strokes: [[[6, 8.5], [4, 10], [2, 10], [0, 8.5], [0, 6.5], [2, 5], [4.5, 5], [6.5, 3.5], [6.5, 1.5], [4.5, 0], [1.5, 0], [0, 1.5]]] },
    'T': { w: 7, strokes: [[[0, 10], [7, 10]], [[3.5, 10], [3.5, 0]]] },
    'U': { w: 7.5, strokes: [[[0, 10], [0, 3], [1.5, 0.5], [3.75, 0], [6, 0.5], [7.5, 3], [7.5, 10]]] },
    'V': { w: 7.5, strokes: [[[0, 10], [3.75, 0], [7.5, 10]]] },
    'W': { w: 10, strokes: [[[0, 10], [2.5, 0], [5, 7], [7.5, 0], [10, 10]]] },
    'X': { w: 7, strokes: [[[0, 10], [7, 0]], [[0, 0], [7, 10]]] },
    'Y': { w: 7, strokes: [[[0, 10], [3.5, 4.5], [7, 10]], [[3.5, 4.5], [3.5, 0]]] },
    'Z': { w: 6.5, strokes: [[[0, 10], [6.5, 10], [0, 0], [6.5, 0]]] },
    '.': { w: 3, strokes: [[[1, 0], [1.3, 0.3]]] },
    ',': { w: 3, strokes: [[[1, 0], [1.3, 0.3]], [[1.3, 0], [0.3, -2]]] },
    ':': { w: 3, strokes: [[[1.2, 6], [1.5, 6.3]], [[1.2, 1.5], [1.5, 1.8]]] },
    ';': { w: 3, strokes: [[[1.2, 6], [1.5, 6.3]], [[1.2, 1.5], [1.5, 1.8]], [[1.5, 1.5], [0.5, -1.5]]] },
    '-': { w: 5, strokes: [[[0.5, 4], [4.5, 4]]] },
    '_': { w: 6, strokes: [[[0, -1], [6, -1]]] },
    '/': { w: 6, strokes: [[[0, 0], [6, 10]]] },
    '(': { w: 4, strokes: [[[3, 10], [1, 7], [1, 3], [3, 0]]] },
    ')': { w: 4, strokes: [[[1, 10], [3, 7], [3, 3], [1, 0]]] },
    '+': { w: 6, strokes: [[[3, 1], [3, 7]], [[0, 4], [6, 4]]] },
    '=': { w: 6, strokes: [[[0, 3], [6, 3]], [[0, 6], [6, 6]]] },
    '#': { w: 7, strokes: [[[1.5, 0], [1.5, 10]], [[5, 0], [5, 10]], [[0, 3.3], [6.5, 3.3]], [[0, 6.6], [6.5, 6.6]]] },
    "'": { w: 2.5, strokes: [[[1, 8], [1.5, 10]]] },
    '"': { w: 4, strokes: [[[1, 8], [1.5, 10]], [[2.7, 8], [3.2, 10]]] },
    '!': { w: 2.5, strokes: [[[1.2, 10], [1, 3]], [[1, 0], [1.3, 0.3]]] },
    '?': { w: 6, strokes: [[[0, 8], [1, 10], [4, 10], [5.5, 8.5], [5.5, 7], [3, 5], [3, 3]], [[3, 0], [3.3, 0.3]]] }
  };
  const FONT_FALLBACK = { w: 7, strokes: [[[0.5, 0], [0.5, 10], [6, 10], [6, 0], [0.5, 0]]] };
  const FONT_LETTER_GAP = 1.2; // grid units between glyphs' advance boxes

  // Total advance width of `text` in mm at the given cap height, ignoring the font's inherent
  // left margin. Useful for centering or right-aligning text before calling addText.
  function textWidthMm(text, heightMm) {
    const scale = heightMm / 10;
    let units = 0;
    for (const ch of text) {
      const glyph = FONT_STROKES[ch.toUpperCase()] || (ch === ' ' ? FONT_STROKES[' '] : FONT_FALLBACK);
      units += glyph.w + FONT_LETTER_GAP;
    }
    if (units > 0) units -= FONT_LETTER_GAP;
    return units * scale;
  }

  // Add a line of text to the layer as plain vector strokes (there is no text primitive in
  // Gerber - this is exactly how real EDA tools generate silkscreen text). (xMm, yMm) is the
  // bottom-left baseline anchor of the first character. heightMm is the cap height; strokeWidthMm
  // defaults to a legible ~15% of the height if omitted. Reuses a matching circular aperture as
  // the "pen" if one already exists (same dedup logic as addFlash), otherwise defines a new one.
  // Unsupported characters are drawn as a small placeholder box instead of silently vanishing.
  //
  // Every generated command is tagged with a shared `textId` and a matching entry is kept in
  // layer.texts, so the app can re-select/re-edit/delete this text later in the same session
  // (see removeText/editText). This bookkeeping is editor-only metadata, not part of the Gerber
  // format - it does not survive a save+reload of the file.
  function addText(layer, text, xMm, yMm, heightMm, strokeWidthMm) {
    const strokeW = strokeWidthMm || heightMm * 0.15;
    const textId = ++layer.maxTextId;
    const x0 = toFileUnits(layer, xMm);
    const y0 = toFileUnits(layer, yMm);
    const scale = toFileUnits(layer, heightMm) / 10;

    let dcode = findMatchingAperture(layer, 'C', [strokeW]);
    let insertIdx = layer.commands.length;
    while (insertIdx > 0 && layer.commands[insertIdx - 1].type === 'mcode') insertIdx--;

    if (dcode === null) {
      dcode = layer.maxDcode + 1;
      layer.maxDcode = dcode;
      const raw = rebuildAdRaw(dcode, 'C', [strokeW], null);
      layer.apertures[dcode] = { shape: 'C', params: [strokeW], macroName: null, raw };
      let adInsertAt = 0;
      for (let i = 0; i < layer.commands.length; i++) {
        if (layer.commands[i].type === 'ad') adInsertAt = i + 1;
      }
      layer.commands.splice(adInsertAt, 0, { type: 'ad', raw, dcode });
      if (adInsertAt <= insertIdx) insertIdx++;
    }

    layer.commands.splice(insertIdx, 0, { type: 'aselect', raw: 'D' + dcode, dcode });
    insertIdx++;

    const created = [];
    let penX = 0;
    let curX = x0, curY = y0; // running pen position (file units), threaded through as prevX/prevY
    for (const ch of text) {
      const glyph = FONT_STROKES[ch.toUpperCase()] || (ch === ' ' ? FONT_STROKES[' '] : FONT_FALLBACK);
      glyph.strokes.forEach(stroke => {
        stroke.forEach((pt, i) => {
          const targetX = x0 + (penX + pt[0]) * scale;
          const targetY = y0 + pt[1] * scale;
          const cmd = {
            type: 'op', raw: '', op: i === 0 ? 'D02' : 'D01', gcode: i === 0 ? null : 1,
            x: targetX, y: targetY, i: 0, j: 0,
            hasX: true, hasY: true, hasI: false, hasJ: false,
            prevX: curX, prevY: curY, dcode, polarity: 'D',
            region: false, gmode: 1, quad: 'single', textId
          };
          curX = targetX; curY = targetY;
          cmd.raw = rebuildOpRaw(cmd, layer.fs);
          layer.commands.splice(insertIdx, 0, cmd);
          insertIdx++;
          created.push(cmd);
        });
      });
      penX += glyph.w + FONT_LETTER_GAP;
    }

    const widthMm = Math.max(0, penX - FONT_LETTER_GAP) * (heightMm / 10);
    layer.texts[textId] = { id: textId, text, x: xMm, y: yMm, height: heightMm, strokeWidth: strokeW, width: widthMm, dcode };

    return { id: textId, commands: created, widthMm };
  }

  // Remove a text object (all its generated stroke commands) previously created by addText/
  // editText. Freezes whatever immediately follows the removed block so it can't inherit implicit
  // coordinates from a command that's about to disappear (same reasoning as removeFlashes).
  function removeText(layer, textId) {
    const idxs = [];
    layer.commands.forEach((c, i) => { if (c.textId === textId) idxs.push(i); });
    if (idxs.length === 0) return false;
    freezeDownstreamImplicitCoords(layer, Math.max(...idxs));
    idxs.sort((a, b) => b - a).forEach(i => layer.commands.splice(i, 1));
    delete layer.texts[textId];
    return true;
  }

  // Replace an existing text object with new content/position/size. Implemented as remove-then-
  // add, so the result gets a NEW textId - callers must update whatever they had selected to the
  // returned id.
  function editText(layer, textId, text, xMm, yMm, heightMm, strokeWidthMm) {
    removeText(layer, textId);
    return addText(layer, text, xMm, yMm, heightMm, strokeWidthMm);
  }

  // Move a text object to an absolute position without regenerating its strokes - just shifts
  // every one of its commands (and their prevX/prevY, which for a text block always point at
  // another command within the same block) by the same delta. Used for mouse-drag repositioning,
  // where regenerating the whole glyph geometry on every mousemove would be wasteful.
  function setTextPosition(layer, textId, xMm, yMm) {
    const tx = layer.texts[textId];
    if (!tx) return false;
    const dx = toFileUnits(layer, xMm - tx.x);
    const dy = toFileUnits(layer, yMm - tx.y);
    layer.commands.forEach(c => {
      if (c.textId === textId) {
        c.x += dx; c.y += dy;
        c.prevX += dx; c.prevY += dy;
        c.raw = rebuildOpRaw(c, layer.fs);
      }
    });
    tx.x = xMm; tx.y = yMm;
    return true;
  }

  // Change the size of one or more flashes at once. newParams are in the layer's native units
  // already (mm or inch, matching aperture definition convention), e.g. [diameter] for C, [w,h]
  // for R/O. Flashes are grouped by their current aperture: if every flash using a given aperture
  // is included in flashCmds, that aperture definition is simply edited in place; otherwise a
  // single new aperture is cloned and shared by every flash in the group (so a batch resize of
  // 50 pads that share one aperture produces one new AD line, not fifty).
  function setFlashesSize(layer, flashCmds, newParams) {
    const byDcode = new Map();
    flashCmds.forEach(f => {
      if (!byDcode.has(f.dcode)) byDcode.set(f.dcode, []);
      byDcode.get(f.dcode).push(f);
    });

    const results = new Map(); // original dcode -> resulting dcode

    byDcode.forEach((group, dcode) => {
      const ap = layer.apertures[dcode];
      if (!ap || (ap.shape !== 'C' && ap.shape !== 'R' && ap.shape !== 'O')) {
        return; // skip non-editable (macro/polygon) apertures, leave those flashes untouched
      }

      const totalUsage = getFlashes(layer).filter(f => f.dcode === dcode).length;

      if (group.length >= totalUsage) {
        ap.params = newParams;
        ap.raw = rebuildAdRaw(dcode, ap.shape, newParams, ap.macroName);
        const adCmd = layer.commands.find(c => c.type === 'ad' && c.dcode === dcode);
        if (adCmd) adCmd.raw = ap.raw;
        results.set(dcode, dcode);
        return;
      }

      const newDcode = layer.maxDcode + 1;
      layer.maxDcode = newDcode;
      const newAp = { shape: ap.shape, params: newParams, macroName: ap.macroName, raw: rebuildAdRaw(newDcode, ap.shape, newParams, ap.macroName) };
      layer.apertures[newDcode] = newAp;

      let insertAt = 0;
      for (let i = 0; i < layer.commands.length; i++) {
        if (layer.commands[i].type === 'ad') insertAt = i + 1;
      }
      layer.commands.splice(insertAt, 0, { type: 'ad', raw: newAp.raw, dcode: newDcode });

      group.forEach(flashCmd => {
        let flashIndex = layer.commands.indexOf(flashCmd);
        layer.commands.splice(flashIndex, 0, { type: 'aselect', raw: 'D' + newDcode, dcode: newDcode });
        flashIndex = layer.commands.indexOf(flashCmd);
        flashCmd.dcode = newDcode;
        layer.commands.splice(flashIndex + 1, 0, { type: 'aselect', raw: 'D' + dcode, dcode: dcode });
      });
      results.set(dcode, newDcode);
    });

    return results;
  }

  // Change the size of a single flash's aperture. Convenience wrapper around setFlashesSize.
  function setFlashSize(layer, flashCmd, newParams) {
    const ap = layer.apertures[flashCmd.dcode];
    if (!ap) throw new Error('Unknown aperture D' + flashCmd.dcode);
    if (ap.shape !== 'C' && ap.shape !== 'R' && ap.shape !== 'O') {
      throw new Error('Aperture shape ' + ap.shape + ' is not editable (macro/polygon)');
    }
    setFlashesSize(layer, [flashCmd], newParams);
    return flashCmd.dcode;
  }

  // Bounding box (half-width/half-height in native units) for a given aperture, used for
  // rendering + hit-testing. Falls back to a small dot for macro/polygon apertures.
  function apertureExtents(ap) {
    if (!ap) return { hw: 0.15, hh: 0.15, shape: 'C' };
    if (ap.shape === 'C') {
      const d = ap.params[0] || 0.3;
      return { hw: d / 2, hh: d / 2, shape: 'C', diameter: d };
    }
    if (ap.shape === 'R' || ap.shape === 'O') {
      const w = ap.params[0] || 0.3;
      const h = ap.params[1] || 0.3;
      return { hw: w / 2, hh: h / 2, shape: ap.shape, w, h };
    }
    return { hw: 0.2, hh: 0.2, shape: 'MACRO' };
  }

  global.Gerber = {
    parseGerber,
    layerToText,
    rebuildOpRaw,
    rebuildAdRaw,
    intToReal,
    realToIntStr,
    trimNum,
    getFlashes,
    setFlashPosition,
    setFlashSize,
    setFlashesSize,
    removeFlashes,
    addFlash,
    addText,
    removeText,
    editText,
    setTextPosition,
    textWidthMm,
    apertureExtents,
    toMm,
    toFileUnits
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = global.Gerber;
  }
})(typeof window !== 'undefined' ? window : globalThis);
