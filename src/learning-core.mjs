import {safeURL,norm,videoSpec} from './core.mjs';
import {LEARNING_RESOURCES} from './learning-data.mjs';

export const LEARNING_KINDS={guide:'Anleitung',video:'Video',book:'Kaufquelle',hub:'Übersicht'};
export const LEARNING_GROUPS={front:'Vorderradbremse',rear:'Hinterradbremse',oil:'Ölfilter / Ölwechsel',cool:'Wasserpumpe / Thermostat'};
export const learningWithheld=r=>['excluded','conflict'].includes(r?.profileStatus);
export const learningById=id=>LEARNING_RESOURCES.find(r=>r.id===id);
export function learningStatus(r){return {listed:'Referenzprofil genannt · Bauzustand offen',open:'Variante vor Verwendung prüfen',excluded:'Für Referenzprofil zurückgestellt',conflict:'Quellenkonflikt · nicht empfohlen'}[r?.profileStatus]||'Prüfstatus offen';}
export function learningURL(value){const url=safeURL(value);if(!url)return null;const u=new URL(url);return ['club.autodoc.de','www.youtube.com','shop.delius-klasing.de','www.booklooker.de'].includes(u.hostname)&&!['zid','token','signature','access_token'].some(k=>u.searchParams.has(k))?url:null;}
export function selectLearning({model='all',group='all',kind='all',query='',showExcluded=false}={},items=LEARNING_RESOURCES){const q=norm(String(query));return items.filter(r=>(showExcluded||!learningWithheld(r))&&(model==='all'||r.models.includes(model))&&(group==='all'||r.groups.includes(group))&&(kind==='all'||r.kind===kind)&&(!q||norm([r.title,r.provider,r.scope,r.note,r.edition,r.isbn,r.offerId,...r.models,...r.groups.map(g=>LEARNING_GROUPS[g])].filter(Boolean).join(' ')).includes(q)));}
export function learningForPart(p,kind){if(!p||!['E36','E46'].includes(p.model)||!Object.hasOwn(LEARNING_GROUPS,p.group))return [];return selectLearning({model:p.model,group:p.group,kind}).filter(r=>['guide','video'].includes(r.kind));}
export function learningEmbed(r){if(r?.kind!=='video'||learningWithheld(r)||!learningURL(r.url))return null;const spec=videoSpec(r.url);return spec?.type==='youtube'&&new URL(spec.url).searchParams.get('v')===r.videoId?spec:null;}
export function learningPrice(r){const p=r?.price;if(!p||p.currency!=='EUR'||!Number.isFinite(p.amount)||p.amount<0||!(p.shipping===null||Number.isFinite(p.shipping)&&p.shipping>=0))return null;return {amount:p.amount,total:p.shipping===null?null:Math.round((p.amount+p.shipping)*100)/100,currency:'EUR',shipping:p.shipping,tax:p.tax};}
export function learningPriceText(r){const p=learningPrice(r);if(!p)return '';const euro=n=>n.toLocaleString('de-DE',{style:'currency',currency:'EUR'});return p.tax==='private'?`${euro(p.total??p.amount)} inkl. erfasstem Versand · Privatverkauf`:`${euro(p.amount)} inkl. MwSt.${p.shipping===null?' · ggf. zzgl. Versand':''}`;}
