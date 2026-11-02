import {escapeHTML} from './core.mjs';
import {selectVehicles,vehicleVariants} from './vehicle-core.mjs';
import {VEHICLE_VARIANTS} from './vehicle-data.mjs';

export function createVehiclePicker({modal,model,selected,choose}){
 const esc=escapeHTML,filters={query:'',body:'all',engine:'all',transmission:'all',market:'all',local:false};
 const labels={body:'Karosserie',engine:'Motor',transmission:'Getriebe',market:'Markt'};
 function results(){
  const m=model(),rows=selectVehicles(VEHICLE_VARIANTS,m,filters);
  return `<p class="vehicle-result-count" role="status">${rows.length} von ${vehicleVariants(VEHICLE_VARIANTS,m).length} Typschlüsseln</p><div class="vehicle-picker-grid">${rows.map(v=>`<button class="vehicle-choice ${selected()===v.id?'selected':''}" data-vehicle-choice="${v.id}"><span class="vehicle-choice-top"><b>${v.id}</b><small>${selected()===v.id?'AUSGEWÄHLT':m}</small></span><strong>${esc(v.label.replace(/^BMW /,''))}</strong><span class="vehicle-engine">${esc(v.engine)} · ${esc(v.transmission)}</span><span>${esc(v.market)} · ${esc(v.steering)}</span><span>${esc(v.from)} – ${esc(v.to)}</span><span class="vehicle-catalog-state ${v.catalogLocal?'local':''}">${v.catalogLocal?esc(v.catalogScope||'Lokaler Katalog'):'Fahrzeugdaten · Bildtafeln noch offen'}</span></button>`).join('')||'<p class="notice">Keine Variante mit diesen Filtern. Suche oder Filter zurücksetzen.</p>'}</div>`;
 }
 function open(){
  Object.assign(filters,{query:'',body:'all',engine:'all',transmission:'all',market:'all',local:false});
  const m=model(),rows=vehicleVariants(VEHICLE_VARIANTS,m);
  modal(`${m} · Fahrzeugvariante wählen`,`<div class="vehicle-picker-hero"><div class="eyebrow">COLDSTART / DEINE AUSFÜHRUNG</div><h3>Welcher ${m} steht in deiner Garage?</h3><p>Originale Leebmann-Typschlüssel mit Motor, Karosserie, Getriebe und Markt. Bauzeit und Lenkung gehören zur Auswahl.</p></div><div class="vehicle-picker-filters"><label class="vehicle-query">Variante oder Typschlüssel suchen<input id="vehicle-query" type="search" placeholder="z. B. 318i, M3, N42 oder BG11" autocomplete="off"></label>${Object.entries(labels).map(([k,label])=>`<label>${label}<select data-vehicle-filter="${k}"><option value="all">Alle</option>${[...new Set(rows.map(v=>v[k]))].sort().map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join('')}</select></label>`).join('')}</div><p class="vehicle-picker-note">Ein Typschlüssel ist keine VIN. Innerhalb der Bauzeit können Ausstattungen und Teileänderungen abweichen.</p><label class="check-label vehicle-local-filter"><input id="vehicle-local-filter" type="checkbox"> Nur Ausführungen mit lokal importierten Bildtafeln zeigen</label><div id="vehicle-picker-results">${results()}</div>`);
  document.querySelector('#modal').classList.add('manual-reader');
 }
 function refresh(){document.querySelector('#vehicle-picker-results').innerHTML=results();}
 document.addEventListener('click',ev=>{const t=ev.target.closest('button');if(!t)return;if(t.hasAttribute('data-vehicle-picker'))open();else if(t.dataset.vehicleChoice){choose(t.dataset.vehicleChoice);document.querySelector('#modal').close();}});
 document.addEventListener('input',ev=>{if(ev.target.id==='vehicle-query'){filters.query=ev.target.value;refresh();}});
 document.addEventListener('change',ev=>{if(ev.target.id==='vehicle-local-filter'){filters.local=ev.target.checked;refresh();return;}const key=ev.target.dataset.vehicleFilter;if(key&&Object.hasOwn(labels,key)){filters[key]=ev.target.value;refresh();}});
 return {open};
}
