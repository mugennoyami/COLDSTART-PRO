import {escapeHTML} from './core.mjs';
import {FAULT_CODES,FAULT_RANGES,ASSIST_TOPICS,ASSIST_VIEWS,CODE_LETTERS,P_SUBSYSTEMS,CODE_LEVELS,AI_MODELS,BROWSER_MODELS} from './assistant-data.mjs';

// Reine Logik des Werkstatt-Assistenten: ohne DOM, ohne Netzwerk, in Node testbar.
export const ASSIST_MODELS=['E36','E46'];
export const AI_HISTORY=8;
export const AI_MAX_QUESTION=1500;
const LEARN_KIND_LABEL={video:'Video',guide:'Anleitung',hub:'Übersicht',book:'Kaufquelle'};
const HOWTO_WORDS=['wechs','tausch','ersetz','einbau','ausbau','erneuer','anleitung','tutorial','schritt','wie mache','wie geht'];
const DIAG_WORDS=['erkenn','defekt','kaputt','geraeusch','symptom','woran','ursache','warum','was kann','leuchtet','problem'];

export function assistNorm(v){return ' '+String(v??'').toLocaleLowerCase('de').replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,' ').trim()+' ';}

// OBD-Codes wie P0171, p 0171 oder P-0171. Ohne Lookbehind, damit ältere Safari-Versionen das Skript parsen.
export function assistDetectCodes(text){const s=String(text??'').toUpperCase(),re=/(^|[^A-Z0-9])([PBCU])[\s-]?([0-3][0-9A-F]{3})(?![0-9A-Z])/g,out=[];let m;while((m=re.exec(s))&&out.length<6){const c=m[2]+m[3];if(!out.includes(c))out.push(c);}return out;}
const assistCodeNum=c=>parseInt(c.slice(1),16);
export function assistCodeStructure(code){const c=String(code).toUpperCase(),l=c[0],d=c[1];const generic=l==='P'?d==='0'||d==='2':d==='0',maker=l==='P'?d==='1':d==='1'||d==='2',mixed=l==='P'&&d==='3';
 return{letter:l,area:CODE_LETTERS[l]||'Unbekannter Bereich',kind:generic?'generic':maker?'manufacturer':mixed?'mixed':'reserved',subsystem:l==='P'&&(d==='0'||d==='2')?P_SUBSYSTEMS[c[2]]||null:null};}
export function assistLookupCode(code){const c=String(code??'').toUpperCase();if(!/^[PBCU][0-3][0-9A-F]{3}$/.test(c))return null;const structure=assistCodeStructure(c);const exact=FAULT_CODES.find(e=>e.code===c);if(exact)return{...exact,code:c,match:'exact',structure};
 const range=FAULT_RANGES.find(r=>r.from[0]===c[0]&&assistCodeNum(c)>=assistCodeNum(r.from)&&assistCodeNum(c)<=assistCodeNum(r.to));if(range)return{...range,code:c,match:'range',structure};return{code:c,match:'structure',structure,links:[]};}
export function assistCodeKindText(s){return{generic:'Genormter Code: Die Grundbedeutung ist herstellerübergreifend festgelegt; Ursachen unten sind typisch für E36/E46.',manufacturer:'Herstellerspezifischer Code: Die Bedeutung hängt vom Steuergerät und Softwarestand ab (z. B. MS41 beim M52, MS42 beim M52TU, MS43 beim M54). Den Klartext mit einem BMW-fähigen Tester lesen.',mixed:'Teils genormt, teils herstellerspezifisch. Den Klartext mit einem BMW-fähigen Tester lesen.',reserved:'Reservierter Codebereich. Code noch einmal genau ablesen.'}[s.kind];}

export function assistDetectModel(text,fallback='E36'){const t=assistNorm(text).replace(/ e (36|46) /g,' e$1 ');const a=t.includes(' e36 ')||t.includes(' e36'),b=t.includes(' e46 ')||t.includes(' e46');return a&&!b?'E36':b&&!a?'E46':ASSIST_MODELS.includes(fallback)?fallback:'E36';}

export function assistMatchTopics(text,topics=ASSIST_TOPICS){const t=assistNorm(text),howto=HOWTO_WORDS.some(w=>t.includes(w)),diag=DIAG_WORDS.some(w=>t.includes(w));
 const scored=topics.map(topic=>{if(topic.excludes?.some(w=>t.includes(w)))return{topic,score:0};let score=0;for(const [k,w] of topic.keys)if(t.includes(k))score+=w;if(score>0&&((topic.kind==='anleitung'&&howto)||(topic.kind==='diagnose'&&diag)))score+=2;return{topic,score};}).filter(x=>x.score>=4).sort((a,b)=>b.score-a.score);
 if(!scored.length)return[];const top=scored[0].score;return scored.filter((x,i)=>i===0||x.score>=top*0.7).slice(0,2);}

// Katalog der gültigen Verweisziele. Zurückgestellte Quellen (andere Motorisierung, Quellenkonflikt) sind nie Ziel.
export function assistBuildCatalog({parts=[],groups=[],learning=[],topics=[],chapters=[],workflows=[]}={}){return{
 parts:new Map(parts.filter(p=>ASSIST_MODELS.includes(p?.model)&&typeof p.id==='string').map(p=>[`${p.model}:${p.id}`,p])),
 groups:new Map(groups.map(g=>[g.id,g])),
 learning:new Map(learning.filter(r=>r&&!['excluded','conflict'].includes(r.profileStatus)).map(r=>[r.id,r])),
 topics:new Map(topics.map(t=>[t.id,t])),chapters:new Map(chapters.map(c=>[c.code,c])),workflows:new Map(workflows.map(w=>[w.id,w]))};}

export function assistYoutubeQuery(v){const q=String(v??'').replace(/[\u0000-\u001f\u007f<>"`{}[\]\\|]/g,' ').replace(/\s+/g,' ').trim().slice(0,90).trim();return /[a-zäöüß]/i.test(q)?q:null;}
export const assistYoutubeURL=q=>'https://www.youtube.com/results?search_query='+encodeURIComponent(q);

// Eine Markierung wie „teil:E36:front-disc“ in eine geprüfte Aktion übersetzen. Unbekannte Ziele ergeben null.
export function assistParseMarker(raw,cat,{model=null}={}){const s=String(raw??'').trim(),i=s.indexOf(':');if(i<1||!cat)return null;const type=s.slice(0,i).trim().toLowerCase(),rest=s.slice(i+1).trim(),[a='',b='']=rest.split(':').map(x=>x.trim());
 switch(type){
  case 'gruppe':case 'zeichnung':{const m=a.toUpperCase(),g=cat.groups.get(b);if(!ASSIST_MODELS.includes(m)||!g)return null;return{type:'nav',key:`nav:${m}:${g.id}:`,model:m,group:g.id,part:null,label:`Eigene Ansicht: ${g.name} · ${m}`};}
  case 'teil':{const m=a.toUpperCase(),p=cat.parts.get(`${m}:${b}`);if(!p||!cat.groups.has(p.group))return null;return{type:'nav',key:`nav:${m}:${p.group}:${p.id}`,model:m,group:p.group,part:p.id,label:`Bauteil: ${p.name} · ${m}`};}
  case 'quelle':case 'video':case 'anleitung':{const r=cat.learning.get(rest);if(!r)return null;if(model&&Array.isArray(r.models)&&!r.models.includes(model))return null;return{type:'learn',key:`learn:${r.id}`,id:r.id,kind:r.kind,label:`${LEARN_KIND_LABEL[r.kind]||'Quelle'}: ${r.title}`};}
  case 'handbuch':{const t=cat.topics.get(rest);if(!t)return null;if(model&&Array.isArray(t.models)&&t.models.length&&!t.models.includes(model))return null;return{type:'topic',key:`topic:${t.id}`,id:t.id,label:`Handbuch: ${t.title}`};}
  case 'kapitel':{const c=cat.chapters.get(rest);if(!c||(model&&model!=='E36'))return null;return{type:'chapter',key:`chapter:${c.code}`,code:c.code,manualId:c.manualId,pdfPage:c.pdfPage,bookPage:c.bookPage||'',label:`Handbuch E36 · ${c.code} ${c.title}`};}
  case 'ablauf':{const w=cat.workflows.get(rest);if(!w)return null;return{type:'workflow',key:`workflow:${w.id}`,id:w.id,label:`Arbeitsübersicht: ${w.title}`};}
  case 'ansicht':{const v=rest.toLowerCase();if(!Object.hasOwn(ASSIST_VIEWS,v))return null;return{type:'view',key:`view:${v}`,id:v,label:ASSIST_VIEWS[v]};}
  case 'katalog':{const m=a.toUpperCase(),q=assistYoutubeQuery(rest.slice(rest.indexOf(':')+1));if(!ASSIST_MODELS.includes(m)||rest.indexOf(':')<1||!q)return null;return{type:'catalog',key:`catalog:${m}:${q.toLowerCase()}`,model:m,query:q,label:`Originalzeichnungen: „${q}“ · ${m}`};}
  case 'youtube':{const q=assistYoutubeQuery(rest);if(!q)return null;return{type:'youtube',key:`yt:${q.toLowerCase()}`,query:q,url:assistYoutubeURL(q),label:`YouTube-Suche: ${q}`};}
 }return null;}
export function assistMergeActions(...lists){const seen=new Set(),out=[];for(const a of lists.flat()){if(!a||seen.has(a.key))continue;seen.add(a.key);out.push(a);}return out;}
export function assistResolveLinks(templates,model,cat){const m=ASSIST_MODELS.includes(model)?model:'E36';return assistMergeActions((templates||[]).map(t=>assistParseMarker(String(t).replace(/\{M\}/g,m).replace(/\{m\}/g,m.toLowerCase()),cat,{model:m})));}

// KI-Text: Markierungen [[…]] herauslösen, prüfen und als Aktionen zurückgeben. Ungültige werden still entfernt.
export function assistExtractMarkers(text,cat){const actions=[],out=[],re=/\[\[([^[\]\n]{1,160})\]\]/g;
 for(const line of String(text??'').replace(/\r/g,'').split('\n')){const items=[];const marked=line.replace(re,(_,inner)=>{const a=assistParseMarker(inner,cat);items.push(a);if(a)actions.push(a);return '\u0000';});
  if(!items.length){if(!/^\s*(?:Links?|Verweise?|Weiterführend|Siehe auch|Buttons?)\s*:?\s*$/i.test(line))out.push(line);continue;}
  if(/^\s*(?:[-*•→]|\d{1,2}[.)])?\s*(?:(?:Links?|Verweise?|Weiterführend|Siehe auch)\s*:?)?[\s:,;.–-]*$/i.test(marked.replace(/\u0000/g,'')))continue;
  let i=0;out.push(marked.replace(/\u0000/g,()=>{const a=items[i++];return a?`„${a.label}“`:'';}).replace(/[ \t]{2,}/g,' '));}
 return{text:out.join('\n').replace(/\n{3,}/g,'\n\n').trim(),actions:assistMergeActions(actions)};}

// Antwort aus dem eingebauten Wissen.
export function assistLocalAnswer(question,{model='E36',catalog}={}){const q=String(question??'').slice(0,AI_MAX_QUESTION),m=assistDetectModel(q,model),codes=assistDetectCodes(q),blocks=[];let actions=[];
 for(const c of codes.slice(0,4)){const info=assistLookupCode(c);blocks.push({type:'code',info});actions.push(...assistResolveLinks(info.links,m,catalog));if(info.match!=='exact')actions.push(assistParseMarker(`youtube:BMW ${m} Fehler ${c}`,catalog));}
 const topics=assistMatchTopics(q),related=[];
 if(!codes.length)topics.forEach((x,i)=>{if(i===0){blocks.push({type:'topic',topic:x.topic});actions.push(...assistResolveLinks(x.topic.links,m,catalog));}else related.push({type:'ask',key:`ask:${x.topic.id}`,question:x.topic.title,label:`Auch passend: ${x.topic.title}`});});
 else if(topics[0]&&topics[0].score>=8&&topics[0].topic.kind!=='atlas')related.push({type:'ask',key:`ask:${topics[0].topic.id}`,question:topics[0].topic.title,label:`Auch passend: ${topics[0].topic.title}`});
 const t=assistNorm(q),hex=!codes.length&&/fehler|code|inpa|ista|speicher/.test(t)?String(q).toUpperCase().match(/(?:^|[^A-Z0-9])([0-9A-F]{4})(?![0-9A-Z])/):null;
 if(hex&&/[A-F]/.test(hex[1])&&/[0-9]/.test(hex[1]))blocks.unshift({type:'hex',code:hex[1]});
 const found=blocks.length>0;if(!found){actions.push(assistParseMarker(`youtube:BMW ${m} ${q}`,catalog),assistParseMarker('ansicht:hilfe',catalog));}
 actions=assistMergeActions(actions,related).slice(0,9);
 const summary=found?blocks.map(b=>b.type==='code'?`${b.info.code}: ${b.info.title||'kein Eintrag, nur Codestruktur'}`:b.type==='topic'?b.topic.title:`BMW-Fehlerort ${b.code}`).join('; '):'';
 return{model:m,codes,topics:topics.map(x=>x.topic.id),blocks,actions,found,summary};}

// Sichere Darstellung: erst escapen, dann nur bekannte Formatierung erzeugen.
export function assistRenderRich(text){const inline=s=>escapeHTML(s).replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/`([^`]+)`/g,'<code>$1</code>');let html='',list=null,para=[];
 const flushP=()=>{if(para.length){html+=`<p>${para.map(inline).join('<br>')}</p>`;para=[];}},flushL=()=>{if(list){html+=`<${list.tag}>${list.items.map(i=>`<li>${inline(i)}</li>`).join('')}</${list.tag}>`;list=null;}};
 for(const raw of String(text??'').replace(/\r/g,'').split('\n')){const l=raw.trim();let m;if(!l){flushP();flushL();continue;}
  if((m=l.match(/^[-*•–]\s+(.*)$/))){flushP();if(list?.tag!=='ul'){flushL();list={tag:'ul',items:[]};}list.items.push(m[1]);continue;}
  if((m=l.match(/^\d{1,2}[.)]\s+(.*)$/))){flushP();if(list?.tag!=='ol'){flushL();list={tag:'ol',items:[]};}list.items.push(m[1]);continue;}
  if((m=l.match(/^#{1,4}\s+(.*)$/))){flushP();flushL();html+=`<h3>${inline(m[1])}</h3>`;continue;}
  flushL();para.push(l);}
 flushP();flushL();return html;}
const assistList=(tag,items)=>items?.length?`<${tag}>${items.map(i=>`<li>${escapeHTML(i)}</li>`).join('')}</${tag}>`:'';
export function assistRenderCode(info){const E=escapeHTML,s=info.structure;if(info.match==='structure')return `<article class="assist-card assist-code"><div class="assist-code-head"><code>${E(info.code)}</code><span class="assist-level assist-level-none">Kein Eintrag</span></div><h3>Nicht im eingebauten Wissen</h3><ul><li>Bereich: ${E(s.area)}</li>${s.subsystem?`<li>Teilsystem: ${E(s.subsystem)}</li>`:''}<li>${E(assistCodeKindText(s))}</li>${s.letter!=='P'?'<li>Solche Codes liest ein einfacher OBD-Scanner bei E36/E46 meist nicht; dafür braucht es einen BMW-fähigen Tester.</li>':''}</ul><p class="assist-tip">Mit aktivierter KI kann ich den Code genauer einordnen. Nenne dazu am besten den Klartext und das Steuergerät aus dem Tester.</p></article>`;
 return `<article class="assist-card assist-code level-${info.level}"><div class="assist-code-head"><code>${E(info.code)}</code><span class="assist-level">${E(CODE_LEVELS[info.level])}</span></div><h3>${E(info.title)}</h3><p class="assist-meta">${E(info.system)}${info.match==='range'?` · Codegruppe ${E(info.from)}–${E(info.to)}`:''} · ${s.kind==='generic'?'genormter Code':'herstellerspezifisch'}</p>${info.safety?`<p class="assist-safety">${E(info.safety)}</p>`:''}<div class="assist-sub">Typische Ursachen</div>${assistList('ol',info.causes)}<div class="assist-sub">So prüfst du</div>${assistList('ul',info.checks)}${info.tip?`<p class="assist-tip">${E(info.tip)}</p>`:''}</article>`;}
export function assistRenderTopic(topic){const E=escapeHTML;return `<article class="assist-card assist-topic"><div class="assist-kind">${{diagnose:'Diagnose',anleitung:'Anleitung',atlas:'Im Atlas'}[topic.kind]||'Thema'}</div><h3>${E(topic.title)}</h3><p>${E(topic.lead)}</p>${topic.safety?`<p class="assist-safety">${E(topic.safety)}</p>`:''}${(topic.sections||[]).map(([h,items])=>`<div class="assist-sub">${E(h)}</div>${assistList('ul',items)}`).join('')}</article>`;}
export function assistRenderBlocks(answer){const E=escapeHTML;if(!answer.found)return `<p>Dazu habe ich kein eingebautes Wissen. Probier es mit einem Fehlercode (z. B. P0300) oder einem Stichwort wie Radlager, Bremse, Überhitzung, Ölverlust oder Fehlerspeicher.</p>`;
 const shown=new Map();return answer.blocks.map(b=>{if(b.type==='code'&&b.info.causes&&shown.has(b.info.causes))return `<article class="assist-card assist-code level-${b.info.level}"><div class="assist-code-head"><code>${E(b.info.code)}</code><span class="assist-level">${E(CODE_LEVELS[b.info.level])}</span></div><h3>${E(b.info.title)}</h3><p class="assist-meta">Gleiche Ursachen und Prüfschritte wie bei ${E(shown.get(b.info.causes))}.</p></article>`;if(b.type==='code'&&b.info.causes)shown.set(b.info.causes,b.info.code);return b.type==='code'?assistRenderCode(b.info):b.type==='topic'?assistRenderTopic(b.topic):`<article class="assist-card"><div class="assist-code-head"><code>${E(b.code)}</code><span class="assist-level assist-level-none">BMW-Fehlerort</span></div><p>Das sieht nach einem BMW-internen Fehlerort aus (Hex-Nummer aus INPA/ISTA). Diese Nummern bedeuten je Steuergerät etwas anderes. Für eine Einordnung den Klartext und das Steuergerät (z. B. DME MS43) nennen.</p></article>`;}).join('');}
export function assistRenderActions(actions){const E=escapeHTML;if(!actions?.length)return '';return `<div class="assist-actions">${actions.map(a=>{const c=`assist-chip assist-chip-${a.type==='learn'?(a.kind==='video'?'video':'doc'):a.type}`;switch(a.type){
 case 'nav':return `<button type="button" class="${c}" data-assist-nav="${E(`${a.model}|${a.group}|${a.part||''}`)}">${E(a.label)}</button>`;
 case 'learn':return `<button type="button" class="${c}" data-learning-open="${E(a.id)}">${E(a.label)}</button>`;
 case 'topic':return `<button type="button" class="${c}" data-open-topic="${E(a.id)}">${E(a.label)}</button>`;
 case 'chapter':return `<button type="button" class="${c}" data-open-manual="${E(a.manualId)}" data-pdf-page="${E(a.pdfPage)}" data-book-page="${E(a.bookPage)}">${E(a.label)}</button>`;
 case 'workflow':return `<button type="button" class="${c}" data-document-workflow="${E(a.id)}">${E(a.label)}</button>`;
 case 'view':return `<button type="button" class="${c}" data-assist-view="${E(a.id)}">${E(a.label)}</button>`;
 case 'ask':return `<button type="button" class="${c}" data-assist-ask="${E(a.question)}">${E(a.label)}</button>`;
 case 'catalog':return `<button type="button" class="${c}" data-assist-catalog="${E(`${a.model}|${a.query}`)}">${E(a.label)}</button>`;
 case 'youtube':return `<a class="${c}" href="${E(a.url)}" target="_blank" rel="noopener noreferrer">${E(a.label)} ↗</a>`;}return '';}).join('')}</div>`;}

// ---- OpenAI Chat Completions
export const aiModelInfo=id=>AI_MODELS.find(m=>m.id===id)||null;
export const aiValidModelId=id=>typeof id==='string'&&/^[A-Za-z0-9][A-Za-z0-9._:-]{1,79}$/.test(id);
export const aiValidKey=k=>typeof k==='string'&&/^sk-[A-Za-z0-9_-]{20,400}$/.test(k);
export const aiMaskKey=k=>aiValidKey(k)?`sk-…${k.slice(-4)}`:'';
const aiClip=(v,n)=>String(v??'').replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g,'').trim().slice(0,n);
export function aiSystemPrompt({model='E36',groupId=null,partId=null,view=null,profile=null,catalog,local=null}={}){const cat=catalog,groups=[...cat.groups.values()],gName=id=>cat.groups.get(id)?.name||id;
 const partLines=ASSIST_MODELS.map(m=>`Bauteile ${m}: `+groups.map(g=>`${g.id}: `+[...cat.parts.values()].filter(p=>p.model===m&&p.group===g.id).map(p=>`${p.id} (${p.name})`).join(', ')).join(' | ')).join('\n');
 const learnLines=[...cat.learning.values()].filter(r=>['guide','video','hub'].includes(r.kind)).map(r=>`${r.id} = ${LEARN_KIND_LABEL[r.kind]} ${r.models.join('/')}, ${r.groups.map(gName).join('/')}: ${r.title}`).join('\n');
 const topicLines=[...cat.topics.values()].filter(t=>t.models?.length).map(t=>`${t.id} (${t.title})`).join(', ');
 const chapterLines=[...cat.chapters.values()].map(c=>`${c.code} ${c.title}`).join(', ');
 const cur=cat.groups.get(groupId),part=cat.parts.get(`${model}:${partId}`);
 const state=`Baureihe ${model}${view==='car'?' (Fahrzeugübersicht)':cur?`, Baugruppe ${cur.name}${part?`, Bauteil ${part.name}`:''}`:''}.`+(profile&&(profile.date||profile.engine)?` Vom Nutzer erfasster Bauzustand: ${profile.date?'Bauzeit '+aiClip(profile.date,40):''}${profile.date&&profile.engine?', ':''}${profile.engine?'Motor '+aiClip(profile.engine,60):''}.`:'');
 return [
 'Du bist der Werkstatt-Assistent im COLDSTART Garage Atlas, einer privaten Teile- und Service-App für BMW E36 und E46 (Referenzprofile: E36 328i Coupé mit M52, E46 325i Limousine mit M54). Du hilfst bei der Navigation in der App, erklärst Fehlercodes aus dem Steuergerät und gibst praktische Tipps zu typischen Problemen, Wartung und Reparatur.',
 '',
 'Regeln:',
 '- Antworte auf Deutsch, per du, kurz und praxisnah (höchstens etwa 200 Wörter). Gliedere mit kurzen Absätzen oder Listen mit "- ". Keine Tabellen, keine Überschriften mit #.',
 '- Fehlercodes: Bedeutung, wahrscheinlichste Ursachen am E36/E46 nach Häufigkeit, konkrete Prüfschritte, Dringlichkeit.',
 '- Herstellerspezifische Codes (P1xxx, B/C/U-Codes, BMW-Hex-Fehlerorte aus INPA/ISTA) bedeuten je Steuergerät (z. B. MS41, MS42, MS43) etwas anderes: sag das, nenne Möglichkeiten nur als Vermutung und frag nach Klartext und Steuergerät.',
 '- Erfinde keine Drehmomente, Füllmengen, Sollwerte, Teilenummern oder Wartungsintervalle. Verweise dafür auf fahrzeuggültige Quellen (Handbuch, ETK, ISTA).',
 '- Bremsen, Lenkung, Fahrwerk, Airbag und Kraftstoffanlage sind sicherheitskritisch: weise kurz darauf hin und empfiehl im Zweifel eine Fachwerkstatt.',
 '- Versprich keine Ferndiagnose; benenne Unsicherheit offen.',
 '- Schreibe keine URLs.',
 '',
 'Verweise: Setze passende Verweise als Markierungen in eigene Zeilen am Ende der Antwort, höchstens 5. Die App macht daraus Buttons. Nur diese Formen und nur IDs aus den Listen:',
 '[[katalog:MODELL:Suchbegriff]] öffnet die passenden BMW-Originalzeichnungen (Explosionszeichnungen mit Positionen) im Katalog. Suchbegriff ist ein Bauteilname, z. B. [[katalog:E36:Radlager]], [[katalog:E46:Thermostat]]. Für Reparaturen und Teile immer zuerst diesen Verweis setzen.',
 '[[gruppe:MODELL:GRUPPE]] öffnet die eigene schematische Ansicht einer der vier Atlas-Baugruppen, z. B. [[gruppe:E46:front]]',
 '[[teil:MODELL:TEIL-ID]] öffnet ein Bauteil in der Zeichnung, z. B. [[teil:E36:cool-thermostat]]',
 '[[quelle:ID]] öffnet eine kuratierte Anleitung oder ein geprüftes Video',
 '[[handbuch:ID]] öffnet eine Arbeitsübersicht zum E36-Handbuch',
 '[[kapitel:NR]] öffnet ein Kapitel im E36-Handbuch (Bentley, US-E36)',
 '[[ansicht:ID]] öffnet einen Bereich der App',
 '[[youtube:Suchbegriff]] öffnet eine YouTube-Suche, z. B. [[youtube:BMW E46 Radlager vorne wechseln]]. Für Reparaturen ohne passende kuratierte Quelle immer eine YouTube-Suche anbieten.',
 '',
 'Gezeichnete Baugruppen (nur diese vier): '+groups.map(g=>`${g.id} = ${g.name}`).join(', ')+'. Liegt ein Thema außerhalb, sag das kurz und nutze Handbuch-Kapitel oder YouTube-Suche.',
 partLines,
 'Kuratierte Quellen:\n'+learnLines,
 'Handbuch-Arbeitsübersichten (nur E36): '+topicLines,
 'Handbuch-Kapitel (nur E36): '+chapterLines,
 'Ansichten: '+Object.entries(ASSIST_VIEWS).map(([k,v])=>`${k} (${v})`).join(', '),
 '',
 'Aktueller Stand in der App: '+state,
 local?.found?`Das eingebaute Nachschlagewerk zeigt dem Nutzer bereits: ${local.summary}. Ergänze es, statt es zu wiederholen.`:''
 ].filter(x=>x!=='').join('\n');}
export function aiBuildRequest({model,system,history=[],question,bare=false}){const messages=[{role:'system',content:system},...history.slice(-AI_HISTORY).map(h=>({role:h.role==='assistant'?'assistant':'user',content:aiClip(h.content,4000)})),{role:'user',content:aiClip(question,AI_MAX_QUESTION)}];const body={model,messages};if(!bare){body.max_completion_tokens=1600;Object.assign(body,aiModelInfo(model)?.params||{});}return body;}
export function aiParseResponse(json){const ch=json?.choices?.[0],msg=ch?.message;const text=typeof msg?.content==='string'?msg.content.trim():'';const usage={input:Number(json?.usage?.prompt_tokens)||0,output:Number(json?.usage?.completion_tokens)||0};
 if(!text&&typeof msg?.refusal==='string'&&msg.refusal)return{text:msg.refusal,usage,finish:'refusal',model:json?.model};
 if(!text)throw new Error(ch?.finish_reason==='length'?'Die Antwort wurde an der Token-Grenze abgeschnitten. Bitte die Frage kürzer oder konkreter stellen.':'OpenAI hat eine leere Antwort geliefert.');
 return{text,usage,finish:ch?.finish_reason||'',model:typeof json?.model==='string'?json.model:''};}
export function aiErrorMessage(status,json){const err=json?.error,detail=typeof err?.message==='string'?' OpenAI meldet: „'+aiClip(err.message,180)+'“':'';
 if(status===401)return 'OpenAI lehnt den Schlüssel ab (401). Schlüssel prüfen oder neu erstellen.'+detail;
 if(status===403)return 'Zugriff verweigert (403): Der Schlüssel darf dieses Modell nicht nutzen oder der Zugang ist eingeschränkt.'+detail;
 if(status===404)return 'Modell nicht gefunden (404). Modell-ID in den Einstellungen prüfen.'+detail;
 if(status===429)return err?.code==='insufficient_quota'?'Kein Guthaben oder Budgetgrenze erreicht (429). Guthaben und Limits auf platform.openai.com prüfen.':'Zu viele Anfragen (429). Kurz warten und erneut senden.'+detail;
 if(status===400)return 'OpenAI hat die Anfrage abgelehnt (400).'+detail;
 if(status>=500)return `OpenAI ist gerade gestört (${status}). Später erneut versuchen.`;
 return `Unerwartete Antwort von OpenAI (${status}).`+detail;}
export const AI_NETWORK_ERROR='Keine Verbindung zu OpenAI. Mögliche Gründe: Schlüssel ungültig oder widerrufen, kein Guthaben, unbekannte Modell-ID, keine Internetverbindung oder die Plattform blockiert die Verbindung. Der Browser verrät bei solchen Fehlern keine Details.';
export function aiEstimateCost(model,usage){const m=aiModelInfo(model);if(!m||!usage)return null;return(usage.input*m.input+usage.output*m.output)/1e6;}
export function aiFormatCost(usd){if(usd===null||!Number.isFinite(usd))return '';const cent=usd*100;return `≈ ${cent.toLocaleString('de-DE',{maximumFractionDigits:cent<0.1?3:2})} US-Cent`;}

// ---- Kostenlose KI im Browser (WebLLM): kleine Modelle mit 4096 Token Kontext brauchen eine kurze, faktengestützte Anweisung.
export const browserModelInfo=id=>BROWSER_MODELS.find(m=>m.id===id)||null;
export function browserVariant(id,hasF16){const m=browserModelInfo(id);return m?(hasF16?m.f16:m.f32):null;}
export function aiFormatMB(mb){return mb>=1000?`${(Math.round(mb/100)/10).toLocaleString('de-DE')} GB`:`${Math.round(mb)} MB`;}
export function assistLocalFacts(local,max=1600){if(!local?.found)return '';const seen=new Map();const lines=local.blocks.map(b=>{
 if(b.type==='code'){const i=b.info;if(i.causes&&seen.has(i.causes))return `${i.code}: ${i.title}; gleiche Ursachen und Prüfschritte wie ${seen.get(i.causes)}.`;if(i.causes)seen.set(i.causes,i.code);if(i.match==='structure')return `${i.code}: kein Eintrag im Nachschlagewerk. Bereich ${i.structure.area}${i.structure.subsystem?', Teilsystem '+i.structure.subsystem:''}. ${assistCodeKindText(i.structure)}`;return `${i.code}: ${i.title} (${CODE_LEVELS[i.level]}). Ursachen: ${i.causes.join('; ')}. Prüfen: ${i.checks.join('; ')}.${i.safety?' Sicherheit: '+i.safety:''}`;}
 if(b.type==='topic'){const t=b.topic;return `${t.title}: ${t.lead} ${(t.sections||[]).map(([h,items])=>`${h}: ${items.join('; ')}.`).join(' ')}${t.safety?' Sicherheit: '+t.safety:''}`;}
 return `${b.code}: BMW-interner Fehlerort; Bedeutung hängt vom Steuergerät ab.`;}).join('\n');return lines.length>max?lines.slice(0,max-1).replace(/\s+\S*$/,'')+' …':lines;}
export function aiCompactPrompt({model='E36',groupId=null,partId=null,view=null,profile=null,catalog,local=null}={}){const cat=catalog,groups=[...cat.groups.values()],cur=cat.groups.get(groupId),part=cat.parts.get(`${model}:${partId}`);
 const parts=cur?[...cat.parts.values()].filter(p=>p.model===model&&p.group===cur.id).slice(0,14).map(p=>`${p.id} (${p.name})`).join(', '):'';
 const facts=assistLocalFacts(local);
 return [
 'Du bist der Werkstatt-Assistent im COLDSTART Garage Atlas für BMW E36 (328i, M52) und E46 (325i, M54). Antworte auf Deutsch, per du, kurz (höchstens 120 Wörter). Nutze Listen mit "- ".',
 'Regeln: Nenne keine Drehmomente, Füllmengen, Sollwerte oder Teilenummern. Bremsen, Lenkung und Fahrwerk sind sicherheitskritisch. Wenn du etwas nicht sicher weißt, sag das. Stütze dich zuerst auf die Fakten unten. Schreibe keine URLs.',
 'Am Ende darfst du bis zu 3 Verweise in eigene Zeilen setzen: [[katalog:'+model+':Bauteilname]] öffnet die BMW-Originalzeichnungen zu einem Bauteil (z. B. [[katalog:'+model+':Radlager]]), [[gruppe:'+model+':GRUPPE]] öffnet eine eigene Atlas-Baugruppe, [[teil:'+model+':TEIL-ID]] öffnet ein Bauteil, [[youtube:Suchbegriff]] öffnet eine YouTube-Suche.',
 'Baugruppen: '+groups.map(g=>`${g.id} = ${g.name}`).join(', ')+'.',
 parts?`Bauteile der Baugruppe ${cur.name} (${model}): ${parts}.`:'',
 'Aktueller Stand: Baureihe '+model+(view!=='car'&&cur?`, Baugruppe ${cur.name}${part?`, Bauteil ${part.name}`:''}`:'')+'.'+(profile&&(profile.date||profile.engine)?` Bauzustand: ${[profile.date&&'Bauzeit '+aiClip(profile.date,40),profile.engine&&'Motor '+aiClip(profile.engine,60)].filter(Boolean).join(', ')}.`:''),
 facts?'Fakten aus dem Nachschlagewerk (dem Nutzer bereits angezeigt, nicht wiederholen, sondern kurz einordnen und ergänzen):\n'+facts:'Zu dieser Frage hat das Nachschlagewerk keinen Eintrag. Antworte vorsichtig und allgemein und biete eine YouTube-Suche an.'
 ].filter(Boolean).join('\n');}
export function aiCompactMessages({system,history=[],question}){return[{role:'system',content:system},...history.slice(-4).map(h=>({role:h.role==='assistant'?'assistant':'user',content:aiClip(h.content,500)})),{role:'user',content:aiClip(question,600)}];}
export const assistStripMarkersLive=t=>String(t??'').replace(/\[\[[^\]\n]*\]\]/g,'').replace(/\[\[[^\]\n]*$/,'');
