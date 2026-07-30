/* zip.js - minimaler ZIP-Writer (STORE, unkomprimiert), keine Abhängigkeiten, funktioniert offline */
(function (global) {
  'use strict';

  const CRC_TABLE = (() => {
    const table = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) {
        c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      }
      table[n] = c >>> 0;
    }
    return table;
  })();

  function crc32(bytes) {
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < bytes.length; i++) {
      crc = CRC_TABLE[(crc ^ bytes[i]) & 0xFF] ^ (crc >>> 8);
    }
    return (crc ^ 0xFFFFFFFF) >>> 0;
  }

  function strToBytes(str) {
    return new TextEncoder().encode(str);
  }

  function u16(v) { return [v & 0xFF, (v >>> 8) & 0xFF]; }
  function u32(v) { return [v & 0xFF, (v >>> 8) & 0xFF, (v >>> 16) & 0xFF, (v >>> 24) & 0xFF]; }

  // files: [{name: string, data: string}]
  function makeZip(files) {
    const chunks = [];
    const central = [];
    let offset = 0;
    const dosTime = 0, dosDate = 0x21; // fixed arbitrary valid DOS date/time

    for (const f of files) {
      const nameBytes = strToBytes(f.name);
      const dataBytes = strToBytes(f.data);
      const crc = crc32(dataBytes);
      const size = dataBytes.length;

      const localHeader = new Uint8Array([
        0x50, 0x4B, 0x03, 0x04, // local file header signature
        20, 0,                  // version needed
        0, 0,                   // flags
        0, 0,                   // compression = store
        ...u16(dosTime), ...u16(dosDate),
        ...u32(crc),
        ...u32(size), ...u32(size),
        ...u16(nameBytes.length), ...u16(0)
      ]);

      chunks.push(localHeader, nameBytes, dataBytes);

      const centralHeader = new Uint8Array([
        0x50, 0x4B, 0x01, 0x02,
        20, 0,
        20, 0,
        0, 0,
        0, 0,
        ...u16(dosTime), ...u16(dosDate),
        ...u32(crc),
        ...u32(size), ...u32(size),
        ...u16(nameBytes.length), ...u16(0), ...u16(0),
        ...u16(0), ...u16(0),
        ...u32(0),
        ...u32(offset)
      ]);
      central.push(centralHeader, nameBytes);

      offset += localHeader.length + nameBytes.length + dataBytes.length;
    }

    const centralStart = offset;
    let centralSize = 0;
    for (const c of central) centralSize += c.length;

    const end = new Uint8Array([
      0x50, 0x4B, 0x05, 0x06,
      0, 0, 0, 0,
      ...u16(files.length), ...u16(files.length),
      ...u32(centralSize),
      ...u32(centralStart),
      ...u16(0)
    ]);

    const all = [...chunks, ...central, end];
    return new Blob(all, { type: 'application/zip' });
  }

  global.ZipUtil = { makeZip, crc32 };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = global.ZipUtil;
  }
})(typeof window !== 'undefined' ? window : globalThis);
