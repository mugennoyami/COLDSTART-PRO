import {SOURCE_DOCUMENTS} from './documents-data.mjs';
import {csvCell} from './core.mjs';
const fold=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/ß/g,'ss');
export function filterDocuments({query='',category='all',model='all',kind='all'}={}){
 const terms=fold(query).split(/\s+/).filter(Boolean);
 return SOURCE_DOCUMENTS.filter(d=>(category==='all'||d.category===category)&&(model==='all'||(model==='unassigned'?!d.models.length&&!d.generic:d.generic||d.models.includes(model)))&&(kind==='all'||d.kind===kind)&&terms.every(t=>fold([d.title,d.summary,d.scopeNote,d.edition,d.kind,...(d.identifiers??[]),...d.flags].join(' ')).includes(t))).sort((a,b)=>(a.priority??3)-(b.priority??3)||a.title.localeCompare(b.title,'de'));
}
export function documentRegisterCSV(){
 const rows=[['Titel','Art','Stand','Thema','Modellbezug','Umfang','Gültigkeitsgrenzen','Prüfhinweise','Fundstellen (PDF)','Originalquelle','SHA-256'],...SOURCE_DOCUMENTS.map(d=>[d.title,d.kind,d.edition,d.category,d.generic?'produktbezogen':d.models.join(', ')||'keine automatische Zuordnung',d.pages+(d.mimeType==='image/jpeg'?' Bild':' PDF-Seiten'),d.coverage,d.flags.join(' | '),d.refs.map(r=>r.pdfPage+': '+r.label).join(' | '),d.sourceURL,d.sha256])];
 return '\uFEFF'+rows.map(row=>row.map(csvCell).join(';')).join('\r\n');
}
export const WHEEL_IDENTITIES=[
 {docId:'drive-14',label:'Rondell 0021 / R.O.D. 21 807',types:['21807','x2180740t'],type:'21 807 / X 21 807 40 T',width:8,diameter:17,et:40,pcd:'5x120',bore:72.6,page:9,productionFrom:'2002-10',revisions:[{id:'V04',label:'V04 · 11.05.2005',identityPage:9,vehiclePage:10,pairPage:14},{id:'V02',label:'V02 · 28.05.2003',identityPage:2,vehiclePage:3,pairPage:7}]},
 {docId:'drive-17',label:'Rondell 0058 / R.O.D. 58 807',types:['58807','x5880735t'],type:'58 807 / X 58 807 35 T',width:8,diameter:17,et:35,pcd:'5x120',bore:72.6,page:1,productionFrom:'1998-08'},
 {docId:'drive-07',label:'HTG 1775 · BMW-Ausführung 512035726',types:['htg1775'],type:'HTG 1775',width:7.5,diameter:17,et:35,pcd:'5x120',bore:72.6,page:2},
 {docId:'drive-09',label:'HTG 1785 · BMW-Ausführung 512030726',types:['htg1785'],type:'HTG 1785',width:8.5,diameter:17,et:30,pcd:'5x120',bore:72.6,page:2},
 {docId:'drive-01',label:'BBS RC090 · Quellenkonflikt',types:['rc090'],type:'RC090',width:8,diameter:17,et:20,pcd:'5x120',bore:72.6,page:1,blocked:true}
];
const wheelToken=s=>fold(s).replace(/[×✕]/g,'x').replace(/[^a-z0-9]/g,'');
export function measure(value){const s=String(value??'').trim().replace(/\s*(?:mm|zoll|inch|inches|["″”]|j)$/i,'').trim().replace(',','.');return /^-?\d+(?:\.\d+)?$/.test(s)?Number(s):null;}
export function normalizeTire(value){const t=String(value??'').toUpperCase().replace(/\s+/g,'').replace('ZR','R');return /^(?:1\d{2}|2\d{2}|3\d{2})\/(?:\d{2})R(?:1\d|2\d)$/.test(t)?t:null;}
// Exact transcription of the general V17 pairing list in both supplied 21 807 revisions.
// A listed pair does not establish that either size is valid in a particular vehicle row.
export const V17_PAIRS={
 '205/40R17':['225/35R17'],'205/50R17':['225/45R17','235/45R17','245/40R17','255/40R17'],'215/40R17':['245/35R17'],'215/45R17':['225/45R17','235/40R17','245/40R17','255/40R17'],'215/50R17':['235/45R17','245/45R17','275/40R17'],'225/45R17':['245/40R17','255/40R17','265/40R17'],'225/50R17':['245/45R17','255/45R17'],'225/55R17':['245/50R17','255/50R17'],'235/40R17':['265/35R17','275/35R17'],'235/45R17':['255/40R17','265/40R17'],'235/50R17':['255/45R17'],'235/55R17':['255/50R17'],'245/40R17':['255/40R17','275/35R17'],'245/45R17':['275/40R17'],'255/45R17':['285/40R17']
};
export function compareWheelDocument(docId,input={}){
 const p=WHEEL_IDENTITIES.find(p=>p.docId===docId);if(!p)throw new Error('Kein erfasster Radidentitäts-Datensatz.');
 const checks=[{key:'type',label:'Radtyp',expected:p.type,actual:String(input.type??''),ok:p.types.includes(wheelToken(input.type)),missing:!String(input.type??'').trim()},...['width','diameter','et','bore'].map(key=>{const actual=measure(input[key]);return {key,label:{width:'Breite (J)',diameter:'Durchmesser (Zoll)',et:'Einpresstiefe (mm)',bore:'Mittenloch (mm)'}[key],expected:p[key],actual:input[key]??'',ok:actual!==null&&actual===p[key],missing:actual===null};}),{key:'pcd',label:'Lochzahl × Lochkreis',expected:p.pcd,actual:String(input.pcd??''),ok:wheelToken(input.pcd)===wheelToken(p.pcd),missing:!String(input.pcd??'').trim()}];
 const missing=checks.filter(c=>c.missing),mismatch=checks.filter(c=>!c.missing&&!c.ok);
 let status=p.blocked?'source-conflict':mismatch.length?'mismatch':missing.length?'incomplete':'identity-match';
 let pairing='not-evaluated',front=normalizeTire(input.front),rear=normalizeTire(input.rear);
 if(docId==='drive-14'){pairing=!front||!rear?'incomplete':front===rear?'same-size':V17_PAIRS[front]?.includes(rear)?'listed':'not-listed';}
 return {status,checks,missing:missing.map(c=>c.label),mismatches:mismatch.map(c=>c.label),pairing,front,rear,revision:p.revisions?.find(r=>r.id===input.revision)??p.revisions?.[0],approved:false,remaining:['Herstellerzeichen, vollständige Ausführung und Herstellungsdatum am Rad bestätigen.','Fahrzeugtyp/Genehmigung, Karosserie, Leistung und genaue Reifenzeile prüfen.','Last-/Geschwindigkeitsindex, Achslasten, Achszuordnung, Befestigungsmittel und sämtliche Auflagen prüfen.','Weitere Änderungen, Freigängigkeit und erforderliche Abnahme gesondert klären.']};
}
