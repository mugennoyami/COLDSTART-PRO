import {norm} from './core.mjs';

export const BASE_VEHICLES={E36:'BG11',E46:'AV31'};
export function vehicleVariants(data,model){return data.profiles?.[model]?.variants??[];}
export function vehicleById(data,model,id){return vehicleVariants(data,model).find(v=>v.id===id);}
export function selectVehicles(data,model,filters={}){
 const q=norm(filters.query??'');
 return vehicleVariants(data,model).filter(v=>(!filters.local||v.catalogLocal)&&['body','engine','transmission','market'].every(k=>!filters[k]||filters[k]==='all'||v[k]===filters[k])&&(!q||norm([v.id,v.label,v.body,v.engine,v.transmission,v.market,v.steering,v.from,v.to].join(' ')).includes(q)));
}
export function cleanVehicleSelection(data,value={}){
 return Object.fromEntries(['E36','E46'].map(m=>[m,vehicleById(data,m,value?.[m])?.id??BASE_VEHICLES[m]]));
}
export function cleanVehicleProfiles(data,value={}){
 if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).length>1000)throw new Error('Ungültige Fahrzeugnotizen.');
 const result={};
 for(const [key,p] of Object.entries(value)){
  const [m,id]=key.split(':');
  if(key!==`${m}:${id}`||!vehicleById(data,m,id)||!p||typeof p!=='object')throw new Error('Fahrzeugnotiz ohne gültigen Typschlüssel.');
  result[key]={date:String(p.date??'').slice(0,30),engine:String(p.engine??'').slice(0,80),mods:String(p.mods??'').slice(0,1000)};
 }
 return result;
}
export function validateVehicles(data){
 for(const model of ['E36','E46']){
  const records=vehicleVariants(data,model),ids=new Set();
  if(!records.length)throw new Error(`Keine Fahrzeugvarianten für ${model}.`);
  for(const v of records){
   if(!/^[A-Z\d]{4}$/.test(v.id)||ids.has(v.id)||!v.label||!v.engine||!v.transmission||!v.market||!v.steering||!/^\d{2}\/\d{4}$/.test(v.from)||!/^\d{2}\/\d{4}$/.test(v.to))throw new Error(`Ungültige Fahrzeugvariante ${model}/${v.id}`);
   ids.add(v.id);
  }
  if(!ids.has(BASE_VEHICLES[model]))throw new Error(`Bestandsprofil ${model} fehlt.`);
 }
 return data;
}
