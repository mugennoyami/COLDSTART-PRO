// COLDSTART Garage Atlas 0.6: Laufzeitdateien von der eigenen Cloudseite sichern.
// Ausführen: Cloudseite in Chrome am PC öffnen (angemeldet), F12 → Konsole, dieses Skript einfügen, Enter.
// Liest nur Dateien derselben Seite (catalog/…, assets/…), sendet nichts weg und speichert ZIP-Teile unter 23 MB im Download-Ordner.
(async () => {
  'use strict';
  const PART_LIMIT = 23 * 1024 * 1024, CONCURRENCY = 6, base = location.origin + '/';
  const box = document.createElement('div');
  box.style.cssText = 'position:fixed;z-index:2147483647;left:16px;bottom:16px;max-width:460px;padding:14px 16px;background:#0e151b;color:#e9fbfb;border:2px solid #36d7d9;border-radius:10px;font:13px/1.5 system-ui,sans-serif;box-shadow:0 10px 40px #000a;white-space:pre-wrap';
  document.body.append(box);
  const show = t => { box.textContent = 'COLDSTART-Export\n' + t; console.log('[COLDSTART-Export]', t); };

  // 1. Daten aus dem Programmcode der Seite lesen (keine Annahmen über Dateinamen).
  const code = [...document.scripts].map(s => s.textContent).find(t => t.includes('const BMW_CATALOG = '));
  if (!code) { show('Abbruch: Diese Seite ist nicht Garage Atlas 0.6 (BMW_CATALOG fehlt).'); return; }
  const literal = name => { const start = code.indexOf(`const ${name} = `) + `const ${name} = `.length, end = code.indexOf('\n', start); return JSON.parse(code.slice(start, end).trim().replace(/;$/, '')); };
  const CAT = literal('BMW_CATALOG'), VEH = literal('VEHICLE_VARIANTS');
  const BASE = { E36: 'BG11', E46: 'AV31' };
  const imgPath = u => { const id = String(u ?? '').match(/\/components\/(\d+)\.\w+/)?.[1]; return id ? `assets/catalog/${id}.webp` : null; };

  const files = new Map(), failed = [], wanted = new Set();
  const add = p => { if (p && !files.has(p)) wanted.add(p); };
  async function get(path) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const r = await fetch(base + path, { cache: 'no-store', credentials: 'same-origin' });
        if (r.ok) { const b = new Uint8Array(await r.arrayBuffer()); files.set(path, b); return b; }
        if (r.status === 404) { failed.push(`${path} (404)`); return null; }
        if (attempt === 3) { failed.push(`${path} (${r.status})`); return null; }
      } catch (e) { if (attempt === 3) { failed.push(`${path} (${e.message})`); return null; } }
      await new Promise(res => setTimeout(res, 1500 * attempt));
    }
    return null;
  }
  async function run(label) {
    const list = [...wanted].filter(p => !files.has(p)); wanted.clear(); let done = 0;
    const worker = async () => { while (list.length) { const p = list.shift(); await get(p); done++; if (done % 25 === 0) show(`${label}: ${done} geladen …`); } };
    await Promise.all(Array.from({ length: CONCURRENCY }, worker));
    show(`${label}: fertig (${done}).`);
  }
  const scanJSON = () => { for (const [p, b] of files) if (p.endsWith('.json')) { const t = new TextDecoder().decode(b); for (const m of t.matchAll(/https:\/\/cdn\.leebmann24\.com\/components\/\d+\.\w+/g)) add(imgPath(m[0])); for (const m of t.matchAll(/assets\/[\w./-]+\.(?:webp|svg|png|jpe?g)/g)) add(m[0]); } };

  // 2. Liste der Dateien aufbauen und laden.
  ['catalog/coverage.json', 'catalog/search-E36.json', 'catalog/search-E46.json', 'assets/catalog/unavailable.svg', 'assets/vehicles/e36.webp', 'assets/vehicles/e46.webp'].forEach(add);
  for (const [m, p] of Object.entries(CAT.profiles)) for (const c of p.categories) for (const g of c.groups ?? []) { add(`catalog/${m}/${g.id}.json`); add(imgPath(g.image)); }
  for (const [m, p] of Object.entries(VEH.profiles)) for (const v of p.variants) if (v.catalogLocal && v.id !== BASE[m]) { add(`catalog/profiles/${m}/${v.id}.json`); add(`catalog/variants/search-${m}-${v.id}.json`); }
  await run('Kataloglisten');
  for (const [m, p] of Object.entries(VEH.profiles)) for (const v of p.variants) {
    const b = files.get(`catalog/profiles/${m}/${v.id}.json`); if (!b) continue;
    const prof = JSON.parse(new TextDecoder().decode(b));
    for (const c of prof.categories ?? []) for (const g of c.groups ?? []) { add(`catalog/variants/${m}/${v.id}/${g.id}.json`); add(imgPath(g.image)); }
  }
  await run('Variantenkataloge');
  scanJSON(); await run('Zeichnungsbilder');

  // 3. ZIP-Teile ohne Kompression erzeugen (Bilder sind bereits komprimiert).
  const table = new Uint32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
  const crc32 = b => { let c = 0xFFFFFFFF; for (let i = 0; i < b.length; i++) c = table[(c ^ b[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; };
  const enc = new TextEncoder();
  function zip(entries) {
    const local = [], central = []; let offset = 0;
    for (const [name, data] of entries) {
      const n = enc.encode(name), crc = crc32(data), h = new DataView(new ArrayBuffer(30)), c = new DataView(new ArrayBuffer(46));
      h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true); h.setUint16(12, 0x21, true); h.setUint32(14, crc, true); h.setUint32(18, data.length, true); h.setUint32(22, data.length, true); h.setUint16(26, n.length, true);
      c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint16(8, 0x0800, true); c.setUint16(14, 0x21, true); c.setUint32(16, crc, true); c.setUint32(20, data.length, true); c.setUint32(24, data.length, true); c.setUint16(28, n.length, true); c.setUint32(42, offset, true);
      local.push(h.buffer, n, data); central.push(c.buffer, n); offset += 30 + n.length + data.length;
    }
    const size = central.reduce((a, x) => a + x.byteLength, 0), e = new DataView(new ArrayBuffer(22));
    e.setUint32(0, 0x06054b50, true); e.setUint16(8, entries.length, true); e.setUint16(10, entries.length, true); e.setUint32(12, size, true); e.setUint32(16, offset, true);
    return new Blob([...local, ...central, e.buffer], { type: 'application/zip' });
  }
  const total = [...files.values()].reduce((a, b) => a + b.length, 0);
  const report = `Garage Atlas 0.6 · Export ${new Date().toISOString()}\nSeite: ${base}\nDateien: ${files.size}\nGröße: ${(total / 1048576).toFixed(1)} MB\nFehlend: ${failed.length}\n${failed.join('\n')}\n`;
  const entries = [...files].sort(([a], [b]) => a.localeCompare(b)); entries.push(['export-bericht.txt', enc.encode(report)]);
  const parts = []; let cur = [], size = 0;
  for (const e of entries) { if (cur.length && size + e[1].length > PART_LIMIT) { parts.push(cur); cur = []; size = 0; } cur.push(e); size += e[1].length + 100; }
  if (cur.length) parts.push(cur);
  for (let i = 0; i < parts.length; i++) {
    const a = document.createElement('a'); a.href = URL.createObjectURL(zip(parts[i])); a.download = `coldstart-0.6-dateien-teil-${String(i + 1).padStart(2, '0')}-von-${String(parts.length).padStart(2, '0')}.zip`;
    document.body.append(a); a.click(); a.remove(); await new Promise(res => setTimeout(res, 1500));
  }
  show(`Fertig: ${files.size} Dateien, ${(total / 1048576).toFixed(1)} MB, ${parts.length} ZIP-Teile im Download-Ordner.\nNicht gefunden: ${failed.length}${failed.length ? ' (Liste in export-bericht.txt)' : ''}.\nFalls Chrome fragt: „Mehrere Dateien herunterladen“ zulassen.`);
})();
