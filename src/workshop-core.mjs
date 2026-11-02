import {norm} from './core.mjs';

export function selectWorkshop(entries,{model='all',engine='all',query=''}={}){
 const q=norm(query);
 return entries.filter(e=>(model==='all'||e.models.includes(model))&&(engine==='all'||!e.engines.length||e.engines.includes(engine))&&(!q||norm([e.title,...e.tags,...e.symptoms,...e.checks,...e.solutions.flatMap(s=>[s.title,s.text]),...e.engines].join(' ')).includes(q)));
}

export function validateWorkshop(data){
 const ids=new Set(),sources=new Set();
 if(!Array.isArray(data.entries)||!Array.isArray(data.sources))throw new Error('FAQ-Daten fehlen.');
 for(const s of data.sources){const u=new URL(s.url);if(u.protocol!=='https:'||u.username||u.password||sources.has(s.id)||!s.title||!s.organization)throw new Error('Ungültige FAQ-Quelle.');sources.add(s.id);}
 for(const e of data.entries){
  if(!e.id||ids.has(e.id)||!e.title||!e.models.length||e.models.some(m=>!['E36','E46'].includes(m))||!Array.isArray(e.engines)||!e.symptoms.length||!e.checks.length||e.solutions.length<2||!e.sourceIds.length||e.sourceIds.some(s=>!sources.has(s)))throw new Error(`Unvollständiger FAQ-Eintrag: ${e.id}`);
  ids.add(e.id);
 }
 return data;
}
