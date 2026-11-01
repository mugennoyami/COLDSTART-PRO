import {escapeHTML,isRecord} from './core.mjs';
import {AI_MODELS,AI_DEFAULT_MODEL,AI_ENDPOINT,AI_PRICE_DATE,ASSIST_SUGGESTIONS} from './assistant-data.mjs';
import {assistBuildCatalog,assistLocalAnswer,assistRenderBlocks,assistRenderActions,assistRenderRich,assistExtractMarkers,assistMergeActions,aiSystemPrompt,aiBuildRequest,aiParseResponse,aiErrorMessage,AI_NETWORK_ERROR,aiEstimateCost,aiFormatCost,aiValidKey,aiValidModelId,aiMaskKey,aiModelInfo,AI_MAX_QUESTION} from './assistant-core.mjs';

// Werkstatt-Assistent: Chatfenster, Einstellungen und der direkte Aufruf der OpenAI-API aus dem Browser.
// Läuft nach app.mjs im selben Bündel und nutzt dessen Zustand (state, parts, render, save, notify, modal-Öffner).
const AI_STORE='coldstart-assistant-v1',AI_KEY_SESSION='coldstart-assistant-key',AI_TIMEOUT=60000;
const aiSettings={enabled:false,model:AI_DEFAULT_MODEL,remember:true,key:''};
const assistChat={history:[],busy:false,cost:0,started:false,settingsOpen:false};
function aiLoadSettings(){try{const s=JSON.parse(localStorage.getItem(AI_STORE)||'{}');if(isRecord(s)){if(typeof s.enabled==='boolean')aiSettings.enabled=s.enabled;if(aiValidModelId(s.model))aiSettings.model=s.model;if(typeof s.remember==='boolean')aiSettings.remember=s.remember;if(aiValidKey(s.key))aiSettings.key=s.key;}}catch{}
 if(!aiSettings.key){try{const k=sessionStorage.getItem(AI_KEY_SESSION);if(aiValidKey(k))aiSettings.key=k;}catch{}}}
function aiSaveSettings(){let ok=true;const base={enabled:aiSettings.enabled,model:aiSettings.model,remember:aiSettings.remember};
 try{localStorage.setItem(AI_STORE,JSON.stringify(aiSettings.remember&&aiSettings.key?{...base,key:aiSettings.key}:base));}catch{ok=false;}
 try{if(!aiSettings.remember&&aiSettings.key)sessionStorage.setItem(AI_KEY_SESSION,aiSettings.key);else sessionStorage.removeItem(AI_KEY_SESSION);}catch{if(!aiSettings.remember)ok=false;}return ok;}
const aiActive=()=>aiSettings.enabled&&aiValidKey(aiSettings.key)&&aiValidModelId(aiSettings.model);
const assistIsNarrow=()=>matchMedia('(max-width:650px)').matches;
function assistCatalog(){return assistBuildCatalog({parts,groups:GROUPS,learning:LEARNING_RESOURCES,topics:MANUAL_TOPICS,chapters:MANUAL_CHAPTERS,workflows:DOCUMENT_WORKFLOWS});}

function assistUpdateStatus(){const on=aiActive(),el=$('#assist-status');if(el){el.textContent=on?`KI · ${aiSettings.model}`:'Eingebautes Wissen';el.classList.toggle('ai',on);}
 const ind=$('.local-indicator');if(ind){ind.innerHTML=on?'<i class="ai-on"></i> KI-Chat aktiv':'<i></i> Lokal &amp; privat';ind.title=on?'Fragen an den Werkstatt-Assistenten werden an OpenAI gesendet. Alles andere bleibt lokal.':'';}}
function assistScroll(){const log=$('#assist-log');if(log)log.scrollTop=log.scrollHeight;}
function assistAppend(role,html){const log=$('#assist-log'),div=document.createElement('div');div.className=`assist-msg ${role}`;div.innerHTML=html;log.append(div);
 // Lange Antworten ab ihrem Anfang zeigen, kurze und eigene Nachrichten unten anschließen.
 if(role==='bot'&&div.offsetHeight>log.clientHeight*0.8)log.scrollTop=Math.max(0,div.offsetTop-log.offsetTop-12);else assistScroll();return div;}
function assistWelcome(){if(assistChat.started)return;assistChat.started=true;
 assistAppend('bot',`<p><strong>Hallo!</strong> Ich bin dein Werkstatt-Assistent für E36 und E46. Ich erkläre Fehlercodes aus dem Steuergerät (z. B. P0171), helfe bei typischen Problemen wie Radlager oder Überhitzung und springe direkt zur passenden Zeichnung, Anleitung oder zum Video.</p><p class="assist-note">${aiActive()?'KI ist aktiv: Freie Fragen gehen an OpenAI.':'Gerade antworte ich aus dem eingebauten Wissen, ohne Internet. Für freie Fragen die KI unter ⚙ einrichten.'}</p><div class="assist-actions">${ASSIST_SUGGESTIONS.map(([label,q])=>`<button type="button" class="assist-chip assist-chip-ask" data-assist-ask="${E(q)}">${E(label)}</button>`).join('')}</div>`);}
function assistOpen(){const p=$('#assist-panel');p.hidden=false;$('#assist-fab').hidden=true;$('#assist-fab').setAttribute('aria-expanded','true');assistWelcome();assistUpdateStatus();assistScroll();if(!assistIsNarrow())$('#assist-input').focus();else $('#assist-close').focus();}
function assistClose(){$('#assist-panel').hidden=true;const fab=$('#assist-fab');fab.hidden=false;fab.setAttribute('aria-expanded','false');fab.focus({preventScroll:true});}
function assistAutoGrow(){const t=$('#assist-input');t.style.height='';if(!t.value)return;t.style.height='auto';t.style.height=Math.min(t.scrollHeight,120)+'px';}

function assistRenderSettings(){const box=$('#assist-settings'),known=AI_MODELS.some(m=>m.id===aiSettings.model);
 box.innerHTML=`<form id="assist-settings-form" autocomplete="off"><h3>KI-Antworten über OpenAI</h3><p>Ohne Schlüssel antwortet der Assistent nur aus dem eingebauten Wissen und sendet nichts ins Internet.</p>
 <label class="assist-check"><input type="checkbox" name="enabled" ${aiSettings.enabled?'checked':''}> KI-Antworten verwenden</label>
 <label>OpenAI-API-Schlüssel<input type="password" name="key" spellcheck="false" autocapitalize="off" placeholder="${aiSettings.key?'Gespeichert: '+E(aiMaskKey(aiSettings.key))+' · leer lassen = behalten':'sk-…'}"></label>
 <label class="assist-check"><input type="checkbox" name="remember" ${aiSettings.remember?'checked':''}> Auf diesem Gerät merken (sonst nur bis der Tab geschlossen wird)</label>
 <label>Modell<select name="model">${AI_MODELS.map(m=>`<option value="${E(m.id)}" ${m.id===aiSettings.model?'selected':''}>${E(m.label)}</option>`).join('')}<option value="custom" ${known?'':'selected'}>Eigene Modell-ID …</option></select></label>
 <label id="assist-custom-wrap" ${known?'hidden':''}>Eigene Modell-ID<input type="text" name="custom" spellcheck="false" autocapitalize="off" value="${known?'':E(aiSettings.model)}" placeholder="z. B. gpt-6-luna"></label>
 <div class="assist-settings-actions"><button type="submit" class="primary">Speichern</button><button type="button" class="assist-btn" id="assist-test">Verbindung testen</button><button type="button" class="assist-btn" id="assist-forget" ${aiSettings.key?'':'disabled'}>Schlüssel löschen</button><button type="button" class="assist-btn" id="assist-clear">Chat leeren</button></div>
 <p id="assist-settings-msg" class="assist-settings-msg" role="status"></p>
 <details><summary>Was wird gesendet, was kostet es?</summary>
 <p><strong>Gesendet</strong> wird nur bei aktivierter KI und nur, wenn du eine Frage abschickst: die Frage, die letzten Nachrichten dieses Chats, Baureihe, Baugruppe und Bauteil der aktuellen Ansicht, Bauzeit und Motor aus „Bauzustand“ (falls erfasst) und die Liste der Atlas-Verweise. Keine Projektliste, Notizen, Dokumente, Bilder oder Sicherungen. Die Anfrage geht direkt vom Browser an api.openai.com, ohne COLDSTART-Server dazwischen.</p>
 <p><strong>Schlüssel:</strong> Er liegt unverschlüsselt im Browserspeicher dieses Geräts und ist nie Teil der Projekt-Sicherung. Wer dein Browserprofil nutzen kann, kann ihn auslesen. Lokale HTML-Datei, Cloudfassung und andere Geräte brauchen jeweils eine eigene Eingabe.</p>
 <p><strong>Kosten:</strong> Die API wird getrennt vom ChatGPT-Abo nach Verbrauch abgerechnet (Guthaben auf platform.openai.com). Eine typische Frage kostet mit gpt-5-mini grob 0,1–0,5 US-Cent; nach jeder Antwort steht eine Schätzung darunter. Preise laut OpenAI-Preisseite, Stand ${E(AI_PRICE_DATE)}.</p>
 <p><strong>Empfehlung:</strong> Auf platform.openai.com ein eigenes Projekt „COLDSTART“ mit monatlichem Budgetlimit anlegen und dort einen Schlüssel erstellen. Bei Verdacht auf Missbrauch den Schlüssel sofort widerrufen.</p>
 <p><a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">API-Schlüssel bei OpenAI verwalten ↗</a></p>
 <p>KI-Antworten können falsch sein. Sie sind keine Diagnose und keine Reparaturfreigabe.</p></details></form>`;}
function assistToggleSettings(force){assistChat.settingsOpen=typeof force==='boolean'?force:!assistChat.settingsOpen;const box=$('#assist-settings'),btn=$('#assist-settings-toggle');if(assistChat.settingsOpen)assistRenderSettings();box.hidden=!assistChat.settingsOpen;btn.setAttribute('aria-expanded',String(assistChat.settingsOpen));if(assistChat.settingsOpen)box.querySelector('input,select')?.focus();}
function assistSettingsMsg(text,bad=false){const el=$('#assist-settings-msg');if(!el)return;el.textContent=text;el.classList.toggle('bad',bad);}
function assistReadSettingsForm(){const f=$('#assist-settings-form');if(!f)return null;const fd=new FormData(f),key=String(fd.get('key')??'').trim(),choice=String(fd.get('model')??''),model=choice==='custom'?String(fd.get('custom')??'').trim():choice;
 if(key&&!aiValidKey(key))return{error:'Der Schlüssel muss mit „sk-“ beginnen und darf keine Leerzeichen enthalten.'};
 if(!aiValidModelId(model))return{error:'Bitte eine gültige Modell-ID eingeben (Buchstaben, Ziffern, Punkt, Bindestrich).'};
 return{enabled:fd.has('enabled'),remember:fd.has('remember'),model,key};}
function assistApplySettings(v){aiSettings.model=v.model;aiSettings.remember=v.remember;if(v.key)aiSettings.key=v.key;aiSettings.enabled=v.enabled;const ok=aiSaveSettings();assistUpdateStatus();return ok;}

async function aiPost(body){const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),AI_TIMEOUT);
 try{const res=await fetch(AI_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+aiSettings.key},body:JSON.stringify(body),signal:ctrl.signal,credentials:'omit',cache:'no-store',referrerPolicy:'no-referrer'});
  let json=null;try{json=await res.json();}catch{}if(!res.ok){const e=new Error(aiErrorMessage(res.status,json));e.status=res.status;throw e;}return aiParseResponse(json);}
 catch(err){if(err?.name==='AbortError'){const e=new Error('Zeitüberschreitung: OpenAI hat nicht rechtzeitig geantwortet.');e.status='timeout';throw e;}if(err instanceof TypeError){const e=new Error(AI_NETWORK_ERROR);e.status='network';throw e;}throw err;}
 finally{clearTimeout(timer);}}
// Erst mit modellspezifischen Optionen, bei Ablehnung einmal schlicht (nur Modell und Nachrichten).
async function aiAsk(params){try{return await aiPost(aiBuildRequest(params));}catch(err){if(err.status===400||err.status==='network')return await aiPost(aiBuildRequest({...params,bare:true}));throw err;}}

async function assistAsk(raw){const question=String(raw??'').trim().slice(0,AI_MAX_QUESTION);if(!question||assistChat.busy)return;
 assistAppend('user',E(question));const cat=assistCatalog(),local=assistLocalAnswer(question,{model:state.model,catalog:cat}),localHTML=assistRenderBlocks(local);
 const offline=typeof navigator!=='undefined'&&navigator.onLine===false;
 if(!aiActive()||offline){assistAppend('bot',`${localHTML}${assistRenderActions(local.actions)}<p class="assist-note">${offline&&aiActive()?'Offline: Antwort aus dem eingebauten Wissen.':'Eingebautes Wissen'} · keine Diagnose oder Freigabe</p>`);assistChat.history.push({role:'user',content:question},{role:'assistant',content:local.found?`(Eingebautes Nachschlagewerk gezeigt: ${local.summary})`:'(Kein Treffer im eingebauten Wissen.)'});return;}
 assistChat.busy=true;$('#assist-send').disabled=true;const typing=assistAppend('bot assist-typing','<span></span><span></span><span></span><span class="sr-only">Der Assistent schreibt …</span>');
 const p=selectedPart(),system=aiSystemPrompt({model:state.model,groupId:state.group,partId:p?.id,view:state.view,profile:state.profiles[state.model],catalog:cat,local}),model=aiSettings.model;
 try{const res=await aiAsk({model,system,history:assistChat.history,question});typing.remove();const {text,actions}=assistExtractMarkers(res.text,cat);const cost=aiEstimateCost(model,res.usage);if(cost!==null)assistChat.cost+=cost;
  const merged=assistMergeActions(actions,local.actions).slice(0,9);
  assistAppend('bot',`${assistRenderRich(text)}${assistRenderActions(merged)}${local.found?`<details class="assist-details"><summary>Eingebautes Nachschlagewerk anzeigen</summary>${localHTML}</details>`:''}<p class="assist-note">KI-Antwort (${E(res.model||model)}) · kann Fehler enthalten · keine Diagnose${cost!==null?` · ${E(aiFormatCost(cost))}, Chat gesamt ${E(aiFormatCost(assistChat.cost))}`:''}</p>`);
  assistChat.history.push({role:'user',content:question},{role:'assistant',content:res.text});}
 catch(err){typing.remove();assistAppend('bot',`<p class="assist-error">${E(err.message||AI_NETWORK_ERROR)}</p>${localHTML}${assistRenderActions(local.actions)}<p class="assist-note">Antwort aus dem eingebauten Wissen · KI-Einstellungen unter ⚙</p>`);}
 finally{assistChat.busy=false;$('#assist-send').disabled=false;if(!assistIsNarrow())$('#assist-input').focus();}}

function assistNavigate(model,groupId,partId){if(!MODELS[model]||!GROUPS.some(g=>g.id===groupId))return;
 state.model=model;state.group=groupId;state.query='';state.tab='part';state.zoom=1;$('#search').value='';
 const gp=groupParts();state.selected=partId&&gp.some(x=>x.id===partId)?partId:(gp[0]?.id??null);
 let figure=null;if(model==='E36'&&!customDiagram()){const sp=selectedPart();figure=partId?(sp?figureForPart(sp):null):figuresForGroup(model,groupId)[0]||null;}
 state.view=figure?'manual':'exploded';state.manualFigure=figure?figure.id:null;render();save();
 const g=GROUPS.find(x=>x.id===groupId),sp=selectedPart();notify(`${model} · ${g.name}${partId&&sp?' · '+sp.name:''} geöffnet.`);
 if(assistIsNarrow())assistClose();$('#drawing-stage').scrollIntoView({behavior:'smooth',block:'start'});}
function assistOpenView(id){switch(id){
 case 'dokumente':openDocumentLibrary();break;case 'handbuecher':openManualLibrary();break;
 case 'anleitungen':openLearningLibrary({model:state.model,group:'all',kind:'all',query:'',showExcluded:false});break;
 case 'projekt':openProject();break;case 'daten':openData();break;case 'bauzustand':openProfile();break;case 'hilfe':openHelp();break;case 'umfang':openCoverage();break;
 case 'uebersicht':state.view='car';state.zoom=1;renderHeader();renderDrawing();renderDetail();if(assistIsNarrow())assistClose();$('#drawing-stage').scrollIntoView({behavior:'smooth',block:'start'});break;}}

document.addEventListener('click',async ev=>{const t=ev.target.closest('button,a');if(!t)return;
 if(t.id==='assist-fab'){assistOpen();return;}if(t.id==='assist-close'){assistClose();return;}if(t.id==='assist-settings-toggle'){assistToggleSettings();return;}
 if(t.dataset.assistNav){const [m,g,pid]=t.dataset.assistNav.split('|');assistNavigate(m,g,pid||null);return;}
 if(t.dataset.assistView){assistOpenView(t.dataset.assistView);return;}
 if(t.dataset.assistAsk!==undefined){assistAsk(t.dataset.assistAsk);return;}
 if(t.id==='assist-forget'){aiSettings.key='';aiSettings.enabled=false;aiSaveSettings();assistRenderSettings();assistUpdateStatus();assistSettingsMsg('Schlüssel gelöscht. Der Assistent antwortet wieder nur aus dem eingebauten Wissen.');return;}
 if(t.id==='assist-clear'){assistChat.history=[];assistChat.cost=0;assistChat.started=false;$('#assist-log').innerHTML='';assistWelcome();assistSettingsMsg('Chat geleert.');return;}
 if(t.id==='assist-test'){const v=assistReadSettingsForm();if(v?.error){assistSettingsMsg(v.error,true);return;}const key=v.key||aiSettings.key;if(!aiValidKey(key)){assistSettingsMsg('Bitte zuerst einen Schlüssel eingeben.',true);return;}
  t.disabled=true;assistSettingsMsg('Teste Verbindung …');const keep=aiSettings.key;aiSettings.key=key;
  try{const res=await aiAsk({model:v.model,system:'Antworte nur mit dem Wort OK.',history:[],question:'Verbindungstest'});assistSettingsMsg(`Verbindung klappt. Modell ${res.model||v.model} hat geantwortet. Zum Übernehmen „Speichern“ drücken.`);}
  catch(err){assistSettingsMsg(err.message,true);}finally{aiSettings.key=keep;t.disabled=false;}return;}
});
function assistSubmitInput(){const t=$('#assist-input'),q=t.value;if(!q.trim()||assistChat.busy)return;t.value='';assistAutoGrow();assistAsk(q);}
document.addEventListener('submit',ev=>{if(ev.target.id==='assist-form'){ev.preventDefault();assistSubmitInput();return;}
 if(ev.target.id==='assist-settings-form'){ev.preventDefault();const v=assistReadSettingsForm();if(v.error){assistSettingsMsg(v.error,true);return;}if(v.enabled&&!v.key&&!aiSettings.key){assistSettingsMsg('Für KI-Antworten bitte einen API-Schlüssel eingeben.',true);return;}
  const ok=assistApplySettings(v);assistRenderSettings();assistSettingsMsg(ok?(aiActive()?`Gespeichert. KI aktiv mit ${aiSettings.model}.`:'Gespeichert. Der Assistent nutzt nur das eingebaute Wissen.'):'Speichern im Browser nicht möglich. Die Einstellung gilt nur bis zum Neuladen.',!ok);}});
document.addEventListener('change',ev=>{if(ev.target.closest('#assist-settings-form')&&ev.target.name==='model'){const w=$('#assist-custom-wrap');if(w)w.hidden=ev.target.value!=='custom';}});
document.addEventListener('input',ev=>{if(ev.target.id==='assist-input')assistAutoGrow();});
document.addEventListener('keydown',ev=>{if(ev.target.id==='assist-input'&&ev.key==='Enter'&&!ev.shiftKey&&!ev.isComposing){ev.preventDefault();assistSubmitInput();return;}
 if(ev.key==='Escape'&&!$('#assist-panel').hidden&&!$('#modal').open&&$('#assist-panel').contains(document.activeElement)){ev.preventDefault();if(assistChat.settingsOpen)assistToggleSettings(false);else assistClose();}});
aiLoadSettings();assistUpdateStatus();
