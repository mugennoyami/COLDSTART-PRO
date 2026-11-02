import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {validateImport,extraCatalog,cleanPersonal,validateBackup,hasPersonalData,germanDate,csvCell,formatOE,isSafeId,isRecord} from '../src/core.mjs';
import {compareWheelDocument,measure,documentRegisterCSV} from '../src/documents-core.mjs';
import {PARTS,SOURCES,GROUPS} from '../src/data.mjs';
import {strip,assertBundled,bundle,cspFor} from '../build.mjs';
import {classify,collectUrls} from '../scripts/check-links.mjs';
const src=[{id:'s1',title:'Quelle',url:'https://example.com/x'}];
const part=(o={})=>({id:'t1',model:'E36',group:'front',name:'Testteil',...o});
const pack=(parts,sources=src)=>({schemaVersion:1,parts,sources});
const PART_KEYS=new Set(PARTS.map(p=>`${p.model}:${p.id}`)),GROUP_KEYS=new Set(['E36','E46'].flatMap(m=>GROUPS.map(g=>`${m}:${g.id}`)));
const ctx={partKeys:PART_KEYS,groupKeys:GROUP_KEYS};

// ---- Import: falsche Datentypen dürfen nie bis zur Anzeige gelangen
for(const [name,build] of [
 ['Teilenummer als JSON-Zahl',()=>pack([part({number:34116864060,sourceId:'s1'})])],
 ['Teilenummer als Liste',()=>pack([part({number:['34116864060'],sourceId:'s1'})])],
 ['numerische Teile-ID',()=>pack([part({id:5})])],
 ['Teile-ID __proto__',()=>pack([part({id:'__proto__'})])],
 ['Teile-ID constructor',()=>pack([part({id:'constructor'})])],
 ['Bezeichnung als Objekt',()=>pack([part({name:{a:1}})])],
 ['Notiz als Objekt',()=>pack([part({note:{a:1}})])],
 ['Suchbegriffe als Zahl',()=>pack([part({aliases:7})])],
 ['Quellenverweis als Zahl',()=>pack([part({sourceId:1})])],
 ['leerer Eintrag (null) bei Teilen',()=>pack([null])],
 ['leerer Eintrag (null) bei Quellen',()=>pack([],[null])],
 ['Quellen-ID __proto__',()=>pack([],[{...src[0],id:'__proto__'}])],
 ['Quellentitel als Zahl',()=>pack([],[{...src[0],title:5}])],
 ['Quellen-URL als Liste',()=>pack([],[{...src[0],url:['https://example.com']}])],
 ['Paket als Liste',()=>[]]
])test(`Import weist ${name} mit verständlichem Fehler zurück`,()=>{assert.throws(()=>validateImport(build()),e=>e instanceof Error&&!(e instanceof TypeError));});
test('Import behält gültige Teilenummer als Text und formatiert sie',()=>{const v=validateImport(pack([part({number:'34116864060',sourceId:'s1',note:'ok'})]));assert.equal(v.parts[0].number,'34116864060');assert.equal(formatOE(v.parts[0].number),'34 11 6 864 060');});
test('Reservierte Schlüssel und Datensatzformen werden erkannt',()=>{assert.equal(isSafeId('front-disc'),true);for(const v of ['__proto__','constructor','prototype','',null,5,'a b'])assert.equal(isSafeId(v),false);assert.equal(isRecord([]),false);assert.equal(isRecord(null),false);assert.equal(isRecord({}),true);});

// ---- Zusatzkatalog: Startbestand wird nie eingefroren
test('Ein Datenpaket mit dem kompletten Startbestand ergibt keinen Zusatzkatalog',()=>{const full=validateImport(JSON.parse(JSON.stringify({schemaVersion:1,parts:PARTS,sources:SOURCES})));const extra=extraCatalog(full,PARTS,SOURCES);assert.equal(extra.parts.length,0);assert.equal(extra.sources.length,0);});
test('Geänderte und neue Teile bleiben erhalten, ihre Quellen ebenfalls',()=>{const base=PARTS.find(p=>p.number);const changed={...base,note:'eigene Ergänzung'};const added=part({id:'neu-1',number:'34116864060',sourceId:base.sourceId});const full=validateImport(JSON.parse(JSON.stringify({schemaVersion:1,parts:[changed,added],sources:SOURCES})));const extra=extraCatalog(full,PARTS,SOURCES);assert.equal(extra.parts.length,2);assert.deepEqual(extra.sources.map(s=>s.id),[base.sourceId]);assert.doesNotThrow(()=>validateImport(extra));});

// ---- Persönliche Daten: streng bei Sicherungen, nachsichtig beim Browserspeicher
const goodPersonal=()=>({profiles:{E36:{date:'06/1998',engine:'M52',mods:''}},list:[{model:'E36',id:'front-disc',qty:120.7,checked:true,note:'n'}],videos:{'E36:front-disc':[{title:'T',url:'https://youtu.be/udow01fDa_o',note:'',rights:true}]},guides:{'E36:front-disc':{title:'G',url:'https://example.com/g',steps:['a','b','c','d'],reviewer:'R',date:'2026-10-30',rights:true,reviewed:true}},diagrams:{}});
test('Gültige Sicherung wird bereinigt übernommen',()=>{const b=validateBackup({type:'coldstart-backup',personal:goodPersonal()},ctx);assert.equal(b.list[0].qty,99);assert.equal(b.list[0].key,'E36:front-disc');assert.equal(b.videos['E36:front-disc'][0].url,'https://youtu.be/udow01fDa_o');assert.equal(b.guides['E36:front-disc'].steps.length,4);});
for(const [name,change] of [
 ['unbekanntes Bauteil in der Liste',p=>p.list[0].id='gibt-es-nicht'],['Listeneintrag null',p=>p.list=[null]],['Liste kein Array',p=>p.list='x'],
 ['Video-URL ohne HTTPS',p=>p.videos['E36:front-disc'][0].url='http://example.com/a.mp4'],['Videoliste null',p=>p.videos['E36:front-disc']=[null]],['Video für __proto__',p=>p.videos=JSON.parse('{"__proto__":[]}')],
 ['Anleitung mit javascript:-URL',p=>p.guides['E36:front-disc'].url='javascript:alert(1)'],['Anleitung null',p=>p.guides['E36:front-disc']=null],
 ['Zeichnung ohne Bild',p=>p.diagrams={'E36:front':{width:10,height:10,pins:{}}}],['Zeichnung für unbekannte Baugruppe',p=>p.diagrams={'E36:airbag':{image:'data:image/png;base64,AAAA',width:10,height:10}}],
 ['Hotspot auf unbekanntes Teil',p=>p.diagrams={'E36:front':{image:'data:image/png;base64,AAAA',width:10,height:10,pins:{nix:{x:1,y:1}}}}],['Hotspot null',p=>p.diagrams={'E36:front':{image:'data:image/png;base64,AAAA',width:10,height:10,pins:{'front-disc':null}}}]
])test(`Sicherung mit ${name} wird kontrolliert abgewiesen`,()=>{const p=goodPersonal();change(p);assert.throws(()=>validateBackup({type:'coldstart-backup',personal:p},ctx),e=>e instanceof Error&&!(e instanceof TypeError));});
test('Sicherung ohne persönliche Daten oder mit falschem Typ wird abgewiesen',()=>{for(const raw of [null,{},{type:'coldstart-backup'},{type:'coldstart-backup',personal:[]},{type:'anderes',personal:{}}])assert.throws(()=>validateBackup(raw,ctx),e=>e instanceof Error&&!(e instanceof TypeError));});
test('Browserspeicher: Ungültiges wird verworfen, Gültiges bleibt',()=>{const p=goodPersonal();p.list.push(null,{model:'E90',id:'x'},{model:'E46',id:'unbekannt-aber-ok',qty:'x'});p.videos['E36:front-disc'].unshift({title:'bad',url:'http://x.de/a.mp4'});p.videos.__proto__2=[];p.guides['E36:x']='kaputt';p.profiles.E36.date={evil:1};p.checks={a:1};const c=cleanPersonal(p,{...ctx,deferredImages:true});assert.equal(c.list.length,2);assert.equal(c.list[1].qty,1);assert.equal(c.videos['E36:front-disc'].length,1);assert.equal(Object.keys(c.guides).length,1);assert.equal(c.profiles.E36.date,'');assert.equal('checks' in c,false);});
test('Browserspeicher akzeptiert ausgelagerte Bilder nur mit Marker',()=>{const d=idb=>({'E36:front':{image:null,...(idb?{idb:true}:{}),width:10,height:10,pins:{'front-disc':{x:150,y:-5},'__proto__':{x:1,y:1}}}});assert.deepEqual(Object.keys(cleanPersonal({diagrams:d(true)},{...ctx,deferredImages:true}).diagrams),['E36:front']);assert.equal(Object.keys(cleanPersonal({diagrams:d(false)},{...ctx,deferredImages:true}).diagrams).length,0);const ok=cleanPersonal({diagrams:d(true)},{...ctx,deferredImages:true}).diagrams['E36:front'];assert.deepEqual(ok.pins,{'front-disc':{x:100,y:0}});assert.throws(()=>cleanPersonal({list:[],diagrams:d(true)},{...ctx,strict:true,deferredImages:false}));});
test('Leere und gefüllte persönliche Daten werden unterschieden',()=>{assert.equal(hasPersonalData({list:[],videos:{},guides:{},diagrams:{},profiles:{E36:{date:'',engine:'',mods:''}}}),false);assert.equal(hasPersonalData({list:[{}],videos:{},guides:{},diagrams:{},profiles:{}}),true);assert.equal(hasPersonalData({list:[],videos:{},guides:{},diagrams:{},profiles:{E46:{date:'',engine:'M54',mods:''}}}),true);});

// ---- Kleinteile
test('Datum wird deutsch angezeigt, andere Texte bleiben unverändert',()=>{assert.equal(germanDate('2026-10-29'),'29.10.2026');assert.equal(germanDate('29.10.2026'),'29.10.2026');assert.equal(germanDate(undefined),'');});
test('CSV schützt auch Zellen, die mit Tabulator oder Wagenrücklauf beginnen',()=>{for(const v of ['\t=1+1','\r=1+1','\tHallo'])assert.match(csvCell(v),/^"'/);assert.equal(csvCell('Hallo'),'"Hallo"');});
test('Das Dokumentenregister nutzt dieselbe CSV-Maskierung',()=>{const csv=documentRegisterCSV();assert.ok(csv.startsWith('﻿'));assert.equal(csv.split('\r\n').length,19);});
test('Radabgleich toleriert Einheiten und Dezimalkomma',()=>{for(const [v,n] of [['40 mm',40],['8,0 J',8],['17"',17],['72,6',72.6],['17 Zoll',17]])assert.equal(measure(v),n,v);for(const v of ['','abc','40 kg','4 0'])assert.equal(measure(v),null,v);const r=compareWheelDocument('drive-14',{type:'21 807',width:'8 J',diameter:'17"',et:'40 mm',pcd:'5x120',bore:'72,6 mm',revision:'V04'});assert.equal(r.status,'identity-match');});

// ---- Build: mehrzeilige Imports, Schutz vor übrig gebliebenen Modulanweisungen, CSP
test('Build entfernt ein- und mehrzeilige sowie reine Seiteneffekt-Imports',()=>{const code="import {a,b} from './x.mjs';\nimport {\n  c,\n  d\n} from \"./y.mjs\"\nimport './z.mjs';\nimport def from './w.mjs';\nexport const e=1;\nexport async function f(){}\nconst imported='import x';\n";const out=strip(code);assert.doesNotThrow(()=>assertBundled(out));assert.match(out,/^const e=1;/m);assert.match(out,/^async function f\(\)\{\}/m);assert.match(out,/const imported='import x';/);assert.equal(/from/.test(out),false);});
test('Build bricht bei übrig gebliebenen Modulanweisungen ab',()=>{for(const bad of ["export {a};","export default 1;","import * as x from './x.mjs'; const a=1;","export * from './x.mjs';"])assert.throws(()=>assertBundled(strip(bad)),/Modulanweisung/);});
test('Bündel trägt eine CSP mit dem exakten Hash des Skripts',()=>{const html='<head><meta http-equiv="Content-Security-Policy" content="%CSP%"><style>/* INLINE_STYLE */</style></head><script>/* INLINE_SCRIPT */</script>';const out=bundle(html,'a{}',['export const x=1;\nconsole.log(x);']);const script=out.match(/<script>([\s\S]*)<\/script>/)[1];const hash='sha256-'+createHash('sha256').update(script).digest('base64');assert.ok(out.includes(`script-src '${hash}'`));assert.equal(/INLINE_|%CSP%/.test(out),false);});
test('CSP erlaubt keine inline Skripte und Netzwerkverbindungen nur zu KI-Diensten und Modellquellen',()=>{const csp=cspFor('sha256-abc'),dir=n=>csp.split('; ').find(d=>d.startsWith(n+' '));assert.match(csp,/default-src 'none'/);assert.equal(dir('connect-src'),"connect-src 'self' https://api.openai.com https://cdn.jsdelivr.net https://huggingface.co https://*.huggingface.co https://*.hf.co https://raw.githubusercontent.com");assert.equal(dir('script-src'),"script-src 'sha256-abc' blob: 'wasm-unsafe-eval'");assert.equal(/script-src[^;]*(?:'unsafe-inline'|'unsafe-eval'|https:)/.test(csp),false);assert.match(csp,/frame-src https:\/\/www\.youtube-nocookie\.com blob:/);assert.match(csp,/object-src blob:/);});
test('Ausgelieferte HTML-Datei: CSP-Hash passt zum Skript und keine Modulanweisung bleibt übrig',async()=>{const html=await readFile(new URL('../dist/index.html',import.meta.url),'utf8');const script=html.match(/<script>([\s\S]*)<\/script>/)[1];const hash='sha256-'+createHash('sha256').update(script).digest('base64');const meta=html.match(/<meta http-equiv="Content-Security-Policy" content="([^"]+)">/);assert.ok(meta,'CSP-Meta fehlt');assert.ok(meta[1].includes(`script-src '${hash}'`),'CSP-Hash passt nicht zum Skript');assert.doesNotThrow(()=>assertBundled(script));assert.equal((html.match(/<script/g)||[]).length,1,'genau ein Skript');assert.equal(/\son[a-z]+="/i.test(html.replace(script,'')),false,'keine Inline-Ereignisattribute');});

// ---- Link-Prüfung
test('Link-Prüfung ordnet Statuscodes nachvollziehbar ein',()=>{assert.equal(classify(200),'ok');assert.equal(classify(302),'ok');for(const c of [401,403,429])assert.equal(classify(c),'blocked');for(const c of [404,410])assert.equal(classify(c),'dead');for(const c of [418,500,502,503])assert.equal(classify(c),'check');});
test('Alle zu prüfenden Links sind eindeutig und sicher',()=>{const urls=collectUrls();assert.ok(urls.length>=40);assert.equal(new Set(urls).size,urls.length);for(const u of urls)assert.ok(u.startsWith('https://'),u);});
