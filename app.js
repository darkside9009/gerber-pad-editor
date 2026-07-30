(function () {
  'use strict';

  const COLORS = ['#4da3ff', '#ff9f4d', '#4dd68a', '#ff5c8a', '#c98fff', '#ffe14d', '#4defd6', '#ff7a4d'];

  // ---------- i18n ----------
  const I18N = {
    de: {
      appTitle: 'Gerber Pad Editor',
      loadLayer: 'Layer laden…',
      fitView: 'Ansicht anpassen',
      undoBtn: '↶ Rückgängig',
      undoTitle: 'Rückgängig (Strg/Cmd+Z)',
      redoBtn: '↷ Wiederholen',
      redoTitle: 'Wiederholen (Strg/Cmd+Shift+Z)',
      setOriginBtn: 'Nullpunkt setzen',
      setOriginTitle: 'Klicke danach auf einen Punkt im Canvas, um ihn als Nullpunkt für HUD und Messfunktion festzulegen (Esc = abbrechen)',
      resetOriginTitle: 'Nullpunkt auf Datei-Ursprung (0,0) zurücksetzen',
      measureBtn: 'Messen',
      measureTitle: 'Distanz zwischen zwei Punkten messen (Esc = beenden)',
      addPadTitle: 'Neues Pad (Kreis/Rechteck) zeichnen und platzieren (Esc = beenden)',
      addTextTitle: 'Text als Vektor-Strichzeichnung hinzufügen (Esc = beenden)',
      downloadZipBtn: 'Alle als ZIP herunterladen',
      layersHeading: 'Layer',
      hintText: 'Scrollen = Zoom · Ziehen = Verschieben · Klick = Pad wählen · Shift+Klick = Mehrfachauswahl · Shift+Ziehen = Rahmenauswahl · Entf = Löschen · Esc = Nullpunkt/Messen abbrechen',
      inspectorHeading: 'Pad-Eigenschaften',
      statusReady: 'Bereit.',
      layerListEmpty: 'Noch keine Datei geladen. Lade eine oder mehrere Gerber-Dateien über „Layer laden…“.',
      statusUndo: 'Rückgängig gemacht ({{name}}).',
      statusRedo: 'Wiederholt ({{name}}).',
      alertReadError: 'Konnte Datei nicht lesen: {{name}}\n{{message}}',
      statusLayerLoaded: 'Layer geladen: {{name}} ({{count}} Pads gefunden)',
      setActiveLayerTitle: 'Als aktiven (bearbeitbaren) Layer setzen',
      visibleLabel: 'sichtbar',
      dirtyBadge: '● geändert',
      downloadBtnLabel: 'Download',
      resetBtnLabel: 'Zurücksetzen',
      removeBtnLabel: 'Entfernen',
      confirmResetLayer: 'Alle Änderungen an "{{name}}" verwerfen?',
      hudDeltaLine: '&Delta;: {{dist}} mm (dx {{dx}}, dy {{dy}})',
      hudMeasureLine: 'Messung: {{dist}} mm (dx {{dx}}, dy {{dy}})',
      statusClickSetOrigin: 'Klicke auf einen Punkt im Canvas, um ihn als Nullpunkt festzulegen.',
      statusOriginReset: 'Nullpunkt zurückgesetzt auf Datei-Ursprung (0,0).',
      statusMeasureActive: 'Messmodus aktiv: Klicke zwei Punkte, um die Distanz zu messen. Esc = beenden.',
      alertNoActiveLayerLong: 'Bitte zuerst einen Layer laden und links als aktiv auswählen.',
      statusAddPadActive: 'Klicke auf eine Stelle im Canvas, um dort ein Pad zu platzieren - oder gib X/Y ein und klicke „Pad erstellen“. Esc = beenden.',
      statusOriginSet: 'Nullpunkt gesetzt (absolute Datei-Koordinaten X={{x}}mm, Y={{y}}mm).',
      confirmDeleteOne: 'Dieses Pad löschen?',
      confirmDeleteMany: '{{count}} Pads löschen?',
      statusPadDeleted: 'Pad gelöscht.',
      statusPadsDeleted: '{{count}} Pads gelöscht.',
      addPadHint: 'Klicke auf eine Stelle im Canvas, um dort ein Pad mit den unten eingestellten Eigenschaften zu platzieren - oder gib X/Y direkt ein und klicke „Pad erstellen“.',
      shapeLabel: 'Form',
      shapeCircle: 'Kreis (rund, voll)',
      shapeRect: 'Rechteck',
      diameterLabel: 'Durchmesser ({{unit}})',
      widthLabel: 'Breite ({{unit}})',
      heightLabel: 'Höhe ({{unit}})',
      xLabel: 'X ({{unit}})',
      yLabel: 'Y ({{unit}})',
      createPadBtn: 'Pad erstellen',
      doneBtn: 'Beenden',
      alertNoActiveLayerShort: 'Kein aktiver Layer ausgewählt.',
      alertInvalidDiameter: 'Ungültiger Durchmesser.',
      alertInvalidWH: 'Ungültige Breite/Höhe.',
      alertInvalidPosition: 'Ungültige Position.',
      statusPadCreated: 'Pad erstellt bei X={{x}}mm, Y={{y}}mm.',
      statusAddTextActive: 'Klicke auf eine Stelle im Canvas, um dort den Text zu platzieren - oder gib X/Y ein und klicke „Text erstellen“. Esc = beenden.',
      addTextHint: 'Klicke auf eine Stelle im Canvas, um dort den unten eingestellten Text zu platzieren (X/Y = untere linke Ecke) - oder gib X/Y direkt ein und klicke „Text erstellen“. Text wird als Vektor-Strichzeichnung eingefügt und kann danach nicht mehr als Ganzes ausgewählt/verschoben werden - bei Bedarf einfach rückgängig machen (Strg/Cmd+Z) und neu platzieren.',
      textContentLabel: 'Text',
      strokeWidthLabel: 'Strichstärke ({{unit}}) - leer = automatisch',
      createTextBtn: 'Text erstellen',
      alertEmptyText: 'Bitte einen Text eingeben.',
      alertInvalidHeight: 'Ungültige Höhe.',
      alertInvalidStrokeWidth: 'Ungültige Strichstärke.',
      statusTextCreated: 'Text erstellt bei X={{x}}mm, Y={{y}}mm.',
      deleteTextBtn: 'Text löschen',
      statusTextUpdated: 'Text aktualisiert.',
      confirmDeleteText: 'Diesen Text löschen?',
      statusTextDeleted: 'Text gelöscht.',
      inspectorEmptyNoSelection: 'Kein Pad ausgewählt. Wähle zuerst links den zu bearbeitenden Layer aus (aktiv) und klicke dann im Canvas auf ein Pad.<br><br>Shift+Klick = Pad zur Auswahl hinzufügen/entfernen.<br>Shift+Ziehen = mehrere Pads mit einem Rahmen auswählen.',
      layerLabel: 'Layer',
      apertureLabel: 'Apertur',
      macroNotEditable: 'Diese Apertur ist ein Makro/Polygon und kann in der Größe hier nicht bearbeitet werden. Position ist trotzdem änderbar.',
      applyBtn: 'Übernehmen',
      selectSameSizeBtn: 'Alle mit gleicher Größe auswählen',
      selectSameSizeXBtn: 'Alle mit gleicher Größe auf gleicher X-Achse auswählen',
      selectSameSizeYBtn: 'Alle mit gleicher Größe auf gleicher Y-Achse auswählen',
      deselectBtn: 'Auswahl aufheben',
      deletePadBtn: 'Pad löschen',
      alertInvalidSize: 'Ungültige Größe',
      statusPadUpdated: 'Pad aktualisiert.',
      statusSameSizeSelected: '{{count}} Pads mit Größe {{size}}{{axis}} ausgewählt.',
      axisXSuffix: ' auf gleicher X-Achse',
      axisYSuffix: ' auf gleicher Y-Achse',
      selectionLabel: 'Auswahl',
      selectionCount: '{{count}} Pads ausgewählt',
      moveOffsetHeading: 'Verschieben (Offset)',
      unifySizeHeading: 'Größe vereinheitlichen',
      diameterCircleLabel: 'Durchmesser (mm) – für Kreis-Pads in der Auswahl',
      unchangedPlaceholder: 'unverändert',
      widthRectLabel: 'Breite (mm) – Rechteck/Oval',
      heightRectLabel: 'Höhe (mm) – Rechteck/Oval',
      macroInSelection: '{{count}} Makro/Polygon-Pad(s) in der Auswahl – Größe davon nicht änderbar, Position wird trotzdem verschoben.',
      noEditableApertures: 'Keine editierbaren Aperturen in der Auswahl.',
      deleteManyPadsBtn: '{{count}} Pads löschen',
      alertInvalidOffset: 'Ungültiger Offset',
      statusPadsUpdated: '{{count}} Pads aktualisiert.'
    },
    en: {
      appTitle: 'Gerber Pad Editor',
      loadLayer: 'Load layer…',
      fitView: 'Fit view',
      undoBtn: '↶ Undo',
      undoTitle: 'Undo (Ctrl/Cmd+Z)',
      redoBtn: '↷ Redo',
      redoTitle: 'Redo (Ctrl/Cmd+Shift+Z)',
      setOriginBtn: 'Set origin',
      setOriginTitle: 'Then click a point on the canvas to set it as the origin for the HUD and measure tool (Esc = cancel)',
      resetOriginTitle: "Reset origin to the file's own (0,0)",
      measureBtn: 'Measure',
      measureTitle: 'Measure the distance between two points (Esc = stop)',
      addPadTitle: 'Draw and place a new pad (circle/rectangle) (Esc = stop)',
      addTextTitle: 'Add text as a vector line-art drawing (Esc = stop)',
      downloadZipBtn: 'Download all as ZIP',
      layersHeading: 'Layers',
      hintText: 'Scroll = zoom · Drag = pan · Click = select pad · Shift+Click = multi-select · Shift+Drag = box select · Del = delete · Esc = cancel origin/measure',
      inspectorHeading: 'Pad Properties',
      statusReady: 'Ready.',
      layerListEmpty: 'No file loaded yet. Load one or more Gerber files via “Load layer…”.',
      statusUndo: 'Undo ({{name}}).',
      statusRedo: 'Redo ({{name}}).',
      alertReadError: 'Could not read file: {{name}}\n{{message}}',
      statusLayerLoaded: 'Layer loaded: {{name}} ({{count}} pads found)',
      setActiveLayerTitle: 'Set as active (editable) layer',
      visibleLabel: 'visible',
      dirtyBadge: '● modified',
      downloadBtnLabel: 'Download',
      resetBtnLabel: 'Reset',
      removeBtnLabel: 'Remove',
      confirmResetLayer: 'Discard all changes to "{{name}}"?',
      hudDeltaLine: '&Delta;: {{dist}} mm (dx {{dx}}, dy {{dy}})',
      hudMeasureLine: 'Measurement: {{dist}} mm (dx {{dx}}, dy {{dy}})',
      statusClickSetOrigin: 'Click a point on the canvas to set it as the origin.',
      statusOriginReset: "Origin reset to the file's own (0,0).",
      statusMeasureActive: 'Measure mode active: click two points to measure the distance. Esc = stop.',
      alertNoActiveLayerLong: 'Please load a layer first and select it as active on the left.',
      statusAddPadActive: 'Click a spot on the canvas to place a pad there - or enter X/Y and click “Create pad”. Esc = stop.',
      statusOriginSet: 'Origin set (absolute file coordinates X={{x}}mm, Y={{y}}mm).',
      confirmDeleteOne: 'Delete this pad?',
      confirmDeleteMany: 'Delete {{count}} pads?',
      statusPadDeleted: 'Pad deleted.',
      statusPadsDeleted: '{{count}} pads deleted.',
      addPadHint: 'Click a spot on the canvas to place a pad with the properties set below - or enter X/Y directly and click “Create pad”.',
      shapeLabel: 'Shape',
      shapeCircle: 'Circle (round, filled)',
      shapeRect: 'Rectangle',
      diameterLabel: 'Diameter ({{unit}})',
      widthLabel: 'Width ({{unit}})',
      heightLabel: 'Height ({{unit}})',
      xLabel: 'X ({{unit}})',
      yLabel: 'Y ({{unit}})',
      createPadBtn: 'Create pad',
      doneBtn: 'Done',
      alertNoActiveLayerShort: 'No active layer selected.',
      alertInvalidDiameter: 'Invalid diameter.',
      alertInvalidWH: 'Invalid width/height.',
      alertInvalidPosition: 'Invalid position.',
      statusPadCreated: 'Pad created at X={{x}}mm, Y={{y}}mm.',
      statusAddTextActive: 'Click a spot on the canvas to place the text there - or enter X/Y and click “Create text”. Esc = stop.',
      addTextHint: 'Click a spot on the canvas to place the text set below there (X/Y = bottom-left corner) - or enter X/Y directly and click “Create text”. Text is inserted as vector line art and can\'t be selected/moved as a whole afterwards - just undo (Ctrl/Cmd+Z) and re-place it if needed.',
      textContentLabel: 'Text',
      strokeWidthLabel: 'Line width ({{unit}}) - blank = automatic',
      createTextBtn: 'Create text',
      alertEmptyText: 'Please enter some text.',
      alertInvalidHeight: 'Invalid height.',
      alertInvalidStrokeWidth: 'Invalid line width.',
      statusTextCreated: 'Text created at X={{x}}mm, Y={{y}}mm.',
      deleteTextBtn: 'Delete text',
      statusTextUpdated: 'Text updated.',
      confirmDeleteText: 'Delete this text?',
      statusTextDeleted: 'Text deleted.',
      inspectorEmptyNoSelection: 'No pad selected. First select the layer to edit on the left (active), then click a pad on the canvas.<br><br>Shift+Click = add/remove pad from selection.<br>Shift+Drag = select multiple pads with a box.',
      layerLabel: 'Layer',
      apertureLabel: 'Aperture',
      macroNotEditable: 'This aperture is a macro/polygon and its size cannot be edited here. Position can still be changed.',
      applyBtn: 'Apply',
      selectSameSizeBtn: 'Select all with same size',
      selectSameSizeXBtn: 'Select all with same size on same X axis',
      selectSameSizeYBtn: 'Select all with same size on same Y axis',
      deselectBtn: 'Deselect',
      deletePadBtn: 'Delete pad',
      alertInvalidSize: 'Invalid size',
      statusPadUpdated: 'Pad updated.',
      statusSameSizeSelected: '{{count}} pads with size {{size}}{{axis}} selected.',
      axisXSuffix: ' on the same X axis',
      axisYSuffix: ' on the same Y axis',
      selectionLabel: 'Selection',
      selectionCount: '{{count}} pads selected',
      moveOffsetHeading: 'Move (offset)',
      unifySizeHeading: 'Unify size',
      diameterCircleLabel: 'Diameter (mm) – for circular pads in the selection',
      unchangedPlaceholder: 'unchanged',
      widthRectLabel: 'Width (mm) – rectangle/oval',
      heightRectLabel: 'Height (mm) – rectangle/oval',
      macroInSelection: '{{count}} macro/polygon pad(s) in the selection – their size cannot be changed, position will still move.',
      noEditableApertures: 'No editable apertures in the selection.',
      deleteManyPadsBtn: 'Delete {{count}} pads',
      alertInvalidOffset: 'Invalid offset',
      statusPadsUpdated: '{{count}} pads updated.'
    }
  };

  function t(key, vars) {
    const dict = I18N[state.lang] || I18N.de;
    let s = dict[key] !== undefined ? dict[key] : (I18N.de[key] !== undefined ? I18N.de[key] : key);
    if (vars) {
      for (const k in vars) s = s.split('{{' + k + '}}').join(vars[k]);
    }
    return s;
  }

  function applyStaticI18n() {
    document.documentElement.lang = state.lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (el.tagName === 'TITLE') el.textContent = t(key);
      else {
        // preserve child elements (e.g. <input>) inside labels - only replace the text node(s)
        Array.from(el.childNodes).forEach(n => { if (n.nodeType === 3) n.remove(); });
        el.insertBefore(document.createTextNode(t(key)), el.firstChild);
      }
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      el.title = t(el.getAttribute('data-i18n-title'));
    });
    document.title = t('appTitle');
  }

  const savedLang = (typeof localStorage !== 'undefined' && localStorage.getItem('gerberEditLang')) || null;
  const state = {
    lang: (savedLang === 'en' || savedLang === 'de') ? savedLang : 'de',
    layers: [],       // {id, name, layer, originalText, color, visible, dirty}
    activeId: null,
    selected: null,   // {layerId, flashes: Set<flashCmd>} or null
    selectedText: null, // {layerId, textId} or null - mutually exclusive with `selected`
    view: { scale: 4, offsetX: 0, offsetY: 0 }, // scale = px per mm
    canvasReady: false,
    marquee: null,    // {x0,y0,x1,y1} in canvas-local px, while shift-dragging a selection box
    origin: { x: 0, y: 0 },  // mm, in absolute file coordinates - HUD/measurement are shown relative to this
    settingOrigin: false,    // true while waiting for the next canvas click to set the origin
    measureActive: false,    // true while the measure tool is toggled on
    measurePoints: [],       // 0-2 points ({x,y} mm, absolute file coords) of the current measurement
    mouseWorld: null,        // {x,y} mm, absolute file coords - last known mouse position over the canvas
    addingPad: false,        // true while the "+ Pad" tool is toggled on
    addPad: { shape: 'C', dia: 1.0, w: 1.0, h: 1.0, x: 0, y: 0 }, // draft values for the new-pad form
    addingText: false,       // true while the "+ Text" tool is toggled on
    addText: { text: 'TEXT', height: 2.0, strokeWidth: '', x: 0, y: 0 } // draft values for the new-text form
  };

  let nextLayerId = 1;

  // ---------- DOM ----------
  const canvas = document.getElementById('gcanvas');
  const ctx = canvas.getContext('2d');
  const wrap = document.getElementById('canvas-wrap');
  const layerListEl = document.getElementById('layerList');
  const inspectorBody = document.getElementById('inspectorBody');
  const statusEl = document.getElementById('status');
  const fileInput = document.getElementById('fileInput');
  const btnFit = document.getElementById('btnFit');
  const btnZoomIn = document.getElementById('btnZoomIn');
  const btnZoomOut = document.getElementById('btnZoomOut');
  const btnDownloadZip = document.getElementById('btnDownloadZip');
  const btnUndo = document.getElementById('btnUndo');
  const btnRedo = document.getElementById('btnRedo');
  const btnSetOrigin = document.getElementById('btnSetOrigin');
  const btnResetOrigin = document.getElementById('btnResetOrigin');
  const btnMeasure = document.getElementById('btnMeasure');
  const btnAddPad = document.getElementById('btnAddPad');
  const btnAddText = document.getElementById('btnAddText');
  const langSelect = document.getElementById('langSelect');
  const hud = document.getElementById('hud');

  function setStatus(msg) { statusEl.textContent = msg; }

  langSelect.value = state.lang;
  applyStaticI18n();
  langSelect.addEventListener('change', () => {
    state.lang = langSelect.value;
    if (typeof localStorage !== 'undefined') localStorage.setItem('gerberEditLang', state.lang);
    applyStaticI18n();
    renderLayerList();
    renderInspector();
    updateHud();
    setStatus(t('statusReady'));
  });

  // ---------- Undo / Redo (per layer) ----------
  const MAX_HISTORY = 50;

  function snapshotLayer(lo) {
    lo.history.push(JSON.stringify(lo.layer));
    if (lo.history.length > MAX_HISTORY) lo.history.shift();
    lo.future = [];
  }

  function undo() {
    const lo = getActiveLayer();
    if (!lo || lo.history.length === 0) return;
    lo.future.push(JSON.stringify(lo.layer));
    lo.layer = JSON.parse(lo.history.pop());
    lo.dirty = lo.history.length > 0;
    if (state.selected && state.selected.layerId === lo.id) clearSelection();
    renderLayerList();
    renderAll();
    updateUndoRedoButtons();
    setStatus(t('statusUndo', { name: lo.name }));
  }

  function redo() {
    const lo = getActiveLayer();
    if (!lo || lo.future.length === 0) return;
    lo.history.push(JSON.stringify(lo.layer));
    lo.layer = JSON.parse(lo.future.pop());
    lo.dirty = true;
    if (state.selected && state.selected.layerId === lo.id) clearSelection();
    renderLayerList();
    renderAll();
    updateUndoRedoButtons();
    setStatus(t('statusRedo', { name: lo.name }));
  }

  function updateUndoRedoButtons() {
    const lo = getActiveLayer();
    btnUndo.disabled = !lo || lo.history.length === 0;
    btnRedo.disabled = !lo || lo.future.length === 0;
  }

  btnUndo.addEventListener('click', undo);
  btnRedo.addEventListener('click', redo);

  window.addEventListener('keydown', (e) => {
    const tag = document.activeElement && document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return; // don't hijack native field undo
    const mod = e.ctrlKey || e.metaKey;
    if (!mod || e.key.toLowerCase() !== 'z') return;
    e.preventDefault();
    if (e.shiftKey) redo(); else undo();
  });

  // ---------- Layer loading ----------
  fileInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach(readFile);
    fileInput.value = '';
  });

  function readFile(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = reader.result;
        const layer = Gerber.parseGerber(text);
        const id = nextLayerId++;
        const color = COLORS[(id - 1) % COLORS.length];
        const layerObj = {
          id, name: file.name, layer, originalText: text,
          color, visible: true, dirty: false,
          offCanvas: document.createElement('canvas'),
          history: [], future: []
        };
        state.layers.push(layerObj);
        state.activeId = id;
        renderLayerList();
        fitView();
        renderAll();
        updateUndoRedoButtons();
        setStatus(t('statusLayerLoaded', { name: file.name, count: Gerber.getFlashes(layer).length }));
      } catch (err) {
        alert(t('alertReadError', { name: file.name, message: err.message }));
        console.error(err);
      }
    };
    reader.readAsText(file);
  }

  function getLayerObj(id) { return state.layers.find(l => l.id === id); }
  function getActiveLayer() { return getLayerObj(state.activeId); }

  // ---------- Layer list UI ----------
  function renderLayerList() {
    if (state.layers.length === 0) {
      layerListEl.innerHTML = '<div class="empty-state">' + t('layerListEmpty') + '</div>';
      btnDownloadZip.disabled = true;
      updateUndoRedoButtons();
      return;
    }
    btnDownloadZip.disabled = false;
    layerListEl.innerHTML = '';
    state.layers.forEach(lo => {
      const div = document.createElement('div');
      div.className = 'layer-item' + (lo.id === state.activeId ? ' active' : '');
      const padCount = Gerber.getFlashes(lo.layer).length;
      div.innerHTML = `
        <div class="row1">
          <input type="radio" name="activeLayer" ${lo.id === state.activeId ? 'checked' : ''} title="${t('setActiveLayerTitle')}">
          <span class="swatch" style="background:${lo.color}"></span>
          <span class="name" title="${escapeHtml(lo.name)}">${escapeHtml(lo.name)}</span>
        </div>
        <div class="meta">
          <label><input type="checkbox" class="visToggle" ${lo.visible ? 'checked' : ''}> ${t('visibleLabel')}</label>
          · ${lo.layer.units} · ${padCount} Pads
          ${lo.dirty ? '<span class="dirty-badge">' + t('dirtyBadge') + '</span>' : ''}
        </div>
        <div class="actions">
          <button class="btnDownload">${t('downloadBtnLabel')}</button>
          <button class="btnReset">${t('resetBtnLabel')}</button>
          <button class="btnRemove danger">${t('removeBtnLabel')}</button>
        </div>
      `;
      const radioEl = div.querySelector('.row1 input[type=radio]');
      radioEl.addEventListener('click', (e) => e.stopPropagation());
      radioEl.addEventListener('change', () => {
        state.activeId = lo.id;
        clearSelection();
        renderLayerList();
        renderAll();
      });
      const visToggleEl = div.querySelector('.visToggle');
      visToggleEl.addEventListener('click', (e) => e.stopPropagation());
      visToggleEl.addEventListener('change', (e) => {
        lo.visible = e.target.checked;
        renderAll();
      });
      div.querySelector('.btnDownload').addEventListener('click', (e) => { e.stopPropagation(); downloadLayer(lo); });
      div.querySelector('.btnReset').addEventListener('click', (e) => {
        e.stopPropagation();
        if (!confirm(t('confirmResetLayer', { name: lo.name }))) return;
        lo.layer = Gerber.parseGerber(lo.originalText);
        lo.dirty = false;
        lo.history = [];
        lo.future = [];
        if (state.selected && state.selected.layerId === lo.id) clearSelection();
        renderLayerList();
        renderAll();
      });
      div.querySelector('.btnRemove').addEventListener('click', (e) => {
        e.stopPropagation();
        state.layers = state.layers.filter(l => l.id !== lo.id);
        if (state.activeId === lo.id) state.activeId = state.layers.length ? state.layers[0].id : null;
        if (state.selected && state.selected.layerId === lo.id) clearSelection();
        renderLayerList();
        renderAll();
      });
      div.addEventListener('click', () => {
        state.activeId = lo.id;
        clearSelection();
        renderLayerList();
        renderAll();
      });
      layerListEl.appendChild(div);
    });
    updateUndoRedoButtons();
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  // ---------- Export ----------
  function downloadLayer(lo) {
    const text = Gerber.layerToText(lo.layer);
    const blob = new Blob([text], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = lo.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  btnDownloadZip.addEventListener('click', () => {
    const files = state.layers.map(lo => ({ name: lo.name, data: Gerber.layerToText(lo.layer) }));
    const blob = ZipUtil.makeZip(files);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'gerber_export.zip';
    document.body.appendChild(a);
    a.click();
    a.remove();
  });

  // ---------- View / transform ----------
  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const w = wrap.clientWidth, h = wrap.clientHeight;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    state.layers.forEach(lo => {
      lo.offCanvas.width = canvas.width;
      lo.offCanvas.height = canvas.height;
    });
    state.canvasReady = true;
  }
  window.addEventListener('resize', () => { resizeCanvas(); renderAll(); });

  function worldBounds() {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    state.layers.forEach(lo => {
      const layer = lo.layer;
      layer.commands.forEach(cmd => {
        if (cmd.type !== 'op') return;
        const x = Gerber.toMm(layer, cmd.x), y = Gerber.toMm(layer, cmd.y);
        let pad = 0.2;
        if (cmd.op === 'D03') {
          const ap = layer.apertures[cmd.dcode];
          const ext = Gerber.apertureExtents(ap);
          pad = Math.max(Gerber.toMm(layer, ext.hw), Gerber.toMm(layer, ext.hh));
        }
        if (x - pad < minX) minX = x - pad;
        if (x + pad > maxX) maxX = x + pad;
        if (y - pad < minY) minY = y - pad;
        if (y + pad > maxY) maxY = y + pad;
      });
    });
    if (!isFinite(minX)) return { minX: 0, minY: 0, maxX: 100, maxY: 100 };
    return { minX, minY, maxX, maxY };
  }

  function fitView() {
    if (!state.canvasReady) resizeCanvas();
    const b = worldBounds();
    const w = wrap.clientWidth, h = wrap.clientHeight;
    const bw = Math.max(b.maxX - b.minX, 1);
    const bh = Math.max(b.maxY - b.minY, 1);
    const scale = Math.min(w / bw, h / bh) * 0.88;
    state.view.scale = scale;
    const cx = (b.minX + b.maxX) / 2, cy = (b.minY + b.maxY) / 2;
    state.view.offsetX = w / 2 - cx * scale;
    state.view.offsetY = h / 2 + cy * scale;
  }

  function toScreen(xmm, ymm) {
    return { x: state.view.offsetX + xmm * state.view.scale, y: state.view.offsetY - ymm * state.view.scale };
  }
  function toWorld(px, py) {
    return { x: (px - state.view.offsetX) / state.view.scale, y: (state.view.offsetY - py) / state.view.scale };
  }

  btnFit.addEventListener('click', () => { fitView(); renderAll(); });
  btnZoomIn.addEventListener('click', () => { zoomAt(wrap.clientWidth / 2, wrap.clientHeight / 2, 1.3); });
  btnZoomOut.addEventListener('click', () => { zoomAt(wrap.clientWidth / 2, wrap.clientHeight / 2, 1 / 1.3); });

  // ---------- Nullpunkt (HUD origin) + measure tool ----------
  function updateHud() {
    if (!state.mouseWorld) { hud.innerHTML = ''; return; }
    const rx = state.mouseWorld.x - state.origin.x;
    const ry = state.mouseWorld.y - state.origin.y;
    let html = 'X: ' + rx.toFixed(3) + ' mm<br>Y: ' + ry.toFixed(3) + ' mm';
    if (state.measureActive && state.measurePoints.length === 1) {
      const p0 = state.measurePoints[0];
      const dx = state.mouseWorld.x - p0.x, dy = state.mouseWorld.y - p0.y;
      html += '<br>' + t('hudDeltaLine', { dist: Math.hypot(dx, dy).toFixed(3), dx: dx.toFixed(3), dy: dy.toFixed(3) });
    } else if (state.measurePoints.length === 2) {
      const [p0, p1] = state.measurePoints;
      const dx = p1.x - p0.x, dy = p1.y - p0.y;
      html += '<br>' + t('hudMeasureLine', { dist: Math.hypot(dx, dy).toFixed(3), dx: dx.toFixed(3), dy: dy.toFixed(3) });
    }
    hud.innerHTML = html;
  }

  // turn off the other two exclusive canvas-click tools before entering one of them
  function deactivateOtherTools(except) {
    if (except !== 'origin') { state.settingOrigin = false; btnSetOrigin.classList.remove('active'); }
    if (except !== 'measure') { state.measureActive = false; state.measurePoints = []; btnMeasure.classList.remove('active'); }
    if (except !== 'addPad') { state.addingPad = false; btnAddPad.classList.remove('active'); }
    if (except !== 'addText') { state.addingText = false; btnAddText.classList.remove('active'); }
  }

  btnSetOrigin.addEventListener('click', () => {
    state.settingOrigin = !state.settingOrigin;
    btnSetOrigin.classList.toggle('active', state.settingOrigin);
    if (state.settingOrigin) {
      deactivateOtherTools('origin');
      setStatus(t('statusClickSetOrigin'));
    } else {
      setStatus(t('statusReady'));
    }
    renderInspector();
    renderAll();
  });

  btnResetOrigin.addEventListener('click', () => {
    state.origin = { x: 0, y: 0 };
    updateHud();
    renderAll();
    setStatus(t('statusOriginReset'));
  });

  btnMeasure.addEventListener('click', () => {
    state.measureActive = !state.measureActive;
    state.measurePoints = [];
    btnMeasure.classList.toggle('active', state.measureActive);
    if (state.measureActive) {
      deactivateOtherTools('measure');
      setStatus(t('statusMeasureActive'));
    } else {
      setStatus(t('statusReady'));
    }
    renderInspector();
    renderAll();
    updateHud();
  });

  btnAddPad.addEventListener('click', () => {
    if (!state.addingPad && !getActiveLayer()) { alert(t('alertNoActiveLayerLong')); return; }
    state.addingPad = !state.addingPad;
    btnAddPad.classList.toggle('active', state.addingPad);
    if (state.addingPad) {
      deactivateOtherTools('addPad');
      clearSelection();
      setStatus(t('statusAddPadActive'));
    } else {
      setStatus(t('statusReady'));
    }
    renderInspector();
    renderAll();
  });

  btnAddText.addEventListener('click', () => {
    if (!state.addingText && !getActiveLayer()) { alert(t('alertNoActiveLayerLong')); return; }
    state.addingText = !state.addingText;
    btnAddText.classList.toggle('active', state.addingText);
    if (state.addingText) {
      deactivateOtherTools('addText');
      clearSelection();
      setStatus(t('statusAddTextActive'));
    } else {
      setStatus(t('statusReady'));
    }
    renderInspector();
    renderAll();
  });

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    state.mouseWorld = toWorld(e.clientX - rect.left, e.clientY - rect.top);
    updateHud();
    if (state.measureActive && state.measurePoints.length === 1) renderAll();
  });
  canvas.addEventListener('mouseleave', () => {
    state.mouseWorld = null;
    updateHud();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!state.settingOrigin && !state.measureActive && state.measurePoints.length === 0 && !state.addingPad && !state.addingText) return;
    deactivateOtherTools(null);
    setStatus(t('statusReady'));
    renderInspector();
    renderAll();
    updateHud();
  });

  function zoomAt(px, py, factor) {
    const before = toWorld(px, py);
    state.view.scale *= factor;
    state.view.scale = Math.max(0.05, Math.min(state.view.scale, 2000));
    const after = toScreen(before.x, before.y);
    state.view.offsetX += px - after.x;
    state.view.offsetY += py - after.y;
    renderAll();
  }

  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const px = e.clientX - rect.left, py = e.clientY - rect.top;
    // Scale the zoom step by how far the wheel/trackpad actually moved instead of a fixed
    // multiplier per event. A fixed factor compounds far too fast on trackpads, which fire
    // many small wheel events per gesture ("extreme" zoom jumps).
    let delta = e.deltaY;
    if (e.deltaMode === 1) delta *= 16;      // line mode -> approx pixels
    else if (e.deltaMode === 2) delta *= window.innerHeight; // page mode -> approx pixels
    delta = Math.max(-240, Math.min(240, delta));
    const factor = Math.exp(-delta * 0.0018);
    zoomAt(px, py, factor);
  }, { passive: false });

  let dragging = false, dragStart = null, dragMoved = false, dragOffsetStart = null, boxSelecting = false;
  canvas.addEventListener('mousedown', (e) => {
    dragging = true;
    dragMoved = false;
    dragStart = { x: e.clientX, y: e.clientY };
    dragOffsetStart = { x: state.view.offsetX, y: state.view.offsetY };
    boxSelecting = e.shiftKey;
    if (boxSelecting) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      state.marquee = { x0: x, y0: y, x1: x, y1: y };
    }
  });
  window.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - dragStart.x, dy = e.clientY - dragStart.y;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) dragMoved = true;
    if (boxSelecting) {
      const rect = canvas.getBoundingClientRect();
      state.marquee.x1 = e.clientX - rect.left;
      state.marquee.y1 = e.clientY - rect.top;
      renderAll();
      return;
    }
    if (dragMoved) {
      state.view.offsetX = dragOffsetStart.x + dx;
      state.view.offsetY = dragOffsetStart.y + dy;
      renderAll();
    }
  });
  window.addEventListener('mouseup', (e) => {
    if (!dragging) return;
    dragging = false;
    if (boxSelecting) {
      if (state.marquee && dragMoved) applyMarqueeSelection(state.marquee, e.ctrlKey || e.metaKey);
      boxSelecting = false;
      state.marquee = null;
      renderAll();
      return;
    }
    if (!dragMoved) {
      const rect = canvas.getBoundingClientRect();
      const px = e.clientX - rect.left, py = e.clientY - rect.top;
      if (state.settingOrigin) {
        const world = toWorld(px, py);
        state.origin = { x: world.x, y: world.y };
        state.settingOrigin = false;
        btnSetOrigin.classList.remove('active');
        setStatus(t('statusOriginSet', { x: world.x.toFixed(3), y: world.y.toFixed(3) }));
        updateHud();
        renderAll();
        return;
      }
      if (state.measureActive) {
        const world = toWorld(px, py);
        if (state.measurePoints.length >= 2) state.measurePoints = [];
        state.measurePoints.push(world);
        updateHud();
        renderAll();
        return;
      }
      if (state.addingPad) {
        const world = toWorld(px, py);
        readAddPadDraftFromForm();
        attemptCreatePad(world.x, world.y);
        return;
      }
      if (state.addingText) {
        const world = toWorld(px, py);
        readAddTextDraftFromForm();
        attemptCreateText(world.x, world.y);
        return;
      }
      handleClick(px, py, e.shiftKey);
    }
  });

  // ---------- Hit testing / selection ----------
  function hitTestFlash(lo, world) {
    const flashes = Gerber.getFlashes(lo.layer);
    let best = null, bestArea = Infinity;
    for (const f of flashes) {
      const fx = Gerber.toMm(lo.layer, f.x), fy = Gerber.toMm(lo.layer, f.y);
      const ap = lo.layer.apertures[f.dcode];
      const ext = Gerber.apertureExtents(ap);
      const hw = Gerber.toMm(lo.layer, ext.hw), hh = Gerber.toMm(lo.layer, ext.hh);
      const dx = world.x - fx, dy = world.y - fy;
      let hit = false;
      if (ext.shape === 'C') {
        hit = (dx * dx + dy * dy) <= hw * hw;
      } else if (ext.shape === 'R') {
        hit = Math.abs(dx) <= hw && Math.abs(dy) <= hh;
      } else if (ext.shape === 'O') {
        hit = capsuleHit(dx, dy, hw, hh);
      } else {
        hit = (dx * dx + dy * dy) <= Math.max(hw, 0.15) * Math.max(hw, 0.15);
      }
      if (hit) {
        const area = hw * hh;
        if (area < bestArea) { bestArea = area; best = f; }
      }
    }
    return best;
  }

  // Bounding-box hit test for editor-only text objects (see Gerber.addText). Small padding
  // relative to the text height makes descenders (comma, semicolon) and thin strokes easy to hit.
  function hitTestText(lo, world) {
    const texts = lo.layer.texts || {};
    for (const id in texts) {
      const tx = texts[id];
      const pad = tx.height * 0.25;
      if (world.x >= tx.x - pad && world.x <= tx.x + tx.width + pad &&
          world.y >= tx.y - pad && world.y <= tx.y + tx.height * 1.05 + pad) {
        return tx.id;
      }
    }
    return null;
  }

  function handleClick(px, py, shiftKey) {
    const lo = getActiveLayer();
    if (!lo) return;
    const world = toWorld(px, py);
    const best = hitTestFlash(lo, world);
    if (best) {
      state.selectedText = null;
      if (shiftKey) {
        ensureSelectionFor(lo.id);
        if (state.selected.flashes.has(best)) state.selected.flashes.delete(best);
        else state.selected.flashes.add(best);
        if (state.selected.flashes.size === 0) state.selected = null;
      } else {
        state.selected = { layerId: lo.id, flashes: new Set([best]) };
      }
    } else {
      const textId = hitTestText(lo, world);
      if (textId !== null) {
        state.selected = null;
        state.selectedText = { layerId: lo.id, textId };
      } else if (!shiftKey) {
        clearSelection();
      }
    }
    renderInspector();
    renderAll();
  }

  function applyMarqueeSelection(m, subtract) {
    const lo = getActiveLayer();
    if (!lo) return;
    const c1 = toWorld(m.x0, m.y0), c2 = toWorld(m.x1, m.y1);
    const minX = Math.min(c1.x, c2.x), maxX = Math.max(c1.x, c2.x);
    const minY = Math.min(c1.y, c2.y), maxY = Math.max(c1.y, c2.y);
    const flashes = Gerber.getFlashes(lo.layer);
    const hits = flashes.filter(f => {
      const x = Gerber.toMm(lo.layer, f.x), y = Gerber.toMm(lo.layer, f.y);
      return x >= minX && x <= maxX && y >= minY && y <= maxY;
    });
    if (hits.length === 0 && !subtract) return;
    state.selectedText = null;
    ensureSelectionFor(lo.id);
    hits.forEach(f => {
      if (subtract) state.selected.flashes.delete(f);
      else state.selected.flashes.add(f);
    });
    if (state.selected.flashes.size === 0) state.selected = null;
    renderInspector();
  }

  function ensureSelectionFor(layerId) {
    if (!state.selected || state.selected.layerId !== layerId) {
      state.selected = { layerId, flashes: new Set() };
    }
  }

  function capsuleHit(dx, dy, hw, hh) {
    if (hw >= hh) {
      const r = hh;
      const segHalf = hw - r;
      const cx = Math.max(-segHalf, Math.min(segHalf, dx));
      const ex = dx - cx;
      return (ex * ex + dy * dy) <= r * r;
    } else {
      const r = hw;
      const segHalf = hh - r;
      const cy = Math.max(-segHalf, Math.min(segHalf, dy));
      const ey = dy - cy;
      return (dx * dx + ey * ey) <= r * r;
    }
  }

  function clearSelection() {
    state.selected = null;
    state.selectedText = null;
    renderInspector();
  }

  // Delete the currently selected pad(s) from the active layer. Undo-able.
  function deleteSelectedFlashes() {
    if (!state.selected || state.selected.flashes.size === 0) return;
    const lo = getLayerObj(state.selected.layerId);
    if (!lo) return;
    const flashArr = Array.from(state.selected.flashes);
    const count = flashArr.length;
    if (!confirm(count === 1 ? t('confirmDeleteOne') : t('confirmDeleteMany', { count }))) return;

    snapshotLayer(lo);
    Gerber.removeFlashes(lo.layer, flashArr);
    lo.dirty = true;
    clearSelection();
    updateUndoRedoButtons();
    renderLayerList();
    renderAll();
    setStatus(count === 1 ? t('statusPadDeleted') : t('statusPadsDeleted', { count }));
  }

  // Delete the currently selected text object (all its stroke commands). Undo-able.
  function deleteSelectedText() {
    if (!state.selectedText) return;
    const lo = getLayerObj(state.selectedText.layerId);
    if (!lo) return;
    if (!confirm(t('confirmDeleteText'))) return;

    snapshotLayer(lo);
    Gerber.removeText(lo.layer, state.selectedText.textId);
    lo.dirty = true;
    clearSelection();
    updateUndoRedoButtons();
    renderLayerList();
    renderAll();
    setStatus(t('statusTextDeleted'));
  }

  window.addEventListener('keydown', (e) => {
    const tag = document.activeElement && document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    if (e.key !== 'Delete' && e.key !== 'Backspace') return;
    if (state.selectedText) { e.preventDefault(); deleteSelectedText(); return; }
    if (!state.selected || state.selected.flashes.size === 0) return;
    e.preventDefault();
    deleteSelectedFlashes();
  });

  // ---------- Add-pad tool ----------
  function renderAddPadForm() {
    const d = state.addPad;
    let sizeHtml;
    if (d.shape === 'C') {
      sizeHtml = `<div class="field"><label>${t('diameterLabel', { unit: 'mm' })}</label><input id="fAddDia" type="number" step="0.01" value="${d.dia}"></div>`;
    } else {
      sizeHtml = `
        <div class="field-row">
          <div class="field"><label>${t('widthLabel', { unit: 'mm' })}</label><input id="fAddW" type="number" step="0.01" value="${d.w}"></div>
          <div class="field"><label>${t('heightLabel', { unit: 'mm' })}</label><input id="fAddH" type="number" step="0.01" value="${d.h}"></div>
        </div>`;
    }
    inspectorBody.innerHTML = `
      <div class="empty-state" style="margin-bottom:10px;">${t('addPadHint')}</div>
      <div class="field"><label>${t('shapeLabel')}</label>
        <select id="fAddShape">
          <option value="C" ${d.shape === 'C' ? 'selected' : ''}>${t('shapeCircle')}</option>
          <option value="R" ${d.shape === 'R' ? 'selected' : ''}>${t('shapeRect')}</option>
        </select>
      </div>
      ${sizeHtml}
      <div class="field-row">
        <div class="field"><label>${t('xLabel', { unit: 'mm' })}</label><input id="fAddX" type="number" step="0.01" value="${d.x}"></div>
        <div class="field"><label>${t('yLabel', { unit: 'mm' })}</label><input id="fAddY" type="number" step="0.01" value="${d.y}"></div>
      </div>
      <button class="primary" id="btnCreatePad" style="width:100%;margin-top:6px;">${t('createPadBtn')}</button>
      <button id="btnCancelAddPad" style="width:100%;margin-top:6px;">${t('doneBtn')}</button>
    `;
    document.getElementById('fAddShape').addEventListener('change', (e) => {
      readAddPadDraftFromForm();
      state.addPad.shape = e.target.value;
      renderAddPadForm();
    });
    document.getElementById('btnCreatePad').addEventListener('click', () => {
      readAddPadDraftFromForm();
      attemptCreatePad(state.addPad.x, state.addPad.y);
    });
    document.getElementById('btnCancelAddPad').addEventListener('click', () => {
      state.addingPad = false;
      btnAddPad.classList.remove('active');
      setStatus(t('statusReady'));
      renderInspector();
    });
  }

  function readAddPadDraftFromForm() {
    const d = state.addPad;
    if (d.shape === 'C') {
      const el = document.getElementById('fAddDia');
      if (el) d.dia = parseFloat(el.value);
    } else {
      const elW = document.getElementById('fAddW'), elH = document.getElementById('fAddH');
      if (elW) d.w = parseFloat(elW.value);
      if (elH) d.h = parseFloat(elH.value);
    }
    const elX = document.getElementById('fAddX'), elY = document.getElementById('fAddY');
    if (elX) d.x = parseFloat(elX.value);
    if (elY) d.y = parseFloat(elY.value);
  }

  function attemptCreatePad(xMm, yMm) {
    const lo = getActiveLayer();
    if (!lo) { alert(t('alertNoActiveLayerShort')); return; }
    const d = state.addPad;
    let params;
    if (d.shape === 'C') {
      if (isNaN(d.dia) || d.dia <= 0) { alert(t('alertInvalidDiameter')); return; }
      params = [d.dia];
    } else {
      if (isNaN(d.w) || isNaN(d.h) || d.w <= 0 || d.h <= 0) { alert(t('alertInvalidWH')); return; }
      params = [d.w, d.h];
    }
    if (isNaN(xMm) || isNaN(yMm)) { alert(t('alertInvalidPosition')); return; }

    snapshotLayer(lo);
    const paramsFile = params.map(v => Gerber.toFileUnits(lo.layer, v));
    const flash = Gerber.addFlash(lo.layer, d.shape, paramsFile, xMm, yMm);
    lo.dirty = true;
    state.addingPad = false;
    btnAddPad.classList.remove('active');
    state.selected = { layerId: lo.id, flashes: new Set([flash]) };
    updateUndoRedoButtons();
    renderLayerList();
    renderInspector();
    renderAll();
    setStatus(t('statusPadCreated', { x: xMm.toFixed(3), y: yMm.toFixed(3) }));
  }

  // ---------- Add-text tool ----------
  function renderAddTextForm() {
    const d = state.addText;
    inspectorBody.innerHTML = `
      <div class="empty-state" style="margin-bottom:10px;">${t('addTextHint')}</div>
      <div class="field"><label>${t('textContentLabel')}</label><input id="fAddTextContent" type="text" value="${escapeHtml(d.text)}"></div>
      <div class="field-row">
        <div class="field"><label>${t('heightLabel', { unit: 'mm' })}</label><input id="fAddTextHeight" type="number" step="0.1" value="${d.height}"></div>
        <div class="field"><label>${t('strokeWidthLabel', { unit: 'mm' })}</label><input id="fAddTextStroke" type="number" step="0.01" value="${d.strokeWidth}" placeholder="auto"></div>
      </div>
      <div class="field-row">
        <div class="field"><label>${t('xLabel', { unit: 'mm' })}</label><input id="fAddTextX" type="number" step="0.01" value="${d.x}"></div>
        <div class="field"><label>${t('yLabel', { unit: 'mm' })}</label><input id="fAddTextY" type="number" step="0.01" value="${d.y}"></div>
      </div>
      <button class="primary" id="btnCreateText" style="width:100%;margin-top:6px;">${t('createTextBtn')}</button>
      <button id="btnCancelAddText" style="width:100%;margin-top:6px;">${t('doneBtn')}</button>
    `;
    document.getElementById('btnCreateText').addEventListener('click', () => {
      readAddTextDraftFromForm();
      attemptCreateText(state.addText.x, state.addText.y);
    });
    document.getElementById('btnCancelAddText').addEventListener('click', () => {
      state.addingText = false;
      btnAddText.classList.remove('active');
      setStatus(t('statusReady'));
      renderInspector();
    });
  }

  function readAddTextDraftFromForm() {
    const d = state.addText;
    const elText = document.getElementById('fAddTextContent');
    const elHeight = document.getElementById('fAddTextHeight');
    const elStroke = document.getElementById('fAddTextStroke');
    const elX = document.getElementById('fAddTextX'), elY = document.getElementById('fAddTextY');
    if (elText) d.text = elText.value;
    if (elHeight) d.height = parseFloat(elHeight.value);
    if (elStroke) d.strokeWidth = elStroke.value.trim();
    if (elX) d.x = parseFloat(elX.value);
    if (elY) d.y = parseFloat(elY.value);
  }

  function attemptCreateText(xMm, yMm) {
    const lo = getActiveLayer();
    if (!lo) { alert(t('alertNoActiveLayerShort')); return; }
    const d = state.addText;
    if (!d.text || !d.text.trim()) { alert(t('alertEmptyText')); return; }
    if (isNaN(d.height) || d.height <= 0) { alert(t('alertInvalidHeight')); return; }
    let strokeWidth = null;
    if (d.strokeWidth !== '') {
      strokeWidth = parseFloat(d.strokeWidth);
      if (isNaN(strokeWidth) || strokeWidth <= 0) { alert(t('alertInvalidStrokeWidth')); return; }
    }
    if (isNaN(xMm) || isNaN(yMm)) { alert(t('alertInvalidPosition')); return; }

    snapshotLayer(lo);
    Gerber.addText(lo.layer, d.text, xMm, yMm, d.height, strokeWidth);
    lo.dirty = true;
    state.addingText = false;
    btnAddText.classList.remove('active');
    clearSelection();
    updateUndoRedoButtons();
    renderLayerList();
    renderInspector();
    renderAll();
    setStatus(t('statusTextCreated', { x: xMm.toFixed(3), y: yMm.toFixed(3) }));
  }

  // Edit form for an existing text object (selected by clicking it on the canvas). Applying
  // regenerates its strokes from scratch (remove old, add new), which is why the resulting
  // command gets a new textId - state.selectedText is updated to follow it.
  function renderTextEditForm() {
    const lo = getLayerObj(state.selectedText.layerId);
    const tx = lo && lo.layer.texts[state.selectedText.textId];
    if (!tx) { state.selectedText = null; renderInspector(); return; }

    inspectorBody.innerHTML = `
      <div class="field"><label>${t('layerLabel')}</label><input value="${escapeHtml(lo.name)}" disabled></div>
      <div class="field"><label>${t('textContentLabel')}</label><input id="fEditTextContent" type="text" value="${escapeHtml(tx.text)}"></div>
      <div class="field-row">
        <div class="field"><label>${t('heightLabel', { unit: 'mm' })}</label><input id="fEditTextHeight" type="number" step="0.1" value="${tx.height}"></div>
        <div class="field"><label>${t('strokeWidthLabel', { unit: 'mm' })}</label><input id="fEditTextStroke" type="number" step="0.01" value="${(+tx.strokeWidth).toFixed(3)}"></div>
      </div>
      <div class="field-row">
        <div class="field"><label>${t('xLabel', { unit: 'mm' })}</label><input id="fEditTextX" type="number" step="0.01" value="${tx.x}"></div>
        <div class="field"><label>${t('yLabel', { unit: 'mm' })}</label><input id="fEditTextY" type="number" step="0.01" value="${tx.y}"></div>
      </div>
      <button class="primary" id="btnApplyText" style="width:100%;margin-top:6px;">${t('applyBtn')}</button>
      <button id="btnDeselectText" style="width:100%;margin-top:6px;">${t('deselectBtn')}</button>
      <button id="btnDeleteText" class="danger" style="width:100%;margin-top:6px;">${t('deleteTextBtn')}</button>
    `;

    document.getElementById('btnApplyText').addEventListener('click', () => {
      const newText = document.getElementById('fEditTextContent').value;
      const newHeight = parseFloat(document.getElementById('fEditTextHeight').value);
      const strokeStr = document.getElementById('fEditTextStroke').value.trim();
      const newX = parseFloat(document.getElementById('fEditTextX').value);
      const newY = parseFloat(document.getElementById('fEditTextY').value);
      if (!newText || !newText.trim()) { alert(t('alertEmptyText')); return; }
      if (isNaN(newHeight) || newHeight <= 0) { alert(t('alertInvalidHeight')); return; }
      let strokeWidth = null;
      if (strokeStr !== '') {
        strokeWidth = parseFloat(strokeStr);
        if (isNaN(strokeWidth) || strokeWidth <= 0) { alert(t('alertInvalidStrokeWidth')); return; }
      }
      if (isNaN(newX) || isNaN(newY)) { alert(t('alertInvalidPosition')); return; }

      snapshotLayer(lo);
      const result = Gerber.editText(lo.layer, tx.id, newText, newX, newY, newHeight, strokeWidth);
      lo.dirty = true;
      state.selectedText = { layerId: lo.id, textId: result.id };
      updateUndoRedoButtons();
      renderLayerList();
      renderInspector();
      renderAll();
      setStatus(t('statusTextUpdated'));
    });
    document.getElementById('btnDeselectText').addEventListener('click', () => { clearSelection(); renderAll(); });
    document.getElementById('btnDeleteText').addEventListener('click', deleteSelectedText);
  }

  // ---------- Inspector ----------
  function renderInspector() {
    if (state.addingText) { renderAddTextForm(); return; }
    if (state.addingPad) { renderAddPadForm(); return; }
    if (state.selectedText) { renderTextEditForm(); return; }
    if (!state.selected || state.selected.flashes.size === 0) {
      inspectorBody.innerHTML = '<div class="empty-state">' + t('inspectorEmptyNoSelection') + '</div>';
      return;
    }
    if (state.selected.flashes.size > 1) {
      renderMultiInspector();
      return;
    }
    const lo = getLayerObj(state.selected.layerId);
    const flash = Array.from(state.selected.flashes)[0];
    const layer = lo.layer;
    const ap = layer.apertures[flash.dcode];
    const unitLabel = 'mm';
    const xMm = Gerber.toMm(layer, flash.x).toFixed(4);
    const yMm = Gerber.toMm(layer, flash.y).toFixed(4);

    let sizeFieldsHtml = '';
    const editable = ap && (ap.shape === 'C' || ap.shape === 'R' || ap.shape === 'O');
    if (ap && ap.shape === 'C') {
      const d = Gerber.toMm(layer, ap.params[0] || 0).toFixed(4);
      sizeFieldsHtml = `
        <div class="field"><label>${t('diameterLabel', { unit: unitLabel })}</label><input id="fSize1" type="number" step="0.01" value="${d}"></div>
      `;
    } else if (ap && (ap.shape === 'R' || ap.shape === 'O')) {
      const w = Gerber.toMm(layer, ap.params[0] || 0).toFixed(4);
      const h = Gerber.toMm(layer, ap.params[1] || 0).toFixed(4);
      sizeFieldsHtml = `
        <div class="field-row">
          <div class="field"><label>${t('widthLabel', { unit: unitLabel })}</label><input id="fSize1" type="number" step="0.01" value="${w}"></div>
          <div class="field"><label>${t('heightLabel', { unit: unitLabel })}</label><input id="fSize2" type="number" step="0.01" value="${h}"></div>
        </div>
      `;
    } else {
      sizeFieldsHtml = '<div class="empty-state">' + t('macroNotEditable') + '</div>';
    }

    inspectorBody.innerHTML = `
      <div class="field"><label>${t('layerLabel')}</label><input value="${escapeHtml(lo.name)}" disabled></div>
      <div class="field"><label>${t('apertureLabel')}</label><input value="D${flash.dcode} (${ap ? ap.shape : '?'})" disabled></div>
      <div class="field-row">
        <div class="field"><label>${t('xLabel', { unit: unitLabel })}</label><input id="fX" type="number" step="0.01" value="${xMm}"></div>
        <div class="field"><label>${t('yLabel', { unit: unitLabel })}</label><input id="fY" type="number" step="0.01" value="${yMm}"></div>
      </div>
      ${sizeFieldsHtml}
      <button class="primary" id="btnApply" style="width:100%;margin-top:6px;">${t('applyBtn')}</button>
      ${editable ? `
        <button id="btnSelectSameSize" style="width:100%;margin-top:6px;">${t('selectSameSizeBtn')}</button>
        <button id="btnSelectSameSizeX" style="width:100%;margin-top:6px;">${t('selectSameSizeXBtn')}</button>
        <button id="btnSelectSameSizeY" style="width:100%;margin-top:6px;">${t('selectSameSizeYBtn')}</button>
      ` : ''}
      <button id="btnDeselect" style="width:100%;margin-top:6px;">${t('deselectBtn')}</button>
      <button id="btnDeleteFlash" class="danger" style="width:100%;margin-top:6px;">${t('deletePadBtn')}</button>
    `;

    document.getElementById('btnApply').addEventListener('click', () => {
      const newX = parseFloat(document.getElementById('fX').value);
      const newY = parseFloat(document.getElementById('fY').value);
      if (isNaN(newX) || isNaN(newY)) { alert(t('alertInvalidPosition')); return; }

      // validate everything up front so we never snapshot/mutate and then bail out halfway
      let s1 = null, s2 = null;
      if (editable) {
        s1 = parseFloat(document.getElementById('fSize1').value);
        if (ap.shape === 'C') {
          if (isNaN(s1) || s1 <= 0) { alert(t('alertInvalidDiameter')); return; }
        } else {
          s2 = parseFloat(document.getElementById('fSize2').value);
          if (isNaN(s1) || isNaN(s2) || s1 <= 0 || s2 <= 0) { alert(t('alertInvalidSize')); return; }
        }
      }

      snapshotLayer(lo);
      Gerber.setFlashPosition(layer, flash, newX, newY);
      if (editable) {
        if (ap.shape === 'C') {
          const newDiaFile = Gerber.toFileUnits(layer, s1);
          const extra = ap.params.slice(1);
          Gerber.setFlashSize(layer, flash, [newDiaFile, ...extra]);
        } else {
          const newWFile = Gerber.toFileUnits(layer, s1);
          const newHFile = Gerber.toFileUnits(layer, s2);
          const extra = ap.params.slice(2);
          Gerber.setFlashSize(layer, flash, [newWFile, newHFile, ...extra]);
        }
      }
      lo.dirty = true;
      updateUndoRedoButtons();
      renderLayerList();
      renderInspector();
      renderAll();
      setStatus(t('statusPadUpdated'));
    });
    document.getElementById('btnDeselect').addEventListener('click', () => { clearSelection(); renderAll(); });
    document.getElementById('btnDeleteFlash').addEventListener('click', deleteSelectedFlashes);
    const btnSameSize = document.getElementById('btnSelectSameSize');
    if (btnSameSize) btnSameSize.addEventListener('click', () => selectAllSameSize(lo, flash));
    const btnSameSizeX = document.getElementById('btnSelectSameSizeX');
    if (btnSameSizeX) btnSameSizeX.addEventListener('click', () => selectAllSameSize(lo, flash, 'x'));
    const btnSameSizeY = document.getElementById('btnSelectSameSizeY');
    if (btnSameSizeY) btnSameSizeY.addEventListener('click', () => selectAllSameSize(lo, flash, 'y'));
  }

  // Select every pad in the given layer whose aperture has the same shape and the same
  // dimensions as refFlash's aperture - regardless of whether they happen to share the exact
  // same D-code (some files define several near-duplicate apertures with identical sizes).
  // When axis is 'x' or 'y', the match is further narrowed to pads that also share refFlash's
  // coordinate on that axis (i.e. lie in the same column resp. row).
  function selectAllSameSize(lo, refFlash, axis) {
    const layer = lo.layer;
    const refAp = layer.apertures[refFlash.dcode];
    if (!refAp || (refAp.shape !== 'C' && refAp.shape !== 'R' && refAp.shape !== 'O')) return;
    const refExt = Gerber.apertureExtents(refAp);
    const EPS = 1e-4;
    const matches = Gerber.getFlashes(layer).filter(f => {
      const ap = layer.apertures[f.dcode];
      if (!ap || ap.shape !== refAp.shape) return false;
      const ext = Gerber.apertureExtents(ap);
      if (Math.abs(ext.hw - refExt.hw) >= EPS || Math.abs(ext.hh - refExt.hh) >= EPS) return false;
      if (axis === 'x' && Math.abs(f.x - refFlash.x) >= EPS) return false;
      if (axis === 'y' && Math.abs(f.y - refFlash.y) >= EPS) return false;
      return true;
    });
    state.selected = { layerId: lo.id, flashes: new Set(matches) };
    renderInspector();
    renderAll();
    const sizeLabel = refAp.shape === 'C'
      ? Gerber.toMm(layer, refExt.hw * 2).toFixed(3) + 'mm Ø'
      : Gerber.toMm(layer, refExt.hw * 2).toFixed(3) + '×' + Gerber.toMm(layer, refExt.hh * 2).toFixed(3) + 'mm';
    const axisLabel = axis === 'x' ? t('axisXSuffix') : axis === 'y' ? t('axisYSuffix') : '';
    setStatus(t('statusSameSizeSelected', { count: matches.length, size: sizeLabel, axis: axisLabel }));
  }

  function renderMultiInspector() {
    const lo = getLayerObj(state.selected.layerId);
    const layer = lo.layer;
    const flashArr = Array.from(state.selected.flashes);

    const shapes = new Set();
    let macroCount = 0;
    flashArr.forEach(f => {
      const ap = layer.apertures[f.dcode];
      if (!ap) return;
      if (ap.shape === 'C' || ap.shape === 'R' || ap.shape === 'O') shapes.add(ap.shape);
      else macroCount++;
    });
    const hasCircle = shapes.has('C');
    const hasRectOrOval = shapes.has('R') || shapes.has('O');

    let sizeHtml = '';
    if (hasCircle) {
      sizeHtml += `<div class="field"><label>${t('diameterCircleLabel')}</label><input id="mDia" type="number" step="0.01" placeholder="${t('unchangedPlaceholder')}"></div>`;
    }
    if (hasRectOrOval) {
      sizeHtml += `
        <div class="field-row">
          <div class="field"><label>${t('widthRectLabel')}</label><input id="mW" type="number" step="0.01" placeholder="${t('unchangedPlaceholder')}"></div>
          <div class="field"><label>${t('heightRectLabel')}</label><input id="mH" type="number" step="0.01" placeholder="${t('unchangedPlaceholder')}"></div>
        </div>`;
    }
    if (macroCount > 0) {
      sizeHtml += `<div class="empty-state">${t('macroInSelection', { count: macroCount })}</div>`;
    }

    inspectorBody.innerHTML = `
      <div class="field"><label>${t('layerLabel')}</label><input value="${escapeHtml(lo.name)}" disabled></div>
      <div class="field"><label>${t('selectionLabel')}</label><input value="${t('selectionCount', { count: flashArr.length })}" disabled></div>
      <h3 style="margin-top:14px;">${t('moveOffsetHeading')}</h3>
      <div class="field-row">
        <div class="field"><label>Δx (mm)</label><input id="mDx" type="number" step="0.01" value="0"></div>
        <div class="field"><label>Δy (mm)</label><input id="mDy" type="number" step="0.01" value="0"></div>
      </div>
      <h3 style="margin-top:14px;">${t('unifySizeHeading')}</h3>
      ${sizeHtml || '<div class="empty-state">' + t('noEditableApertures') + '</div>'}
      <button class="primary" id="btnApplyMulti" style="width:100%;margin-top:10px;">${t('applyBtn')}</button>
      <button id="btnDeselectMulti" style="width:100%;margin-top:6px;">${t('deselectBtn')}</button>
      <button id="btnDeleteMulti" class="danger" style="width:100%;margin-top:6px;">${t('deleteManyPadsBtn', { count: flashArr.length })}</button>
    `;

    document.getElementById('btnApplyMulti').addEventListener('click', () => {
      const dxStr = document.getElementById('mDx').value.trim();
      const dyStr = document.getElementById('mDy').value.trim();
      const dx = dxStr === '' ? 0 : parseFloat(dxStr);
      const dy = dyStr === '' ? 0 : parseFloat(dyStr);
      if (isNaN(dx) || isNaN(dy)) { alert(t('alertInvalidOffset')); return; }

      const diaEl = document.getElementById('mDia');
      const wEl = document.getElementById('mW');
      const hEl = document.getElementById('mH');

      // validate everything up front so we never snapshot/mutate and then bail out halfway
      let dia = null, w = null, h = null;
      if (diaEl && diaEl.value.trim() !== '') {
        dia = parseFloat(diaEl.value);
        if (isNaN(dia) || dia <= 0) { alert(t('alertInvalidDiameter')); return; }
      }
      if (wEl && hEl && wEl.value.trim() !== '' && hEl.value.trim() !== '') {
        w = parseFloat(wEl.value); h = parseFloat(hEl.value);
        if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) { alert(t('alertInvalidWH')); return; }
      }

      snapshotLayer(lo);

      if (dx !== 0 || dy !== 0) {
        // snapshot original positions first so moving one selected pad can't affect the
        // computed target of another (avoids double-offset edge cases)
        const originals = flashArr.map(f => ({ f, x: Gerber.toMm(layer, f.x), y: Gerber.toMm(layer, f.y) }));
        originals.forEach(o => Gerber.setFlashPosition(layer, o.f, o.x + dx, o.y + dy));
      }
      if (dia !== null) {
        const circleFlashes = flashArr.filter(f => { const ap = layer.apertures[f.dcode]; return ap && ap.shape === 'C'; });
        if (circleFlashes.length) Gerber.setFlashesSize(layer, circleFlashes, [Gerber.toFileUnits(layer, dia)]);
      }
      if (w !== null && h !== null) {
        const rectFlashes = flashArr.filter(f => { const ap = layer.apertures[f.dcode]; return ap && (ap.shape === 'R' || ap.shape === 'O'); });
        if (rectFlashes.length) Gerber.setFlashesSize(layer, rectFlashes, [Gerber.toFileUnits(layer, w), Gerber.toFileUnits(layer, h)]);
      }

      lo.dirty = true;
      updateUndoRedoButtons();
      renderLayerList();
      renderInspector();
      renderAll();
      setStatus(t('statusPadsUpdated', { count: flashArr.length }));
    });
    document.getElementById('btnDeselectMulti').addEventListener('click', () => { clearSelection(); renderAll(); });
    document.getElementById('btnDeleteMulti').addEventListener('click', deleteSelectedFlashes);
  }

  // ---------- Rendering ----------
  function renderAll() {
    if (!state.canvasReady) resizeCanvas();
    const w = wrap.clientWidth, h = wrap.clientHeight;
    ctx.clearRect(0, 0, w, h);

    state.layers.forEach(lo => {
      if (!lo.visible) return;
      // Newly loaded layers get a freshly created <canvas> (default 300x150 px) that is only
      // resized on window resize. Without this check it stays tiny and gets stretched way up
      // by drawImage below, which is exactly what caused the blurry/pixelated rendering.
      if (lo.offCanvas.width !== canvas.width || lo.offCanvas.height !== canvas.height) {
        lo.offCanvas.width = canvas.width;
        lo.offCanvas.height = canvas.height;
      }
      const octx = lo.offCanvas.getContext('2d');
      const dpr = window.devicePixelRatio || 1;
      octx.setTransform(dpr, 0, 0, dpr, 0, 0);
      octx.clearRect(0, 0, w, h);
      renderLayer(octx, lo);
      const isActive = lo.id === state.activeId;
      ctx.globalAlpha = isActive ? 0.95 : 0.55;
      ctx.drawImage(lo.offCanvas, 0, 0, lo.offCanvas.width, lo.offCanvas.height, 0, 0, w, h);
      ctx.globalAlpha = 1;
    });

    // draw selection highlight(s) on top
    if (state.selected && state.selected.flashes.size > 0) {
      const lo = getLayerObj(state.selected.layerId);
      if (lo && lo.visible !== false) {
        const layer = lo.layer;
        ctx.save();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 3]);
        state.selected.flashes.forEach(flash => {
          const fx = Gerber.toMm(layer, flash.x), fy = Gerber.toMm(layer, flash.y);
          const p = toScreen(fx, fy);
          const ap = layer.apertures[flash.dcode];
          const ext = Gerber.apertureExtents(ap);
          const hw = Gerber.toMm(layer, ext.hw) * state.view.scale;
          const hh = Gerber.toMm(layer, ext.hh) * state.view.scale;
          ctx.strokeRect(p.x - hw - 4, p.y - hh - 4, hw * 2 + 8, hh * 2 + 8);
        });
        ctx.restore();
      }
    }

    // draw the selected text object's bounding box, if any
    if (state.selectedText) {
      const lo = getLayerObj(state.selectedText.layerId);
      const tx = lo && lo.layer.texts[state.selectedText.textId];
      if (lo && lo.visible !== false && tx) {
        const p0 = toScreen(tx.x, tx.y);
        const p1 = toScreen(tx.x + tx.width, tx.y + tx.height);
        const rx = Math.min(p0.x, p1.x) - 4, ry = Math.min(p0.y, p1.y) - 4;
        const rw = Math.abs(p1.x - p0.x) + 8, rh = Math.abs(p1.y - p0.y) + 8;
        ctx.save();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 3]);
        ctx.strokeRect(rx, ry, rw, rh);
        ctx.restore();
      }
    }

    // draw the live marquee (shift-drag selection box)
    if (state.marquee) {
      const m = state.marquee;
      const x = Math.min(m.x0, m.x1), y = Math.min(m.y0, m.y1);
      const mw = Math.abs(m.x1 - m.x0), mh = Math.abs(m.y1 - m.y0);
      ctx.save();
      ctx.fillStyle = 'rgba(77,163,255,0.15)';
      ctx.strokeStyle = 'rgba(77,163,255,0.9)';
      ctx.lineWidth = 1;
      ctx.fillRect(x, y, mw, mh);
      ctx.strokeRect(x, y, mw, mh);
      ctx.restore();
    }

    // draw the Nullpunkt (HUD/measurement reference origin) marker
    {
      const p = toScreen(state.origin.x, state.origin.y);
      ctx.save();
      ctx.strokeStyle = '#ffe14d';
      ctx.fillStyle = '#ffe14d';
      ctx.lineWidth = 1.5;
      const r = 7;
      ctx.beginPath();
      ctx.moveTo(p.x - r, p.y); ctx.lineTo(p.x + r, p.y);
      ctx.moveTo(p.x, p.y - r); ctx.lineTo(p.x, p.y + r);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = '10px monospace';
      ctx.fillText('0,0', p.x + r + 3, p.y - r);
      ctx.restore();
    }

    // draw the measurement line (finished measurement, or a live rubber-band while measuring)
    {
      const p0World = state.measurePoints[0];
      const p1World = state.measurePoints.length === 2
        ? state.measurePoints[1]
        : (state.measureActive ? state.mouseWorld : null);
      if (p0World && p1World) {
        const p0 = toScreen(p0World.x, p0World.y);
        const p1 = toScreen(p1World.x, p1World.y);
        const finished = state.measurePoints.length === 2;
        ctx.save();
        ctx.strokeStyle = '#4dd68a';
        ctx.fillStyle = '#4dd68a';
        ctx.lineWidth = 1.5;
        ctx.setLineDash(finished ? [] : [5, 4]);
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.stroke();
        ctx.setLineDash([]);
        [p0, p1].forEach(p => { ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2); ctx.fill(); });

        const dist = Math.hypot(p1World.x - p0World.x, p1World.y - p0World.y);
        const label = dist.toFixed(3) + ' mm';
        const midx = (p0.x + p1.x) / 2, midy = (p0.y + p1.y) / 2;
        ctx.font = '11px monospace';
        const tw = ctx.measureText(label).width;
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(midx - tw / 2 - 4, midy - 18, tw + 8, 16);
        ctx.fillStyle = '#4dd68a';
        ctx.fillText(label, midx - tw / 2, midy - 6);
        ctx.restore();
      }
    }
  }

  function applyPolarity(c, polarity) {
    c.globalCompositeOperation = polarity === 'C' ? 'destination-out' : 'source-over';
  }
  function resetComposite(c) { c.globalCompositeOperation = 'source-over'; }

  function renderLayer(c, lo) {
    const layer = lo.layer;
    c.fillStyle = lo.color;
    c.strokeStyle = lo.color;
    let regionPath = null;

    layer.commands.forEach(cmd => {
      if (cmd.type === 'gcode') {
        if (cmd.code === 36) { regionPath = new Path2D(); }
        if (cmd.code === 37) {
          if (regionPath) {
            applyPolarity(c, layer.__lastPolarity || 'D');
            c.fill(regionPath, 'nonzero');
            resetComposite(c);
          }
          regionPath = null;
        }
        return;
      }
      if (cmd.type === 'lp') { layer.__lastPolarity = cmd.polarity; return; }
      if (cmd.type !== 'op') return;
      layer.__lastPolarity = cmd.polarity;

      const x = Gerber.toMm(layer, cmd.x), y = Gerber.toMm(layer, cmd.y);
      const px = toScreen(x, y);

      if (cmd.region) {
        if (!regionPath) regionPath = new Path2D();
        if (cmd.op === 'D02') {
          regionPath.moveTo(px.x, px.y);
        } else if (cmd.op === 'D01') {
          if (cmd.gmode === 2 || cmd.gmode === 3) {
            addArcToPath(regionPath, layer, cmd, px);
          } else {
            regionPath.lineTo(px.x, px.y);
          }
        }
        return;
      }

      if (cmd.op === 'D02') return;

      if (cmd.op === 'D01') {
        const ap = layer.apertures[cmd.dcode];
        const ext = Gerber.apertureExtents(ap);
        const widthMm = Gerber.toMm(layer, ext.diameter !== undefined ? ext.diameter : Math.max(ext.w || 0, ext.h || 0));
        c.lineWidth = Math.max(widthMm * state.view.scale, 1);
        c.lineCap = 'round';
        c.lineJoin = 'round';
        applyPolarity(c, cmd.polarity);
        c.beginPath();
        const p0 = toScreen(Gerber.toMm(layer, cmd.prevX), Gerber.toMm(layer, cmd.prevY));
        c.moveTo(p0.x, p0.y);
        if (cmd.gmode === 2 || cmd.gmode === 3) {
          const path = new Path2D();
          path.moveTo(p0.x, p0.y);
          addArcToPath(path, layer, cmd, px);
          c.stroke(path);
        } else {
          c.lineTo(px.x, px.y);
          c.stroke();
        }
        resetComposite(c);
        return;
      }

      if (cmd.op === 'D03') {
        const ap = layer.apertures[cmd.dcode];
        drawFlash(c, layer, cmd, ap, x, y);
        return;
      }
    });
  }

  function addArcToPath(path, layer, cmd, endPx) {
    // approximate arc with line segments using I/J offset from start point
    const cxMm = Gerber.toMm(layer, cmd.prevX) + Gerber.toMm(layer, cmd.i);
    const cyMm = Gerber.toMm(layer, cmd.prevY) + Gerber.toMm(layer, cmd.j);
    const startX = Gerber.toMm(layer, cmd.prevX), startY = Gerber.toMm(layer, cmd.prevY);
    const endX = Gerber.toMm(layer, cmd.x), endY = Gerber.toMm(layer, cmd.y);
    const r = Math.hypot(startX - cxMm, startY - cyMm);
    let a0 = Math.atan2(startY - cyMm, startX - cxMm);
    let a1 = Math.atan2(endY - cyMm, endX - cxMm);
    const ccw = cmd.gmode === 3; // G03 = CCW
    if (ccw) { while (a1 < a0) a1 += Math.PI * 2; }
    else { while (a1 > a0) a1 -= Math.PI * 2; }
    if (Math.abs(a1 - a0) < 1e-6 && (startX !== endX || startY !== endY)) {
      a1 += ccw ? Math.PI * 2 : -Math.PI * 2; // full circle case
    }
    const steps = Math.max(4, Math.min(64, Math.ceil(Math.abs(a1 - a0) / (Math.PI / 24))));
    for (let i = 1; i <= steps; i++) {
      const a = a0 + (a1 - a0) * (i / steps);
      const wx = cxMm + r * Math.cos(a);
      const wy = cyMm + r * Math.sin(a);
      const p = toScreen(wx, wy);
      path.lineTo(p.x, p.y);
    }
  }

  function drawFlash(c, layer, cmd, ap, xMm, yMm) {
    const ext = Gerber.apertureExtents(ap);
    const p = toScreen(xMm, yMm);
    applyPolarity(c, cmd.polarity);
    c.beginPath();
    if (ext.shape === 'C') {
      const r = Gerber.toMm(layer, ext.hw) * state.view.scale;
      c.arc(p.x, p.y, Math.max(r, 0.5), 0, Math.PI * 2);
    } else if (ext.shape === 'R') {
      const hw = Gerber.toMm(layer, ext.hw) * state.view.scale;
      const hh = Gerber.toMm(layer, ext.hh) * state.view.scale;
      c.rect(p.x - hw, p.y - hh, hw * 2, hh * 2);
    } else if (ext.shape === 'O') {
      const hw = Gerber.toMm(layer, ext.hw) * state.view.scale;
      const hh = Gerber.toMm(layer, ext.hh) * state.view.scale;
      roundedCapsulePath(c, p.x, p.y, hw, hh);
    } else {
      const r = Math.max(Gerber.toMm(layer, ext.hw) * state.view.scale, 2);
      c.arc(p.x, p.y, r, 0, Math.PI * 2);
    }
    c.fill();
    resetComposite(c);
  }

  function roundedCapsulePath(c, cx, cy, hw, hh) {
    if (hw >= hh) {
      const r = hh;
      const segHalf = hw - r;
      c.moveTo(cx - segHalf, cy - r);
      c.lineTo(cx + segHalf, cy - r);
      c.arc(cx + segHalf, cy, r, -Math.PI / 2, Math.PI / 2);
      c.lineTo(cx - segHalf, cy + r);
      c.arc(cx - segHalf, cy, r, Math.PI / 2, -Math.PI / 2);
    } else {
      const r = hw;
      const segHalf = hh - r;
      c.moveTo(cx - r, cy - segHalf);
      c.lineTo(cx - r, cy + segHalf);
      c.arc(cx, cy + segHalf, r, Math.PI, 0, true);
      c.lineTo(cx + r, cy - segHalf);
      c.arc(cx, cy - segHalf, r, 0, Math.PI, true);
    }
    c.closePath();
  }

  // ---------- init ----------
  setStatus(t('statusReady'));
  renderLayerList();
  renderInspector();
  resizeCanvas();
  renderAll();

  // debug/test hook (harmless in normal use)
  if (typeof window !== 'undefined') {
    window.__gerberApp = {
      state, renderAll, renderLayerList, renderInspector, fitView,
      toScreen, toWorld, handleClick, applyMarqueeSelection, clearSelection,
      getActiveLayer, getLayerObj, resizeCanvas, undo, redo, snapshotLayer,
      deleteSelectedFlashes, selectAllSameSize, updateHud,
      attemptCreatePad, readAddPadDraftFromForm,
      attemptCreateText, readAddTextDraftFromForm,
      hitTestText, deleteSelectedText
    };
  }
})();
