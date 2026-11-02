import {escapeHTML,formatOE,norm} from './core.mjs';
import {BASE_VEHICLES,vehicleById} from './vehicle-core.mjs';
import {VEHICLE_VARIANTS} from './vehicle-data.mjs';
import {catalogId,catalogImagePath,catalogMatches,zoomAtPoint} from './catalog-core.mjs';
import {BMW_CATALOG} from './catalog-data.mjs';

export function createCatalogExplorer(options){
 const esc=escapeHTML;
 const host=document.querySelector('#catalog-workspace');
 const atlas={active:true,model:options.model(),variant:options.variant(),profiles:new Map(),mode:'overview',category:null,component:null,position:null,query:'',original:false,details:new Map(),searches:new Map(),loading:new Set(),errors:new Set()};
 let transform={scale:1,x:0,y:0},resizeObserver,pointerState=new Map(),gesture=null,dragged=false,lastDrag=-Infinity;
 const vehicle=()=>vehicleById(VEHICLE_VARIANTS,atlas.model,atlas.variant);
 const profileKey=()=>`${atlas.model}:${atlas.variant}`;
 const isBase=()=>atlas.variant===BASE_VEHICLES[atlas.model];
 const profile=()=>isBase()?BMW_CATALOG.profiles[atlas.model]:(atlas.profiles.get(profileKey())??{label:vehicle()?.label??atlas.variant,categories:[]});
 const categories=()=>profile()?.categories??[];
 const allGroups=()=>categories().flatMap(c=>c.groups.map(g=>({...g,categoryId:catalogId(c.url),categoryName:c.name})));
 const currentCategory=()=>categories().find(c=>catalogId(c.url)===atlas.category);
 const currentGroup=()=>allGroups().find(g=>g.id===atlas.component);
 const currentDetail=()=>atlas.details.get(`${profileKey()}:${atlas.component}`);
 const categoryIcon=name=>/Motor|Kraftstoff|Kühler/.test(name)?'◈':/achse|Lenkung|Brems|Räder/.test(name)?'⊙':/Elektrik|Beleuchtung|Audio|Kommunikation|Anzeige/.test(name)?'⌁':/Getriebe|Gelenkwelle|Kupplung|Schaltung/.test(name)?'⚙':'▱';
 const totals=()=>({categories:categories().length,groups:allGroups().length});
 const image=g=>BMW_CATALOG.unavailableImages?.includes(String(g?.image??'').split('?')[0])?'assets/catalog/unavailable.svg':catalogImagePath(g?.image);

 function sync(){
  const next=options.model();
  if(atlas.model!==next||atlas.variant!==options.variant()){atlas.model=next;atlas.variant=options.variant();atlas.mode='overview';atlas.component=null;atlas.category=null;atlas.query='';atlas.position=null;atlas.active=true;}
  host.hidden=!atlas.active;
  document.querySelector('.explorer-grid').hidden=atlas.active;
  document.body.classList.toggle('catalog-active',atlas.active);
  document.querySelector('#group-count').textContent=`${totals().categories} ${totals().categories===1?'GRUPPE':'GRUPPEN'}`;
  document.querySelector('#coverage-foot').textContent=`${atlas.model} · ${atlas.variant} · ${totals().groups} lokale Zeichnungen · Stand 30.10.2026`;
 }
 function renderSidebar(){
  const nav=document.querySelector('#group-nav');
  nav.innerHTML=`<div class="catalog-nav-list">${categories().map(c=>`<button class="catalog-nav-item ${atlas.active&&atlas.category===catalogId(c.url)?'active':''}" data-atlas-category="${catalogId(c.url)}" aria-current="${atlas.active&&atlas.category===catalogId(c.url)?'true':'false'}"><span class="category-symbol" aria-hidden="true">${categoryIcon(c.name)}</span><span>${esc(c.name)}</span><b>${c.groups.length}</b></button>`).join('')}</div><details class="legacy-nav"><summary>Eigene Teile &amp; Handbuchbilder</summary><p>Deine bisherigen Ergänzungen</p>${[['front','Vorderradbremse'],['rear','Hinterradbremse'],['oil','Ölfilter & Gehäuse'],['cool','Wasserpumpe & Thermostat']].map(([id,label])=>`<button data-atlas-legacy="${id}">${esc(label)} <span>↗</span></button>`).join('')}</details>`;
  document.querySelector('#overview').classList.toggle('active',atlas.active&&atlas.mode==='overview');
 }
 function chrome(){
  if(host.querySelector('.catalog-chrome'))return;
  host.innerHTML=`<div class="catalog-chrome"><nav class="catalog-crumbs" aria-label="Katalogpfad"></nav><label class="catalog-search"><span aria-hidden="true">⌕</span><input id="catalog-search" type="search" placeholder="Zeichnung, Bauteil oder OE-Nummer suchen …" autocomplete="off" aria-label="Gesamten Fahrzeugkatalog durchsuchen"><kbd>/</kbd></label></div><div class="catalog-content"></div>`;
 }
 function render(){
  host.querySelector('.atlas-maximized')?.classList.remove('atlas-maximized');document.body.classList.remove('atlas-is-maximized');
  sync();renderSidebar();if(!atlas.active)return;chrome();host.classList.toggle('catalog-source-only',!isBase()&&!vehicle()?.catalogLocal);
  const c=currentCategory(),g=currentGroup();
  host.querySelector('.catalog-crumbs').innerHTML=`<button data-atlas-home>${atlas.model}</button><span>/</span>${c?`<button data-atlas-category="${atlas.category}">${esc(c.name)}</button>`:'<span>Fahrzeugübersicht</span>'}${g&&atlas.mode==='diagram'?`<span>/</span><strong>${esc(g.name)}</strong>`:''}`;
  const input=host.querySelector('#catalog-search');input.disabled=!isBase()&&!vehicle()?.catalogLocal;input.placeholder=input.disabled?'Lokaler Katalog dieser Ausführung noch offen':'Zeichnung, Bauteil oder OE-Nummer suchen …';if(input.value!==atlas.query)input.value=atlas.query;
  resizeObserver?.disconnect();
  const content=host.querySelector('.catalog-content');
  content.innerHTML=atlas.mode==='overview'?overviewHTML():atlas.mode==='diagram'?diagramHTML():galleryHTML();
  if(atlas.mode==='overview'||atlas.mode==='diagram')bindViewport();
  if(!isBase()&&vehicle()?.catalogLocal&&!atlas.profiles.has(profileKey())&&!atlas.errors.has(`profile:${profileKey()}`))loadProfile();
  if(atlas.mode==='diagram'){renderPosition();if(!currentDetail()&&!atlas.errors.has(`${profileKey()}:${atlas.component}`))loadDetails();}
 }
 function showOverview(){atlas.active=true;atlas.mode='overview';atlas.category=null;atlas.component=null;atlas.position=null;atlas.query='';render();host.scrollIntoView({block:'start'});options.changed?.();}
 function showCategory(id){atlas.active=true;atlas.category=id;atlas.mode='gallery';atlas.component=null;atlas.query='';atlas.position=null;render();host.scrollIntoView({block:'start'});options.changed?.();}
 function showComponent(id,categoryId){
  const g=allGroups().find(x=>x.id===id&&(!categoryId||x.categoryId===categoryId));if(!g)return;
  atlas.active=true;atlas.category=g.categoryId;atlas.component=id;atlas.mode='diagram';atlas.position=null;render();host.scrollIntoView({block:'start'});options.changed?.();
 }
 function overviewHTML(){
  const pins=[['Motor',34,43,'Motor'],['Kühler',14,55,'Kühlung'],['Vorderachse',48,70,'Vorderachse'],['Hinterachse',90,59,'Hinterachse'],['Fahrzeugausstattung',63,34,'Innenraum'],['Karosserie Blechteile',79,44,'Karosserie'],['Audio Navigation Elektroniksysteme',68,48,'Audio'],['Bremsen',49,62,'Bremsen']];
  return `${variantStatusHTML()}<section class="atlas-overview"><div class="atlas-section-heading"><div><div class="eyebrow">${atlas.model} / ${esc(vehicle()?.label??profile().label)} · ${esc(atlas.variant)} · ${esc(vehicle()?.engine??'')}</div><h2>${totals().groups?'Dein BMW. Bis ins Detail.':'Deine Ausführung ist erfasst.'}</h2><p>${totals().groups?'Bereich am Fahrzeug wählen oder alle Baugruppen entdecken.':'Originalkatalog oben öffnen oder eine lokal importierte Referenzausführung wählen.'}</p></div><span class="atlas-counter">${totals().groups?`<b>${totals().groups}</b> ZEICHNUNGEN`:'FAHRZEUGDATEN<br>ERFASST'}</span></div><div class="atlas-viewport atlas-car-viewport" id="atlas-viewport" tabindex="0" role="region" aria-label="Fahrzeugansicht ${atlas.model}: Mausrad zoomt, Ziehen verschiebt"><div class="atlas-floor"></div><div class="atlas-scene" data-width="1400" data-height="933"><img class="atlas-car-image" src="assets/vehicles/${atlas.model.toLowerCase()}.webp" alt="BMW ${atlas.model} ${atlas.model==='E36'?'328i Coupé':'325i Limousine'} in Graphitsilber, Ansicht schräg von vorne" draggable="false">${pins.map(([name,x,y,label],i)=>{const c=categories().find(c=>c.name===name);return c?`<button class="atlas-car-pin" data-atlas-category="${catalogId(c.url)}" style="left:${x}%;top:${y}%" aria-label="${esc(label)} öffnen"><i>${String(i+1).padStart(2,'0')}</i><span>${esc(label)}</span></button>`:'';}).join('')}</div><div class="atlas-stage-tag"><i></i> ${atlas.model} / BAUREIHENILLUSTRATION</div>${zoomTools()}<span class="atlas-view-credit">FAHRZEUGILLUSTRATION · KI-GENERIERT</span></div><div class="atlas-gesture-hint"><span>↔ Ziehen zum Verschieben</span><span>⊕ Mausrad / zwei Finger zum Zoomen</span><button data-atlas-all>Alle ${totals().categories} ${totals().categories===1?'Baugruppe':'Baugruppen'} ↓</button></div></section><div class="atlas-category-heading" id="atlas-categories"><div><div class="eyebrow">${isBase()?'DER GESAMTE FAHRZEUGKATALOG':'LOKAL IMPORTIERTE BAUGRUPPEN'}</div><h2>Was möchtest du dir ansehen?</h2></div><span>${totals().categories} ${totals().categories===1?'Hauptgruppe':'Hauptgruppen'}</span></div><div class="atlas-category-grid">${categories().map(c=>`<button class="atlas-category-card" data-atlas-category="${catalogId(c.url)}"><span class="atlas-category-icon">${categoryIcon(c.name)}</span><span><strong>${esc(c.name)}</strong><small>${c.groups.length} Zeichnungen</small></span><i>↗</i></button>`).join('')}</div><p class="atlas-source-foot">BMW-Teilekatalog über Leebmann24 · Typschlüssel ${esc(atlas.variant)} · Erfasst am 30.10.2026. Bauzeit und Ausstattung am tatsächlichen Fahrzeug prüfen.</p>`;
 }
 function variantStatusHTML(){
  if(isBase())return `<p class="variant-reference">${esc(vehicle()?.label??profile().label)} · ${esc(vehicle()?.engine??'')} · ${esc(atlas.variant)} · <button data-vehicle-picker>Fahrzeugvariante ändern ↗</button></p>`;
  if(atlas.profiles.has(profileKey()))return `<section class="variant-status"><div><strong>${esc(profile().scope??'Katalog')} · ${esc(atlas.variant)} · ${esc(vehicle()?.engine??'')}</strong><p>${profile().completeCatalog?'Alle verfügbaren Hauptgruppen dieser Ausführung sind lokal importiert.':'Die Motor-Bildtafeln und Teilepositionen dieser Referenzausführung sind importiert. Die übrigen Hauptgruppen sind noch offen; weitere Ausführungen desselben Motors können abweichen.'}</p></div><button class="secondary small" data-vehicle-picker>Variante ändern ↗</button></section>`;
  if(vehicle()?.catalogLocal)return `<div class="variant-status" role="status"><p>${atlas.errors.has(`profile:${profileKey()}`)?'Dieser Fahrzeugkatalog konnte nicht geladen werden.':'Der gewählte Fahrzeugkatalog wird geladen …'}</p>${atlas.errors.has(`profile:${profileKey()}`)?'<button class="secondary" data-atlas-profile-retry>Erneut laden</button>':''}</div>`;
  return `<section class="variant-status"><div><strong>${esc(vehicle()?.label??atlas.variant)} · ${esc(vehicle()?.engine??'')} · ${esc(atlas.variant)}</strong><p>Die Fahrzeugdaten sind erfasst. Die Bildtafeln und Teilepositionen dieser Ausführung sind noch nicht lokal importiert. Bei Leebmann in der Fahrzeugauswahl den Typschlüssel <b>${esc(atlas.variant)}</b> wählen.</p></div><a class="secondary small" href="https://www.leebmann24.com/de/de/collection/bmw-ersatzteile-10004" target="_blank" rel="noopener noreferrer">Leebmann-Katalog öffnen ↗</a></section>`;
 }
 async function loadProfile(){
  const key=profileKey(),m=atlas.model,v=atlas.variant,loadingKey=`profile:${key}`;
  if(atlas.loading.has(loadingKey))return;atlas.loading.add(loadingKey);atlas.errors.delete(loadingKey);
  try{const r=await fetch(`catalog/profiles/${m}/${v}.json`);if(!r.ok)throw new Error('profile');const p=await r.json();if(p.variantId!==v||!Array.isArray(p.categories))throw new Error('invalid profile');atlas.profiles.set(key,p);}
  catch{atlas.errors.add(loadingKey);}finally{atlas.loading.delete(loadingKey);}
  if(key===profileKey())render();
 }
 function filteredGroups(){
  const index=atlas.searches.get(profileKey())??{};
  return allGroups().filter(g=>(!atlas.category||g.categoryId===atlas.category)&&catalogMatches(g,atlas.query,index[g.id]??''));
 }
 function galleryHTML(){
  const c=currentCategory(),groups=filteredGroups();
  return `<div class="atlas-gallery-heading"><div><div class="eyebrow">${atlas.model} / ORIGINALZEICHNUNGEN</div><h2>${esc(c?.name??'Alle Baugruppen')}</h2><p>${groups.length} ${atlas.query?'Treffer':'Zeichnungen'}${atlas.query?` für „${esc(atlas.query)}“`:''}</p></div><button class="secondary small" data-atlas-home>← Fahrzeug</button></div><div class="atlas-gallery-toolbar"><span>${atlas.query?'Suche in Zeichnungen und erfassten Teilepositionen':'Zeichnung öffnen, Position wählen und Varianten vergleichen.'}</span>${atlas.category&&atlas.query?'<button data-atlas-global-search>Im gesamten Fahrzeug suchen ↗</button>':''}</div>${groups.length?`<div class="atlas-drawing-grid">${groups.map(g=>`<button class="atlas-drawing-card" data-atlas-component="${g.id}" data-atlas-owner="${g.categoryId}"><div class="atlas-card-image"><img loading="lazy" src="${image(g)}" alt="Explosionszeichnung ${esc(g.name)}" draggable="false"></div><div class="atlas-card-text"><small>${esc(g.categoryName)} · ${g.id}</small><h3>${esc(g.name)}</h3><span>Zeichnung öffnen <b>↗</b></span></div></button>`).join('')}</div>`:`<div class="atlas-empty"><h3>Keine Zeichnung gefunden.</h3><p>Versuche einen anderen Begriff oder eine vollständige BMW-Teilenummer.</p><button class="secondary" data-atlas-global-search>Alle Baugruppen durchsuchen</button></div>`}`;
 }
 function zoomTools(){return `<div class="atlas-zoom-tools" aria-label="Ansicht steuern"><button data-atlas-zoom="out" aria-label="Ansicht verkleinern">−</button><output id="atlas-zoom-label">100%</output><button data-atlas-zoom="in" aria-label="Ansicht vergrößern">+</button><span></span><button data-atlas-zoom="reset" aria-label="Ansicht einpassen">⤢</button><button data-atlas-fullscreen aria-label="Vollbild umschalten">⛶</button></div>`;}
 function diagramHTML(){
  const g=currentGroup(),d=currentDetail(),failed=atlas.errors.has(`${profileKey()}:${atlas.component}`);
  const visibleHotspots=d&&!image(d).endsWith('unavailable.svg')?d.hotspots:[];
  return `<div class="atlas-gallery-heading"><div><div class="eyebrow">${atlas.model} / BILDTAFEL ${g.id}</div><h2>${esc(g.name)}</h2><p>${esc(g.categoryName)}</p></div><button class="secondary small" data-atlas-category="${atlas.category}">← Alle Zeichnungen</button></div><div class="atlas-diagram-layout"><section class="atlas-diagram-main"><div class="atlas-diagram-bar"><span><i></i> ORIGINALGEOMETRIE · ANKLICKBARE POSITIONEN</span><button class="atlas-original-toggle" data-atlas-original aria-pressed="${atlas.original}">${atlas.original?'COLDSTART-Ansicht':'Originalansicht'}</button></div><div class="atlas-viewport ${atlas.original?'atlas-original':''}" id="atlas-viewport" tabindex="0" role="region" aria-label="Explosionszeichnung ${esc(g.name)}: Mausrad zoomt, Ziehen verschiebt"><div class="atlas-scene" data-width="${d?.width||800}" data-height="${d?.height||560}"><img class="atlas-technical-image" src="${image(d||g)}" alt="BMW-Explosionszeichnung ${esc(g.name)}" draggable="false">${visibleHotspots.map(h=>`<button class="atlas-hotspot ${atlas.position===String(h.position)?'selected':''}" style="left:${h.x}%;top:${h.y}%" data-atlas-position="${esc(h.position)}" aria-label="Position ${esc(h.position)} auswählen">${esc(h.position)}</button>`).join('')??''}</div>${zoomTools()}</div><div class="atlas-gesture-hint"><span>↔ Ziehen · Mausrad / zwei Finger zum Zoomen</span><span>BMW / Leebmann24 · 30.10.2026</span></div><section class="atlas-positions"><div class="atlas-position-heading"><h3>Positionen dieser Zeichnung <b>${d?.positions?.length??'…'}</b></h3><span>Varianten bleiben getrennt.</span></div>${d?positionsHTML(d):`<div class="atlas-loading">${failed?'Die Teileliste konnte nicht geladen werden.':'Teilepositionen werden geladen …'}${failed?'<button class="secondary" data-atlas-retry>Erneut laden</button>':''}</div>`}</section></section><aside class="atlas-part-detail" id="atlas-part-detail" aria-label="Details zur gewählten Teileposition"></aside></div>`;
 }
 function positionsHTML(d){
  if(!d.positions.length)return `<div class="atlas-empty"><p>${d.unavailable?'Für diese Bildtafel ist noch keine geprüfte Teileliste gespeichert. Die Originalzeichnung ist vorhanden; die Originalseite kann separat geöffnet werden.':'Diese Bildtafel enthält keine angebotenen Teilepositionen. Die Originalzeichnung bleibt verfügbar.'}</p><a class="secondary" href="${esc(d.url)}" target="_blank" rel="noopener noreferrer">Originalseite öffnen ↗</a></div>`;
  return `<div class="atlas-table-scroll"><table class="atlas-parts-table"><thead><tr><th>POS.</th><th>BAUTEIL / VARIANTE</th><th>BMW-REFERENZ</th><th>ANZAHL*</th></tr></thead><tbody>${d.positions.flatMap(p=>(p.variants.length?p.variants:[{name:'Position ohne angebotene Variante'}]).map((v,i)=>`<tr class="${atlas.position===String(p.position)?'selected':''}" data-atlas-position="${esc(p.position)}"><td><button data-atlas-position="${esc(p.position)}" aria-label="Position ${esc(p.position)} auswählen">${esc(p.position)}</button></td><td><button data-atlas-position="${esc(p.position)}">${esc(v.name)}</button>${v.note?`<small>${esc(v.note)}</small>`:''}${i===0&&p.variants.length>1?`<em>${p.variants.length} Varianten</em>`:''}</td><td><code>${esc(formatOE(v.number)||v.number||'Nicht angegeben')}</code></td><td>${esc(v.quantity??'–')}</td></tr>`)).join('')}</tbody></table></div><p class="atlas-table-note">* Menge aus der Katalogposition. Varianten sind Alternativen und werden einzeln geprüft. Originalquelle und tatsächlichen Bauzustand vor Bestellung abgleichen.</p>`;
 }
 function renderPosition(){
  const detail=host.querySelector('#atlas-part-detail');if(!detail)return;
  const g=currentGroup(),d=currentDetail(),p=d?.positions.find(p=>String(p.position)===atlas.position);
  host.querySelectorAll('[data-atlas-position]').forEach(el=>el.classList.toggle('selected',el.dataset.atlasPosition===atlas.position));
  if(!p&&atlas.position){detail.innerHTML=`<div class="atlas-detail-top"><div class="eyebrow">${atlas.model} / POSITION ${esc(atlas.position)}</div><h3>Keine angebotene Teilevariante</h3><p>Für diese Bildposition enthält die erfasste Originalseite keine angebotene Einzelteilvariante.</p></div><div class="atlas-detail-bottom"><a class="secondary full" href="${esc(g.url)}" target="_blank" rel="noopener noreferrer">Originalseite öffnen ↗</a><p class="atlas-fit-note">Aus der Zeichnung werden keine Teilenummern oder Mengen abgeleitet.</p></div>`;return;}
  if(!p){detail.innerHTML=`<div class="atlas-detail-top"><div class="atlas-detail-icon">⌖</div><div class="eyebrow">VOM BILD ZUM BAUTEIL</div><h3>Welche Position brauchst du?</h3><p>Wähle eine Nummer in der Zeichnung oder eine Zeile in der Teileliste.</p></div><div class="atlas-detail-bottom"><div class="atlas-detail-meta"><span>QUELLE</span><strong>BMW / Leebmann24</strong><span>FAHRZEUGVARIANTE</span><strong>${atlas.model} · ${esc(atlas.variant)} · ${esc(vehicle()?.engine??'')}</strong><span>KATALOGSTAND</span><strong>30.10.2026</strong></div><a class="secondary full" href="${esc(g.url)}" target="_blank" rel="noopener noreferrer">Originalzeichnung öffnen ↗</a><p class="atlas-fit-note">Bauzeit, Ausstattung und Umbauten können Teile und Varianten verändern.</p></div>`;return;}
  detail.innerHTML=`<div class="atlas-detail-top"><div class="eyebrow">${atlas.model} / POSITION ${esc(p.position)}</div><h3>${esc(p.variants[0]?.name??'Teileposition')}</h3><p>${esc(g.name)}</p><span class="atlas-variant-badge">${p.variants.length} ${p.variants.length===1?'Variante':'Varianten'} in der Quelle</span></div><div class="atlas-detail-bottom">${p.variants.map((v,i)=>`<article class="atlas-variant"><div class="eyebrow">${esc(v.manufacturer||'BMW')} ${p.variants.length>1?`/ VARIANTE ${i+1}`:''}</div><h4>${esc(v.name)}</h4><code>${esc(formatOE(v.number)||v.number||'Keine Nummer angegeben')}</code>${v.note?`<p>${esc(v.note)}</p>`:''}<small>Katalogmenge: ${esc(v.quantity??'nicht angegeben')}</small><a href="${esc(v.url||g.url)}" target="_blank" rel="noopener noreferrer">Originalteil &amp; aktuelle Verfügbarkeit ↗</a><button class="primary full" data-atlas-add="${i}">＋ Zur Projektliste</button></article>`).join('')}<p class="atlas-fit-note">Die Referenz gehört zu dieser Originalquelle. Individuelle Passung vor Bestellung anhand von VIN, Bauzeit und Ausstattung prüfen.</p></div>`;
 }
 async function loadDetails(){
  const key=`${profileKey()}:${atlas.component}`,model=atlas.model,variant=atlas.variant,id=atlas.component;
  if(atlas.loading.has(key))return;atlas.loading.add(key);atlas.errors.delete(key);
  try{const response=await fetch(variant===BASE_VEHICLES[model]?`catalog/${model}/${id}.json`:`catalog/variants/${model}/${variant}/${id}.json`);if(!response.ok)throw new Error('not found');const d=await response.json();if(d.id!==id||!Array.isArray(d.positions))throw new Error('invalid data');atlas.details.set(key,d);}
  catch{atlas.errors.add(key);}finally{atlas.loading.delete(key);}
  if(atlas.active&&atlas.model===model&&atlas.variant===variant&&atlas.component===id&&atlas.mode==='diagram'){
   const d=currentDetail(),needle=norm(atlas.query);
   if(needle&&d)atlas.position=String(d.positions.find(p=>p.variants.some(v=>norm(`${v.name} ${v.number||''} ${v.note||''}`).includes(needle)))?.position??'')||null;
   // Render once with cached details; failed loads do not start a retry loop.
   render();
  }
 }
 async function loadSearch(){
  const m=profileKey(),model=atlas.model,variant=atlas.variant;if(!isBase()&&!vehicle()?.catalogLocal)return;if(atlas.searches.has(m)||atlas.loading.has(`search:${m}`))return;
  atlas.loading.add(`search:${m}`);
  try{const r=await fetch(isBase()?`catalog/search-${model}.json`:`catalog/variants/search-${model}-${variant}.json`);if(!r.ok)throw new Error('search');atlas.searches.set(m,await r.json());if(profileKey()===m&&atlas.mode==='gallery')render();}catch{options.notify?.('Teilenummernsuche konnte nicht geladen werden. Zeichnungsnamen bleiben durchsuchbar.');}finally{atlas.loading.delete(`search:${m}`);}
 }
 function resetTransform(){transform={scale:1,x:0,y:0};applyTransform();}
 function applyTransform(){const scene=host.querySelector('.atlas-scene');if(scene)scene.style.transform=`translate(${transform.x}px,${transform.y}px) scale(${transform.scale})`;const label=host.querySelector('#atlas-zoom-label');if(label)label.textContent=`${Math.round(transform.scale*100)}%`;}
 function changeZoom(factor,point){const viewport=host.querySelector('#atlas-viewport'),scene=viewport?.querySelector('.atlas-scene');if(!viewport||!scene)return;const r=viewport.getBoundingClientRect();transform=zoomAtPoint(transform,transform.scale*factor,(point?.x??r.width/2)-scene.offsetLeft,(point?.y??r.height/2)-scene.offsetTop);applyTransform();}
 function fitScene(){
  const viewport=host.querySelector('#atlas-viewport'),scene=viewport?.querySelector('.atlas-scene');if(!scene)return;
  const r=viewport.getBoundingClientRect(),w=Number(scene.dataset.width),h=Number(scene.dataset.height),fit=Math.min(r.width/w,r.height/h)*(atlas.mode==='overview'?.96:.94);
  scene.style.width=`${w*fit}px`;scene.style.height=`${h*fit}px`;scene.style.left=`${(r.width-w*fit)/2}px`;scene.style.top=`${(r.height-h*fit)/2}px`;resetTransform();
 }
 function bindViewport(){
  const viewport=host.querySelector('#atlas-viewport');if(!viewport)return;pointerState.clear();gesture=null;dragged=false;fitScene();
  resizeObserver=new ResizeObserver(()=>fitScene());resizeObserver.observe(viewport);
  viewport.addEventListener('wheel',ev=>{ev.preventDefault();const r=viewport.getBoundingClientRect();changeZoom(Math.exp(-Math.max(-180,Math.min(180,ev.deltaY*(ev.deltaMode===1?16:1)))*.0025),{x:ev.clientX-r.left,y:ev.clientY-r.top});},{passive:false});
  viewport.addEventListener('pointerdown',ev=>{
   if(ev.button!==0||ev.target.closest('.atlas-zoom-tools'))return;
   pointerState.set(ev.pointerId,{x:ev.clientX,y:ev.clientY});dragged=false;
   if(pointerState.size===1)gesture={kind:'pan',x:ev.clientX,y:ev.clientY,tx:transform.x,ty:transform.y};
   else if(pointerState.size===2){const [a,b]=[...pointerState.values()],r=viewport.getBoundingClientRect(),scene=viewport.querySelector('.atlas-scene');gesture={kind:'pinch',distance:Math.hypot(a.x-b.x,a.y-b.y),start:{...transform},cx:(a.x+b.x)/2-r.left,cy:(a.y+b.y)/2-r.top,bx:scene.offsetLeft,by:scene.offsetTop};}
   if(!ev.target.closest('button,a'))viewport.setPointerCapture(ev.pointerId);
  });
  viewport.addEventListener('pointermove',ev=>{
   if(!pointerState.has(ev.pointerId)||!gesture)return;pointerState.set(ev.pointerId,{x:ev.clientX,y:ev.clientY});
   if(gesture.kind==='pinch'&&pointerState.size===2){const [a,b]=[...pointerState.values()],r=viewport.getBoundingClientRect();const next=zoomAtPoint(gesture.start,gesture.start.scale*Math.hypot(a.x-b.x,a.y-b.y)/Math.max(1,gesture.distance),gesture.cx-gesture.bx,gesture.cy-gesture.by);next.x+=(a.x+b.x)/2-r.left-gesture.cx;next.y+=(a.y+b.y)/2-r.top-gesture.cy;transform=next;dragged=true;}
   else if(gesture.kind==='pan'){const dx=ev.clientX-gesture.x,dy=ev.clientY-gesture.y;if(Math.abs(dx)+Math.abs(dy)>4){dragged=true;transform.x=gesture.tx+dx;transform.y=gesture.ty+dy;viewport.classList.add('dragging');}}
   applyTransform();
  });
  const release=ev=>{pointerState.delete(ev.pointerId);if(dragged)lastDrag=performance.now();viewport.classList.remove('dragging');gesture=null;if(pointerState.size===1){const a=[...pointerState.values()][0];gesture={kind:'pan',x:a.x,y:a.y,tx:transform.x,ty:transform.y};}};
  viewport.addEventListener('pointerup',release);viewport.addEventListener('pointercancel',release);viewport.addEventListener('lostpointercapture',release);
  viewport.addEventListener('dblclick',ev=>{if(ev.target.closest('button'))return;const r=viewport.getBoundingClientRect();if(transform.scale>1.5)resetTransform();else changeZoom(2,{x:ev.clientX-r.left,y:ev.clientY-r.top});});
  viewport.addEventListener('keydown',ev=>{if(ev.target!==viewport)return;if(['+','=','-','0','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(ev.key)){ev.preventDefault();if(ev.key==='0')resetTransform();else if(['+','='].includes(ev.key))changeZoom(1.25);else if(ev.key==='-')changeZoom(.8);else {transform.x+=ev.key==='ArrowLeft'?35:ev.key==='ArrowRight'?-35:0;transform.y+=ev.key==='ArrowUp'?35:ev.key==='ArrowDown'?-35:0;applyTransform();}}});
 }
 document.addEventListener('click',ev=>{
  const target=ev.target.closest('button,[data-atlas-position]');if(!target)return;
  if(performance.now()-lastDrag<250&&target.closest('.atlas-scene')){ev.preventDefault();return;}
  if(target.hasAttribute('data-atlas-home'))return showOverview();
  if(target.dataset.atlasCategory)return showCategory(target.dataset.atlasCategory);
  if(target.dataset.atlasComponent)return showComponent(target.dataset.atlasComponent,target.dataset.atlasOwner);
  if(target.dataset.atlasLegacy){atlas.active=false;sync();options.legacy(target.dataset.atlasLegacy);return;}
  if(target.dataset.atlasPosition!==undefined){atlas.position=target.dataset.atlasPosition;renderPosition();return;}
  if(target.dataset.atlasAdd!==undefined){const d=currentDetail(),g=currentGroup(),p=d?.positions.find(p=>String(p.position)===atlas.position),v=p?.variants[Number(target.dataset.atlasAdd)];if(v)options.add({...v,model:atlas.model,variantId:atlas.variant,vehicleLabel:vehicle()?.label??'',engine:vehicle()?.engine??'',componentId:atlas.component,componentName:g.name,position:atlas.position});return;}
  if(target.dataset.atlasZoom){if(target.dataset.atlasZoom==='reset')resetTransform();else changeZoom(target.dataset.atlasZoom==='in'?1.25:.8);return;}
  if(target.hasAttribute('data-atlas-fullscreen')){
   const viewport=host.querySelector('#atlas-viewport');if(!viewport)return;
   const expand=()=>{viewport.classList.add('atlas-maximized');document.body.classList.add('atlas-is-maximized');};
   if(viewport.classList.contains('atlas-maximized')){viewport.classList.remove('atlas-maximized');document.body.classList.remove('atlas-is-maximized');}
   else if(document.fullscreenElement)document.exitFullscreen?.();
   else if(viewport.requestFullscreen)viewport.requestFullscreen().catch(expand);else expand();
   return;
  }
  if(target.hasAttribute('data-atlas-original')){atlas.original=!atlas.original;host.querySelector('#atlas-viewport')?.classList.toggle('atlas-original',atlas.original);target.setAttribute('aria-pressed',String(atlas.original));target.textContent=atlas.original?'COLDSTART-Ansicht':'Originalansicht';return;}
  if(target.hasAttribute('data-atlas-retry')){loadDetails();return;}
  if(target.hasAttribute('data-atlas-profile-retry')){loadProfile();return;}
  if(target.hasAttribute('data-atlas-global-search')){atlas.category=null;atlas.mode='gallery';render();return;}
  if(target.hasAttribute('data-atlas-all'))host.querySelector('#atlas-categories')?.scrollIntoView({behavior:'smooth'});
 });
 document.addEventListener('input',ev=>{if(ev.target.id!=='catalog-search')return;atlas.query=ev.target.value;atlas.category=null;atlas.component=null;atlas.mode=atlas.query?'gallery':'overview';render();if(atlas.query)loadSearch();});
 document.addEventListener('keydown',ev=>{if(ev.key==='Escape'&&host.querySelector('.atlas-maximized')){host.querySelector('.atlas-maximized').classList.remove('atlas-maximized');document.body.classList.remove('atlas-is-maximized');}});
 return {...atlas,get active(){return atlas.active;},set active(v){atlas.active=v;},render,renderSidebar,sync,showOverview,showCategory,showComponent,focusSearch:()=>host.querySelector('#catalog-search')?.focus()};
}
