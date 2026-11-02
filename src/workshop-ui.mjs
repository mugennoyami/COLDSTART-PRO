import {escapeHTML} from './core.mjs';
import {selectWorkshop} from './workshop-core.mjs';
import {WORKSHOP_FAQ} from './workshop-data.mjs';

export function createWorkshopFAQ({modal,model}){
 const esc=escapeHTML,filters={model:'all',engine:'all',query:''};
 const sources=e=>e.sourceIds.map(id=>WORKSHOP_FAQ.sources.find(s=>s.id===id)).filter(Boolean);
 const engines=()=>[...new Set(WORKSHOP_FAQ.entries.filter(e=>filters.model==='all'||e.models.includes(filters.model)).flatMap(e=>e.engines))].sort();
 const engineOptions=()=>`<option value="all">Alle Motoren / allgemeine Themen</option>${engines().map(e=>`<option value="${esc(e)}" ${filters.engine===e?'selected':''}>${esc(e)}</option>`).join('')}`;
 const list=a=>`<ol>${a.map(x=>`<li>${esc(x)}</li>`).join('')}</ol>`;
 function results(){
  const rows=selectWorkshop(WORKSHOP_FAQ.entries,filters);
  return `<p class="faq-count" role="status">${rows.length} von ${WORKSHOP_FAQ.entries.length} Themen</p><div class="faq-list">${rows.map(e=>`<details class="faq-entry" id="faq-${esc(e.id)}"><summary><span><small>${esc(e.models.join(' / '))} · ${esc(e.engines.length?e.engines.join(' / '):'Motorübergreifend')}</small><strong>${esc(e.title)}</strong></span><i aria-hidden="true">＋</i></summary><div class="faq-body"><div class="faq-tags">${e.tags.map(t=>`<span>${esc(t)}</span>`).join('')}</div>${(e.scope||e.applicability)?`<p class="faq-scope">${esc(e.scope||e.applicability)}</p>`:''}<h4>Woran erkenne ich es?</h4><ul>${e.symptoms.map(t=>`<li>${esc(t)}</li>`).join('')}</ul><h4>Zuerst prüfen</h4>${list(e.checks)}<h4>Lösungswege nach Befund</h4><div class="faq-solutions">${e.solutions.map((s,i)=>`<article><b>${String(i+1).padStart(2,'0')} / ${esc(s.title)}</b><p>${esc(s.text)}</p></article>`).join('')}</div>${e.stop?`<p class="faq-stop"><strong>Arbeitsgrenze</strong> ${esc(e.stop)}</p>`:''}${e.sourceScope?`<p class="faq-source-scope">${esc(e.sourceScope)}</p>`:''}<div class="faq-sources"><strong>Quellen zum Nachlesen</strong>${sources(e).map(s=>`<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.organization)} · ${esc(s.title)} ↗</a>`).join('')}<small>Quellen geprüft am ${esc(WORKSHOP_FAQ.updatedAt.split('-').reverse().join('.'))}</small></div></div></details>`).join('')||'<div class="atlas-empty"><h3>Kein passendes Thema gefunden.</h3><p>Suchbegriff oder Motorfilter ändern.</p></div>'}</div>`;
 }
 function open(){
  Object.assign(filters,{model:model(),engine:'all',query:''});
  modal('Werkstatt-FAQ & Schwachstellen',`<div class="faq-hero"><div class="eyebrow">COLDSTART / WERKSTATTWISSEN</div><h3>Erst den Befund.<br>Dann den nächsten Schritt.</h3><p>Häufige Probleme verstehen, Ursachen eingrenzen und mehrere Lösungswege vergleichen.</p><span>${WORKSHOP_FAQ.entries.length} Themen · Herstellerquellen · Stand 30.10.2026</span></div><div class="faq-filters"><label>Thema suchen<input id="faq-search" type="search" placeholder="z. B. Schraube, Kühlmittel, VANOS …" autocomplete="off"></label><label>Baureihe<select id="faq-model"><option value="all">E36 & E46</option>${['E36','E46'].map(m=>`<option value="${m}" ${filters.model===m?'selected':''}>${m}</option>`).join('')}</select></label><label>Motorbezug<select id="faq-engine">${engineOptions()}</select></label></div><p class="faq-intro">Der jeweilige Motor- und Bauteilbezug steht am Thema. Diagnosewege ersetzen keine zur konkreten Ausführung passende Reparaturvorgabe; Drehmomente und Steuerzeiten werden hier nicht geschätzt.</p><div id="faq-results">${results()}</div>`);
  document.querySelector('#modal').classList.add('manual-reader');
 }
 document.addEventListener('click',ev=>{if(ev.target.closest('[data-workshop-faq]'))open();});
 document.addEventListener('input',ev=>{if(ev.target.id!=='faq-search')return;filters.query=ev.target.value;document.querySelector('#faq-results').innerHTML=results();});
 document.addEventListener('change',ev=>{
  if(ev.target.id==='faq-model'){filters.model=ev.target.value;filters.engine='all';document.querySelector('#faq-engine').innerHTML=engineOptions();}
  else if(ev.target.id==='faq-engine')filters.engine=ev.target.value;else return;
  document.querySelector('#faq-results').innerHTML=results();
 });
 return {open};
}
