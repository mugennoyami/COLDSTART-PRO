export const escapeHTML=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const norm=v=>String(v??'').toLocaleLowerCase('de').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'');
export const formatOE=n=>/^\d{11}$/.test(n??'')?`${n.slice(0,2)} ${n.slice(2,4)} ${n.slice(4,5)} ${n.slice(5,8)} ${n.slice(8)}`:null;
export function safeURL(value){try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password?u.href:null;}catch{return null;}}
export function searchParts(parts,model,query){const q=norm(query);return parts.filter(p=>p.model===model&&(!q||norm([p.name,p.number,p.group,p.aliases??'',...(p.references??[]).map(r=>r.number)].join(' ')).includes(q)));}
export const partKey=(model,id)=>`${model}:${id}`;
export function diagramPage(parts,selected,size=6){const index=Math.max(0,parts.findIndex(p=>p.id===selected));const page=Math.floor(index/size);return{page,pages:Math.ceil(parts.length/size),offset:page*size,parts:parts.slice(page*size,(page+1)*size)};}
export function addToList(list,part){const k=partKey(part.model,part.id);const old=list.find(x=>x.key===k);return old?list.map(x=>x.key===k?{...x,qty:Math.min(99,x.qty+1)}:x):[...list,{key:k,model:part.model,id:part.id,qty:1,checked:false,note:''}];}
export function videoSpec(value){const url=safeURL(value);if(!url)return null;const u=new URL(url);let id;if(u.hostname==='youtu.be')id=u.pathname.slice(1);if(['www.youtube.com','youtube.com','m.youtube.com'].includes(u.hostname))id=u.searchParams.get('v')??u.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1];if(id&&/^[a-zA-Z0-9_-]{11}$/.test(id))return {type:'youtube',url,embed:`https://www.youtube-nocookie.com/embed/${id}?autoplay=0`};if(/\.(mp4|webm)$/i.test(u.pathname))return {type:'file',url};return null;}
export const isRecord=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
const RESERVED_IDS=new Set(['__proto__','constructor','prototype']);
export const isSafeId=v=>typeof v==='string'&&/^[\w-]{1,80}$/.test(v)&&!RESERVED_IDS.has(v);
const optText=(v,max,label)=>{if(v==null)return '';if(typeof v!=='string')throw new Error(`${label} muss als Text angegeben werden.`);return v.slice(0,max);};
const looseText=(v,max)=>typeof v==='string'||typeof v==='number'?String(v).slice(0,max):'';
export function clamp(n,a,b){return Math.max(a,Math.min(b,Number(n)||0));}
export function isImage(s){return typeof s==='string'&&/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(s)&&s.length<3000000;}
export function validateImport(input){
 if(!isRecord(input)||input.schemaVersion!==1||!Array.isArray(input.parts)||!Array.isArray(input.sources))throw new Error('Erwartet wird ein Atlas-Datenpaket mit schemaVersion 1, parts und sources.');
 if(input.parts.length>5000||input.sources.length>2000)throw new Error('Das Datenpaket überschreitet die Grenze von 5.000 Teilen oder 2.000 Quellen.');
 const ids=new Set(),sids=new Set();
 const sources=input.sources.map(s=>{if(!isRecord(s)||!isSafeId(s.id)||sids.has(s.id)||typeof s.title!=='string'||!s.title.trim()||typeof s.url!=='string'||!safeURL(s.url))throw new Error('Eine Quelle ist unvollständig, doppelt oder enthält keine sichere HTTPS-Adresse.');sids.add(s.id);return{id:s.id,title:s.title.slice(0,200),url:safeURL(s.url),accessed:optText(s.accessed,60,'Das Abrufdatum einer Quelle'),note:optText(s.note,1000,'Die Notiz einer Quelle')};});
 const parts=input.parts.map(p=>{
  if(!isRecord(p)||!['E36','E46'].includes(p.model)||!['front','rear','oil','cool'].includes(p.group)||!isSafeId(p.id)||typeof p.name!=='string'||!p.name.trim())throw new Error('Ungültige Baureihe, Baugruppe, Teile-ID oder Bezeichnung.');
  const key=partKey(p.model,p.id);if(ids.has(key))throw new Error('Doppelte Teile-ID im Datenpaket.');ids.add(key);
  const hasNumber=p.number!=null&&p.number!=='',hasSource=p.sourceId!=null&&p.sourceId!=='';
  if(hasNumber&&(typeof p.number!=='string'||!/^\d{11}$/.test(p.number)))throw new Error('BMW-Referenznummern müssen als Text mit genau 11 Ziffern angegeben werden.');
  if(hasNumber&&!hasSource)throw new Error('Jede Teilenummer benötigt eine im Paket enthaltene Quelle.');
  if(hasSource&&(typeof p.sourceId!=='string'||!sids.has(p.sourceId)))throw new Error(hasNumber?'Jede Teilenummer benötigt eine im Paket enthaltene Quelle.':'Quellenverweis nicht gefunden.');
  return{id:p.id,model:p.model,group:p.group,name:p.name.slice(0,160),number:hasNumber?p.number:null,sourceId:hasSource?p.sourceId:null,note:optText(p.note,1800,'Die Notiz eines Teils'),aliases:optText(p.aliases,300,'Die Suchbegriffe eines Teils'),kind:['disc','caliper','pad','sensor','shield','bolt','cap','filter','ring','housing','gasket','switch','pump','flange','thermostat','pulley'].includes(p.kind)?p.kind:'housing',references:[]};
 });
 return{schemaVersion:1,parts,sources};
}
// Nur Teile und Quellen, die vom Startbestand abweichen; Quellen gültiger Teile bleiben erhalten.
export function extraCatalog(catalog,basePartsRaw,baseSourcesRaw){
 const base=validateImport({schemaVersion:1,parts:basePartsRaw,sources:baseSourcesRaw}),sig=o=>JSON.stringify(o);
 const bp=new Map(base.parts.map(p=>[partKey(p.model,p.id),sig(p)])),bs=new Map(base.sources.map(s=>[s.id,sig(s)]));
 const parts=catalog.parts.filter(p=>bp.get(partKey(p.model,p.id))!==sig(p)),need=new Set(parts.map(p=>p.sourceId).filter(Boolean));
 return{schemaVersion:1,parts,sources:catalog.sources.filter(s=>need.has(s.id)||bs.get(s.id)!==sig(s))};
}
const KEY_RE=/^E(?:36|46):[\w-]{1,80}$/;
// Persönliche Daten prüfen. strict=true (Sicherung): erster Fehler bricht ab. strict=false (Browserspeicher): Ungültiges wird verworfen.
export function cleanPersonal(v,{partKeys=null,groupKeys,strict=false,deferredImages=false}={}){
 const out={profiles:{},list:[],videos:{},guides:{},diagrams:{}},bad=msg=>{if(strict)throw new Error(msg);};
 if(!isRecord(v)){bad('Sicherung enthält keine persönlichen Datenfelder.');return out;}
 for(const model of ['E36','E46']){const pr=isRecord(v.profiles)?v.profiles[model]:undefined;if(isRecord(pr))out.profiles[model]={date:looseText(pr.date,30),engine:looseText(pr.engine,80),mods:looseText(pr.mods,1000)};}
 if(v.list===undefined?strict:(!Array.isArray(v.list)||v.list.length>5000))bad('Projektliste in der Sicherung ist ungültig.');
 else for(const x of Array.isArray(v.list)?v.list:[]){
  if(!isRecord(x)||!['E36','E46'].includes(x.model)||typeof x.id!=='string'||!x.id){bad('Projektliste in der Sicherung ist ungültig.');continue;}
  const key=partKey(x.model,x.id);if(strict&&!partKeys.has(key))throw new Error('Projektliste verweist auf ein unbekanntes Bauteil.');
  out.list.push({key,model:x.model,id:x.id,qty:clamp(Math.floor(Number(x.qty)||1),1,99),checked:x.checked===true,note:looseText(x.note,1000)});
 }
 if(v.videos!==undefined&&!isRecord(v.videos))bad('Videozuordnung ungültig.');
 else for(const [k,arr] of Object.entries(v.videos??{})){
  if(!KEY_RE.test(k)||(strict&&!partKeys.has(k))||!Array.isArray(arr)||arr.length>30){bad('Videozuordnung ungültig.');continue;}
  out.videos[k]=[];for(const a of arr){const spec=isRecord(a)&&typeof a.url==='string'?videoSpec(a.url):null;if(!spec){bad('Unzulässige Video-URL in Sicherung.');continue;}out.videos[k].push({title:looseText(a.title,160)||'Video',url:spec.url,note:looseText(a.note,1000),rights:a.rights===true});}
 }
 if(v.guides!==undefined&&!isRecord(v.guides))bad('Service-Quelle in Sicherung ungültig.');
 else for(const [k,g] of Object.entries(v.guides??{})){
  if(!KEY_RE.test(k)||(strict&&!partKeys.has(k))||!isRecord(g)||typeof g.url!=='string'||!safeURL(g.url)){bad('Service-Quelle in Sicherung ungültig.');continue;}
  out.guides[k]={title:looseText(g.title,160),url:safeURL(g.url),steps:[0,1,2,3].map(i=>looseText(Array.isArray(g.steps)?g.steps[i]:'',8000)),reviewer:looseText(g.reviewer,100),date:looseText(g.date,20),rights:g.rights===true,reviewed:g.reviewed===true};
 }
 if(v.diagrams!==undefined&&!isRecord(v.diagrams))bad('Zeichnung in der Sicherung ungültig.');
 else for(const [k,d] of Object.entries(v.diagrams??{})){
  const stored=deferredImages&&isRecord(d)&&d.idb===true&&d.image==null;
  if(!groupKeys.has(k)||!isRecord(d)||!(stored||isImage(d.image))||!Number.isFinite(d.width)||!Number.isFinite(d.height)||d.width<1||d.height<1){bad('Zeichnung in der Sicherung ungültig.');continue;}
  const pins={};if(d.pins!==undefined&&!isRecord(d.pins))bad('Hotspot verweist auf unbekanntes Teil.');
  else for(const [id,pin] of Object.entries(d.pins??{})){if(!isRecord(pin)||!isSafeId(id)||(strict&&!partKeys.has(partKey(k.split(':')[0],id)))){bad('Hotspot verweist auf unbekanntes Teil.');continue;}pins[id]={x:clamp(pin.x,0,100),y:clamp(pin.y,0,100)};}
  out.diagrams[k]={image:stored?null:d.image,...(stored?{idb:true}:{}),width:d.width,height:d.height,title:looseText(d.title,160),credit:looseText(d.credit,500),rights:d.rights===true,pins};
 }
 return out;
}
export function validateBackup(raw,ctx){if(!isRecord(raw)||raw.type!=='coldstart-backup')throw new Error('Das ist keine COLDSTART-Projektsicherung.');return cleanPersonal(raw.personal,{...ctx,strict:true});}
export const hasPersonalData=s=>Boolean(s.list?.length||Object.keys(s.videos??{}).length||Object.keys(s.guides??{}).length||Object.keys(s.diagrams??{}).length||Object.values(s.profiles??{}).some(p=>p&&(p.date||p.engine||p.mods)));
export function germanDate(v){const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(String(v??''));return m?`${m[3]}.${m[2]}.${m[1]}`:String(v??'');}
export function csvCell(v){let s=String(v??'');if(/^[=+@-]/.test(s.trimStart())||/^[\t\r]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';}
export function csvList(list,parts){return '\uFEFF'+[['Baureihe','Bauteil','Referenznummer','Anzahl (selbst gewählt)','Passung bestätigt','Notiz'],...list.map(x=>{const p=parts.find(p=>p.model===x.model&&p.id===x.id);return[x.model,p?.name??x.id,p?.number??'offen',x.qty,x.checked?'vom Nutzer bestätigt':'offen',x.note??''];})].map(row=>row.map(csvCell).join(';')).join('\r\n');}
