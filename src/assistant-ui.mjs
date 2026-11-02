import {escapeHTML,isRecord} from './core.mjs';
import {AI_MODELS,AI_DEFAULT_MODEL,AI_ENDPOINT,AI_PRICE_DATE,ASSIST_SUGGESTIONS,WEBLLM_LIB,BROWSER_MODELS,BROWSER_DEFAULT_MODEL,ASSIST_PROVIDERS} from './assistant-data.mjs';
import {assistBuildCatalog,assistLocalAnswer,assistRenderBlocks,assistRenderActions,assistRenderRich,assistExtractMarkers,assistMergeActions,aiSystemPrompt,aiBuildRequest,aiParseResponse,aiErrorMessage,AI_NETWORK_ERROR,aiEstimateCost,aiFormatCost,aiValidKey,aiValidModelId,aiMaskKey,AI_MAX_QUESTION,browserModelInfo,browserVariant,aiFormatMB,aiCompactPrompt,aiCompactMessages,assistStripMarkersLive} from './assistant-core.mjs';

// Werkstatt-Assistent: Chatfenster, Einstellungen und drei Antwortquellen.
// local = eingebautes Wissen · browser = kostenlose Open-Source-KI per WebLLM auf dem Gerät · openai = OpenAI-API mit eigenem Schlüssel.
// Läuft nach app.mjs im selben Bündel und nutzt dessen Zustand (state, parts, render, save, notify, modal-Öffner).
const AI_STORE='coldstart-assistant-v1',AI_KEY_SESSION='coldstart-assistant-key',AI_TIMEOUT=60000;
const aiSettings={provider:'local',model:AI_DEFAULT_MODEL,browserModel:BROWSER_DEFAULT_MODEL,remember:true,key:''};
const assistChat={history:[],busy:false,cost:0,started:false,settingsOpen:false,stop:null,abortCtrl:null,pending:null};
const webllm={mod:null,engine:null,modelId:null,loading:null,gpu:null,progress:null};
const WEBGPU_MISSING='Dieser Browser bietet kein WebGPU. Die kostenlose KI im Browser braucht ein aktuelles Chrome oder Edge am PC oder Safari ab Version 26. Bis dahin antworte ich aus dem eingebauten Wissen.';
const assistIsNarrow=()=>matchMedia('(max-width:650px)').matches;

function aiLoadSettings(){let stored={};try{stored=JSON.parse(localStorage.getItem(AI_STORE)||'{}');if(!isRecord(stored))stored={};}catch{stored={};}
 if(Object.hasOwn(ASSIST_PROVIDERS,stored.provider))aiSettings.provider=stored.provider;else if(stored.enabled===true)aiSettings.provider='openai';
 if(aiValidModelId(stored.model))aiSettings.model=stored.model;
 if(browserModelInfo(stored.browserModel))aiSettings.browserModel=stored.browserModel;else if(assistIsNarrow())aiSettings.browserModel='qwen-0.5b';
 if(typeof stored.remember==='boolean')aiSettings.remember=stored.remember;if(aiValidKey(stored.key))aiSettings.key=stored.key;
 if(!aiSettings.key){try{const k=sessionStorage.getItem(AI_KEY_SESSION);if(aiValidKey(k))aiSettings.key=k;}catch{}}}
function aiSaveSettings(){let ok=true;const base={provider:aiSettings.provider,model:aiSettings.model,browserModel:aiSettings.browserModel,remember:aiSettings.remember};
 try{localStorage.setItem(AI_STORE,JSON.stringify(aiSettings.remember&&aiSettings.key?{...base,key:aiSettings.key}:base));}catch{ok=false;}
 try{if(!aiSettings.remember&&aiSettings.key)sessionStorage.setItem(AI_KEY_SESSION,aiSettings.key);else sessionStorage.removeItem(AI_KEY_SESSION);}catch{if(!aiSettings.remember)ok=false;}return ok;}
function assistMode(){if(aiSettings.provider==='openai'&&aiValidKey(aiSettings.key)&&aiValidModelId(aiSettings.model))return 'openai';return aiSettings.provider==='browser'?'browser':'local';}
const browserShort=()=>(browserModelInfo(aiSettings.browserModel)?.label||'').split(' · ')[0];
function assistCatalog(){return assistBuildCatalog({parts,groups:GROUPS,learning:LEARNING_RESOURCES,topics:MANUAL_TOPICS,chapters:MANUAL_CHAPTERS,workflows:DOCUMENT_WORKFLOWS});}

function assistUpdateStatus(){const mode=assistMode(),el=$('#assist-status');if(el){el.textContent=mode==='openai'?`KI · ${aiSettings.model}`:mode==='browser'?'KI im Browser':'Eingebautes Wissen';el.title=mode==='browser'?`Kostenlose KI im Browser: ${browserShort()}`:mode==='openai'?`OpenAI: ${aiSettings.model}`:'';el.classList.toggle('ai',mode==='openai');el.classList.toggle('free',mode==='browser');}
 const ind=$('.local-indicator');if(ind){ind.innerHTML=mode==='openai'?'<i class="ai-on"></i> KI-Chat aktiv':'<i></i> Lokal &amp; privat';ind.title=mode==='openai'?'Fragen an den Werkstatt-Assistenten werden an OpenAI gesendet. Alles andere bleibt lokal.':mode==='browser'?'Der Werkstatt-Assistent nutzt ein KI-Modell direkt im Browser. Fragen verlassen das Gerät nicht.':'';}}
function assistScroll(){const log=$('#assist-log');if(log)log.scrollTop=log.scrollHeight;}
function assistAppend(role,html){const log=$('#assist-log'),div=document.createElement('div');div.className=`assist-msg ${role}`;div.innerHTML=html;log.append(div);
 // Lange Antworten ab ihrem Anfang zeigen, kurze und eigene Nachrichten unten anschließen.
 if(role==='bot'&&div.offsetHeight>log.clientHeight*0.8)log.scrollTop=Math.max(0,div.offsetTop-log.offsetTop-12);else assistScroll();return div;}
function assistFollow(div){const log=$('#assist-log');if(div.offsetHeight<log.clientHeight*0.8)assistScroll();}
function assistWelcomeNote(){const mode=assistMode();return mode==='openai'?'KI über OpenAI ist aktiv: Freie Fragen gehen an OpenAI.':mode==='browser'?`Kostenlose KI im Browser ist aktiv (${E(browserShort())}). Deine Fragen bleiben auf diesem Gerät.`:'Gerade antworte ich aus dem eingebauten Wissen, ohne Internet. Unter ⚙ kannst du eine kostenlose KI im Browser einschalten.';}
function assistWelcome(){if(assistChat.started)return;assistChat.started=true;
 assistAppend('bot',`<p><strong>Hallo!</strong> Ich bin dein Werkstatt-Assistent für E36 und E46. Ich erkläre Fehlercodes aus dem Steuergerät (z. B. P0171), helfe bei typischen Problemen wie Radlager oder Überhitzung und springe direkt zur passenden Zeichnung, Anleitung oder zum Video.</p><p class="assist-note">${assistWelcomeNote()}</p><div class="assist-actions">${ASSIST_SUGGESTIONS.map(([label,q])=>`<button type="button" class="assist-chip assist-chip-ask" data-assist-ask="${E(q)}">${E(label)}</button>`).join('')}</div>`);}
function assistOpen(){const p=$('#assist-panel');p.hidden=false;$('#assist-fab').hidden=true;$('#assist-fab').setAttribute('aria-expanded','true');assistWelcome();assistUpdateStatus();assistScroll();if(!assistIsNarrow())$('#assist-input').focus();else $('#assist-close').focus();}
function assistClose(){$('#assist-panel').hidden=true;const fab=$('#assist-fab');fab.hidden=false;fab.setAttribute('aria-expanded','false');fab.focus({preventScroll:true});}
function assistAutoGrow(){const t=$('#assist-input');t.style.height='';if(!t.value)return;t.style.height='auto';t.style.height=Math.min(t.scrollHeight,120)+'px';}
function assistSetBusy(on,stop=null){assistChat.busy=on;assistChat.stop=on?stop:null;const b=$('#assist-send');b.disabled=on&&!stop;b.textContent=on&&stop?'■':'↑';b.setAttribute('aria-label',on&&stop?'Antwort stoppen':'Frage senden');b.classList.toggle('assist-stop',Boolean(on&&stop));}

// ---- KI im Browser (WebLLM)
async function webgpuInfo(){if(webllm.gpu)return webllm.gpu;let r={ok:false,f16:false};try{if(navigator.gpu){const a=await navigator.gpu.requestAdapter();if(a)r={ok:true,f16:a.features.has('shader-f16')};}}catch{}webllm.gpu=r;return r;}
async function webllmLib(){if(webllm.mod)return webllm.mod;
 let buf;try{const res=await fetch(WEBLLM_LIB.url,{credentials:'omit',referrerPolicy:'no-referrer'});if(!res.ok)throw new Error(String(res.status));buf=await res.arrayBuffer();}catch{throw new Error('Die WebLLM-Bibliothek konnte nicht geladen werden. Internetverbindung prüfen (cdn.jsdelivr.net).');}
 const hex=[...new Uint8Array(await crypto.subtle.digest('SHA-256',buf))].map(b=>b.toString(16).padStart(2,'0')).join('');
 if(hex!==WEBLLM_LIB.sha256)throw new Error('Die Prüfsumme der geladenen WebLLM-Bibliothek stimmt nicht mit dem geprüften npm-Paket überein. Aus Sicherheitsgründen wurde sie nicht ausgeführt.');
 const url=URL.createObjectURL(new Blob([buf],{type:'text/javascript'}));try{webllm.mod=await import(url);}finally{URL.revokeObjectURL(url);}return webllm.mod;}
const webllmConfig=lib=>({...lib.prebuiltAppConfig,cacheBackend:'indexeddb'});
async function webllmTargetId(){const g=await webgpuInfo();if(!g.ok)throw new Error(WEBGPU_MISSING);return browserVariant(aiSettings.browserModel,g.f16);}
function webllmErrorText(err){const m=String(err?.message||err||'');
 if(m===WEBGPU_MISSING||/Prüfsumme|WebLLM-Bibliothek/.test(m))return m;
 if(/out of memory|OOM|device (?:was )?lost|maxBufferSize|maxStorageBuffer|allocate/i.test(m))return 'Das Modell passt nicht in den Grafikspeicher dieses Geräts. Bitte unter ⚙ ein kleineres Modell wählen.';
 if(/quota/i.test(m))return 'Im Browser ist nicht genug Speicherplatz für das Modell frei.';
 if(/fetch|network|load failed|NetworkError|status/i.test(m))return 'Der Download ist fehlgeschlagen. Internetverbindung prüfen; huggingface.co und raw.githubusercontent.com müssen erreichbar sein.';
 if(/webgpu|gpu/i.test(m))return WEBGPU_MISSING;
 return 'Die KI im Browser konnte nicht starten: '+m.slice(0,160);}
async function webllmIsCached(){const lib=await webllmLib(),id=await webllmTargetId();try{return await lib.hasModelInCache(id,webllmConfig(lib));}catch{return false;}}
async function webllmLoad(onProgress){const id=await webllmTargetId();if(webllm.engine&&webllm.modelId===id)return webllm.engine;if(webllm.loading)return webllm.loading;
 webllm.loading=(async()=>{const lib=await webllmLib();if(webllm.engine){try{await webllm.engine.unload();}catch{}webllm.engine=null;webllm.modelId=null;}
  const engine=await lib.CreateMLCEngine(id,{appConfig:webllmConfig(lib),logLevel:'WARN',initProgressCallback:r=>{webllm.progress=r;onProgress?.(r);assistShowProgress();}});webllm.engine=engine;webllm.modelId=id;return engine;})();
 try{return await webllm.loading;}catch(err){throw new Error(webllmErrorText(err));}finally{webllm.loading=null;webllm.progress=null;assistShowProgress();}}
const webllmPercent=r=>Math.max(0,Math.min(100,Math.round((Number(r?.progress)||0)*100)));
function assistShowProgress(){const box=$('#assist-progress');if(!box)return;const r=webllm.progress;box.hidden=!r;if(r){box.querySelector('progress').value=Number(r.progress)||0;box.querySelector('span').textContent=`Modell wird geladen … ${webllmPercent(r)} %`;}}
async function assistCheckGPU(){const el=$('#assist-gpu-status');if(!el)return;const g=await webgpuInfo();if(!$('#assist-gpu-status'))return;
 el.textContent=g.ok?`WebGPU verfügbar${g.f16?'':' (ohne 16-Bit-Unterstützung, es wird die etwas größere 32-Bit-Fassung genutzt)'}.${webllm.engine?' Modell ist geladen.':''}`:WEBGPU_MISSING;el.classList.toggle('bad',!g.ok);}
async function webllmAnswer(messages,onText){const engine=await webllmLoad();let text='';
 const stream=await engine.chat.completions.create({messages,stream:true,max_tokens:600,temperature:0.3});
 for await(const chunk of stream){const d=chunk?.choices?.[0]?.delta?.content;if(d){text+=d;onText(text);}}return text.trim();}

// ---- OpenAI
async function aiPost(body){const ctrl=new AbortController();let timedOut=false;const timer=setTimeout(()=>{timedOut=true;ctrl.abort();},AI_TIMEOUT);assistChat.abortCtrl=ctrl;
 try{const res=await fetch(AI_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+aiSettings.key},body:JSON.stringify(body),signal:ctrl.signal,credentials:'omit',cache:'no-store',referrerPolicy:'no-referrer'});
  let json=null;try{json=await res.json();}catch{}if(!res.ok){const e=new Error(aiErrorMessage(res.status,json));e.status=res.status;throw e;}return aiParseResponse(json);}
 catch(err){if(err?.name==='AbortError'){const e=new Error(timedOut?'Zeitüberschreitung: OpenAI hat nicht rechtzeitig geantwortet.':'Abgebrochen.');e.status=timedOut?'timeout':'aborted';throw e;}if(err instanceof TypeError){const e=new Error(AI_NETWORK_ERROR);e.status='network';throw e;}throw err;}
 finally{clearTimeout(timer);assistChat.abortCtrl=null;}}
// Erst mit modellspezifischen Optionen, bei Ablehnung einmal schlicht (nur Modell und Nachrichten).
async function aiAsk(params){try{return await aiPost(aiBuildRequest(params));}catch(err){if(err.status===400||err.status==='network')return await aiPost(aiBuildRequest({...params,bare:true}));throw err;}}

// ---- Antworten
function assistLocalReply(question,local,localHTML,note){assistAppend('bot',`${localHTML}${assistRenderActions(local.actions)}<p class="assist-note">${note}</p>`);assistChat.history.push({role:'user',content:question},{role:'assistant',content:local.found?`(Eingebautes Nachschlagewerk gezeigt: ${local.summary})`:'(Kein Treffer im eingebauten Wissen.)'});}
async function assistAsk(raw){const question=String(raw??'').trim().slice(0,AI_MAX_QUESTION);if(!question||assistChat.busy)return;assistAppend('user',E(question));await assistRespond(question);}
async function assistRespond(question){const cat=assistCatalog(),local=assistLocalAnswer(question,{model:state.model,catalog:cat}),localHTML=assistRenderBlocks(local),mode=assistMode(),offline=navigator.onLine===false;
 if(mode==='local'){assistLocalReply(question,local,localHTML,'Eingebautes Wissen · keine Diagnose oder Freigabe');return;}
 if(mode==='browser'){await assistRespondBrowser(question,cat,local,localHTML);return;}
 if(offline){assistLocalReply(question,local,localHTML,'Offline: Antwort aus dem eingebauten Wissen.');return;}
 assistSetBusy(true,()=>assistChat.abortCtrl?.abort());const typing=assistAppend('bot assist-typing','<span></span><span></span><span></span><span class="sr-only">Der Assistent schreibt …</span>');
 const p=selectedPart(),system=aiSystemPrompt({model:state.model,groupId:state.group,partId:p?.id,view:state.view,profile:state.profiles[state.model],catalog:cat,local}),model=aiSettings.model;
 try{const res=await aiAsk({model,system,history:assistChat.history,question});typing.remove();const {text,actions}=assistExtractMarkers(res.text,cat);const cost=aiEstimateCost(model,res.usage);if(cost!==null)assistChat.cost+=cost;
  assistAppend('bot',`${assistRenderRich(text)}${assistRenderActions(assistMergeActions(actions,local.actions).slice(0,9))}${local.found?`<details class="assist-details"><summary>Eingebautes Nachschlagewerk anzeigen</summary>${localHTML}</details>`:''}<p class="assist-note">KI-Antwort (${E(res.model||model)}) · kann Fehler enthalten · keine Diagnose${cost!==null?` · ${E(aiFormatCost(cost))}, Chat gesamt ${E(aiFormatCost(assistChat.cost))}`:''}</p>`);
  assistChat.history.push({role:'user',content:question},{role:'assistant',content:res.text});}
 catch(err){typing.remove();assistAppend('bot',`<p class="assist-error">${E(err.message||AI_NETWORK_ERROR)}</p>${localHTML}${assistRenderActions(local.actions)}<p class="assist-note">Antwort aus dem eingebauten Wissen · Einstellungen unter ⚙</p>`);}
 finally{assistSetBusy(false);if(!assistIsNarrow())$('#assist-input').focus();}}
async function assistRespondBrowser(question,cat,local,localHTML){const m=browserModelInfo(aiSettings.browserModel);
 const g=await webgpuInfo();if(!g.ok){assistLocalReply(question,local,localHTML,E(WEBGPU_MISSING));return;}
 if(!(webllm.engine&&webllm.modelId===browserVariant(aiSettings.browserModel,g.f16))){let cached=false,libError=null;try{cached=await webllmIsCached();}catch(err){libError=err;}
  if(libError){assistAppend('bot',`<p class="assist-error">${E(webllmErrorText(libError))}</p>${localHTML}${assistRenderActions(local.actions)}<p class="assist-note">Antwort aus dem eingebauten Wissen</p>`);return;}
  if(!cached){assistChat.pending=question;assistAppend('bot',`${localHTML}${assistRenderActions(local.actions)}<div class="assist-card assist-consent"><p><strong>Kostenlose KI im Browser einrichten</strong></p><p>Das Modell ${E(m.label.split(' · ')[0])} ist noch nicht auf diesem Gerät. Einmaliger Download von etwa ${E(aiFormatMB(m.downloadMB))} (Lizenz ${E(m.license)}), danach läuft es ohne Internet. Auf dem Handy am besten im WLAN.</p><button type="button" class="primary" data-assist-webllm-load>Jetzt laden (${E(aiFormatMB(m.downloadMB))})</button></div><p class="assist-note">Bis dahin: Antwort aus dem eingebauten Wissen</p>`);assistChat.history.push({role:'user',content:question},{role:'assistant',content:local.found?`(Eingebautes Nachschlagewerk gezeigt: ${local.summary})`:'(Kein Treffer im eingebauten Wissen.)'});return;}}
 await assistGenerateBrowser(question,cat,local,localHTML);}
async function assistGenerateBrowser(question,cat,local,localHTML){const m=browserModelInfo(aiSettings.browserModel);let stopped=false;
 assistSetBusy(true,()=>{stopped=true;webllm.engine?.interruptGenerate();});const bubble=assistAppend('bot assist-live','<p class="assist-loading">KI im Browser startet …</p>');
 try{await webllmLoad(r=>{const el=bubble.querySelector('.assist-loading');if(el)el.textContent=`Modell wird aus dem Speicher geladen … ${webllmPercent(r)} %`;});
  const p=selectedPart(),system=aiCompactPrompt({model:state.model,groupId:state.group,partId:p?.id,view:state.view,profile:state.profiles[state.model],catalog:cat,local});
  bubble.innerHTML='<p class="assist-loading">Denkt nach …</p>';let last=0;
  const raw=await webllmAnswer(aiCompactMessages({system,history:assistChat.history,question}),t=>{const now=performance.now();if(now-last<90)return;last=now;bubble.innerHTML=assistRenderRich(assistStripMarkersLive(t))||'<p class="assist-loading">Denkt nach …</p>';assistFollow(bubble);});
  const {text,actions}=assistExtractMarkers(raw,cat);bubble.className='assist-msg bot';
  bubble.innerHTML=`${assistRenderRich(text)||'<p>(Keine Antwort erzeugt.)</p>'}${assistRenderActions(assistMergeActions(local.actions,actions).slice(0,9))}${local.found?`<details class="assist-details"><summary>Eingebautes Nachschlagewerk anzeigen</summary>${localHTML}</details>`:''}<p class="assist-note">KI im Browser (${E(m.label.split(' · ')[0])}) · kostenlos, läuft auf deinem Gerät · kleines Modell, kann Fehler enthalten · keine Diagnose${stopped?' · gestoppt':''}</p>`;assistFollow(bubble);
  assistChat.history.push({role:'user',content:question},{role:'assistant',content:raw});}
 catch(err){bubble.remove();assistAppend('bot',`<p class="assist-error">${E(webllmErrorText(err))}</p>${localHTML}${assistRenderActions(local.actions)}<p class="assist-note">Antwort aus dem eingebauten Wissen · Einstellungen unter ⚙</p>`);}
 finally{assistSetBusy(false);if(!assistIsNarrow())$('#assist-input').focus();}}
async function assistLoadFromChat(btn){if(assistChat.busy)return;btn.disabled=true;assistSetBusy(true);const m=browserModelInfo(aiSettings.browserModel);const box=assistAppend('bot assist-live',`<p class="assist-loading">Lade ${E(m.label.split(' · ')[0])} … 0 %</p><progress max="1" value="0" aria-label="Download des Modells"></progress>`);
 try{await webllmLoad(r=>{box.querySelector('.assist-loading').textContent=`Lade ${m.label.split(' · ')[0]} … ${webllmPercent(r)} %`;box.querySelector('progress').value=Number(r.progress)||0;});
  box.className='assist-msg bot';box.innerHTML=`<p><strong>Fertig.</strong> Die kostenlose KI läuft jetzt auf diesem Gerät und bleibt im Browser gespeichert.</p>`;btn.closest('.assist-consent')?.remove();
  assistSetBusy(false);const q=assistChat.pending;assistChat.pending=null;
  // Die zurückgestellte Frage jetzt mit der KI beantworten; ihr vorläufiger Verlaufseintrag wird ersetzt.
  if(q){assistChat.history.splice(-2,2);const cat=assistCatalog(),local=assistLocalAnswer(q,{model:state.model,catalog:cat});await assistGenerateBrowser(q,cat,local,assistRenderBlocks(local));}}
 catch(err){box.className='assist-msg bot';box.innerHTML=`<p class="assist-error">${E(webllmErrorText(err))}</p>`;btn.disabled=false;}
 finally{assistSetBusy(false);}}

// ---- Einstellungen
function assistRenderSettings(){const box=$('#assist-settings'),known=AI_MODELS.some(m=>m.id===aiSettings.model),p=aiSettings.provider,bm=browserModelInfo(aiSettings.browserModel);
 const providers=[['local','Eingebautes Wissen','Kostenlos und offline. Fehlercodes und Themen aus dem Atlas, nichts wird gesendet.'],['browser','KI im Browser · kostenlos','Open-Source-Modell läuft mit WebLLM direkt auf deinem Gerät. Einmaliger Download, danach privat und offline. Braucht WebGPU.'],['openai','OpenAI · kostenpflichtig','Beste Antworten. Eigener API-Schlüssel, Abrechnung nach Verbrauch.']];
 box.innerHTML=`<form id="assist-settings-form" autocomplete="off"><h3>Wer antwortet?</h3>
 <fieldset class="assist-providers"><legend class="sr-only">Antwortquelle des Assistenten</legend>${providers.map(([v,t,d])=>`<label class="assist-provider"><input type="radio" name="provider" value="${v}" ${p===v?'checked':''}><span><strong>${t}</strong><small>${d}</small></span></label>`).join('')}</fieldset>
 <div id="assist-opts-browser" class="assist-opts" ${p==='browser'?'':'hidden'}>
 <label>Modell<select name="browserModel">${BROWSER_MODELS.map(m=>`<option value="${E(m.id)}" ${m.id===aiSettings.browserModel?'selected':''}>${E(m.label)} · ${E(aiFormatMB(m.downloadMB))}</option>`).join('')}</select></label>
 <p class="assist-hint" id="assist-browser-hint">${E(assistBrowserHint(bm))}</p><p class="assist-hint" id="assist-gpu-status" role="status">WebGPU wird geprüft …</p>
 <div class="assist-progress" id="assist-progress" hidden><progress max="1" value="0" aria-label="Download des Modells"></progress><span></span></div>
 <div class="assist-settings-actions"><button type="button" class="assist-btn" id="assist-browser-load">Modell jetzt laden</button><button type="button" class="assist-btn" id="assist-browser-delete">Modell vom Gerät löschen</button></div></div>
 <div id="assist-opts-openai" class="assist-opts" ${p==='openai'?'':'hidden'}>
 <label>OpenAI-API-Schlüssel<input type="password" name="key" spellcheck="false" autocapitalize="off" placeholder="${aiSettings.key?'Gespeichert: '+E(aiMaskKey(aiSettings.key))+' · leer lassen = behalten':'sk-…'}"></label>
 <label class="assist-check"><input type="checkbox" name="remember" ${aiSettings.remember?'checked':''}> Auf diesem Gerät merken (sonst nur bis der Tab geschlossen wird)</label>
 <label>Modell<select name="model">${AI_MODELS.map(m=>`<option value="${E(m.id)}" ${m.id===aiSettings.model?'selected':''}>${E(m.label)}</option>`).join('')}<option value="custom" ${known?'':'selected'}>Eigene Modell-ID …</option></select></label>
 <label id="assist-custom-wrap" ${known?'hidden':''}>Eigene Modell-ID<input type="text" name="custom" spellcheck="false" autocapitalize="off" value="${known?'':E(aiSettings.model)}" placeholder="z. B. gpt-6-luna"></label>
 <div class="assist-settings-actions"><button type="button" class="assist-btn" id="assist-test">Verbindung testen</button><button type="button" class="assist-btn" id="assist-forget" ${aiSettings.key?'':'disabled'}>Schlüssel löschen</button></div></div>
 <div class="assist-settings-actions"><button type="submit" class="primary">Speichern</button><button type="button" class="assist-btn" id="assist-clear">Chat leeren</button></div>
 <p id="assist-settings-msg" class="assist-settings-msg" role="status"></p>
 <details><summary>Datenschutz, Kosten und Quellen</summary>
 <p><strong>Eingebautes Wissen:</strong> läuft vollständig im Browser, es wird nichts gesendet.</p>
 <p><strong>KI im Browser:</strong> kostenlos und ohne Konto. Die Open-Source-Bibliothek <a href="https://github.com/mlc-ai/web-llm" target="_blank" rel="noopener noreferrer">WebLLM</a> (Apache-2.0, Version ${E(WEBLLM_LIB.version)}) wird bei Bedarf von cdn.jsdelivr.net geladen und nur ausgeführt, wenn ihre Prüfsumme zum geprüften npm-Paket passt. Das Modell kommt von huggingface.co und raw.githubusercontent.com und bleibt danach im Browser gespeichert. Deine Fragen verlassen das Gerät nicht. Kleine Modelle irren sich häufiger; die Antworten stützen sich deshalb auf das eingebaute Wissen. Braucht ein Gerät mit WebGPU und ausreichend Grafikspeicher; auf älteren Handys kann der Tab abstürzen.</p>
 <p><strong>OpenAI:</strong> Gesendet werden nur beim Absenden einer Frage: die Frage, die letzten Nachrichten, Baureihe, Baugruppe und Bauteil der aktuellen Ansicht, Bauzeit und Motor aus „Bauzustand“ (falls erfasst) und die Liste der Atlas-Verweise. Keine Projektliste, Notizen, Dokumente, Bilder oder Sicherungen. Die API wird getrennt vom ChatGPT-Abo nach Verbrauch abgerechnet; mit gpt-5-mini grob 0,1–0,5 US-Cent pro Frage (Preise laut OpenAI, Stand ${E(AI_PRICE_DATE)}). Der Schlüssel liegt unverschlüsselt im Browserspeicher dieses Geräts und ist nie Teil der Projekt-Sicherung. <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">API-Schlüssel verwalten ↗</a></p>
 <p>KI-Antworten können falsch sein. Sie sind keine Diagnose und keine Reparaturfreigabe.</p></details></form>`;
 assistCheckGPU();assistShowProgress();}
function assistBrowserHint(m){return m?`Download einmalig etwa ${aiFormatMB(m.downloadMB)}, braucht rund ${aiFormatMB(m.vramMB)} Grafikspeicher. Lizenz: ${m.license}. Auf dem Handy WLAN nutzen.`:'';}
function assistToggleSettings(force){assistChat.settingsOpen=typeof force==='boolean'?force:!assistChat.settingsOpen;const box=$('#assist-settings'),btn=$('#assist-settings-toggle');if(assistChat.settingsOpen)assistRenderSettings();box.hidden=!assistChat.settingsOpen;btn.setAttribute('aria-expanded',String(assistChat.settingsOpen));if(assistChat.settingsOpen)box.querySelector('input:checked,input,select')?.focus();}
function assistSettingsMsg(text,bad=false){const el=$('#assist-settings-msg');if(!el)return;el.textContent=text;el.classList.toggle('bad',bad);}
function assistReadSettingsForm(){const f=$('#assist-settings-form');if(!f)return null;const fd=new FormData(f),provider=String(fd.get('provider')??'local'),key=String(fd.get('key')??'').trim(),choice=String(fd.get('model')??''),model=choice==='custom'?String(fd.get('custom')??'').trim():choice,browserModel=String(fd.get('browserModel')??'');
 if(!Object.hasOwn(ASSIST_PROVIDERS,provider)||!browserModelInfo(browserModel))return{error:'Ungültige Auswahl.'};
 if(key&&!aiValidKey(key))return{error:'Der Schlüssel muss mit „sk-“ beginnen und darf keine Leerzeichen enthalten.'};
 if(!aiValidModelId(model))return{error:'Bitte eine gültige Modell-ID eingeben (Buchstaben, Ziffern, Punkt, Bindestrich).'};
 return{provider,remember:fd.has('remember'),model,key,browserModel};}
function assistApplySettings(v){aiSettings.provider=v.provider;aiSettings.model=v.model;aiSettings.browserModel=v.browserModel;aiSettings.remember=v.remember;if(v.key)aiSettings.key=v.key;const ok=aiSaveSettings();assistUpdateStatus();return ok;}
async function assistSettingsLoad(btn){const v=assistReadSettingsForm();if(v?.error){assistSettingsMsg(v.error,true);return;}if(assistChat.busy){assistSettingsMsg('Bitte warten, bis die laufende Antwort fertig ist.',true);return;}
 aiSettings.browserModel=v.browserModel;btn.disabled=true;assistSetBusy(true);assistSettingsMsg('Lade Modell …');
 try{await webllmLoad();aiSettings.provider='browser';aiSaveSettings();assistUpdateStatus();assistRenderSettings();assistSettingsMsg('Fertig. Die kostenlose KI im Browser ist aktiv und gespeichert.');}
 catch(err){assistSettingsMsg(webllmErrorText(err),true);}finally{btn.disabled=false;assistSetBusy(false);}}
async function assistSettingsDelete(btn){const v=assistReadSettingsForm();if(v?.error){assistSettingsMsg(v.error,true);return;}btn.disabled=true;
 try{const lib=await webllmLib(),m=browserModelInfo(v.browserModel);for(const id of [m.f16,m.f32]){if(webllm.engine&&webllm.modelId===id){await webllm.engine.unload();webllm.engine=null;webllm.modelId=null;}await lib.deleteModelAllInfoInCache(id,webllmConfig(lib));}assistSettingsMsg(`${m.label.split(' · ')[0]} wurde vom Gerät gelöscht.`);}
 catch(err){assistSettingsMsg(webllmErrorText(err),true);}finally{btn.disabled=false;}}

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
 if(t.hasAttribute('data-assist-webllm-load')){await assistLoadFromChat(t);return;}
 if(t.id==='assist-browser-load'){await assistSettingsLoad(t);return;}
 if(t.id==='assist-browser-delete'){await assistSettingsDelete(t);return;}
 if(t.id==='assist-forget'){aiSettings.key='';if(aiSettings.provider==='openai')aiSettings.provider='local';aiSaveSettings();assistRenderSettings();assistUpdateStatus();assistSettingsMsg('Schlüssel gelöscht.');return;}
 if(t.id==='assist-clear'){if(assistChat.busy)return;assistChat.history=[];assistChat.cost=0;assistChat.started=false;assistChat.pending=null;$('#assist-log').innerHTML='';assistWelcome();assistSettingsMsg('Chat geleert.');return;}
 if(t.id==='assist-test'){const v=assistReadSettingsForm();if(v?.error){assistSettingsMsg(v.error,true);return;}const key=v.key||aiSettings.key;if(!aiValidKey(key)){assistSettingsMsg('Bitte zuerst einen Schlüssel eingeben.',true);return;}
  t.disabled=true;assistSettingsMsg('Teste Verbindung …');const keep=aiSettings.key;aiSettings.key=key;
  try{const res=await aiAsk({model:v.model,system:'Antworte nur mit dem Wort OK.',history:[],question:'Verbindungstest'});assistSettingsMsg(`Verbindung klappt. Modell ${res.model||v.model} hat geantwortet. Zum Übernehmen „Speichern“ drücken.`);}
  catch(err){assistSettingsMsg(err.message,true);}finally{aiSettings.key=keep;t.disabled=false;}return;}
});
function assistSubmitInput(){if(assistChat.busy){assistChat.stop?.();return;}const t=$('#assist-input'),q=t.value;if(!q.trim())return;t.value='';assistAutoGrow();assistAsk(q);}
document.addEventListener('submit',ev=>{if(ev.target.id==='assist-form'){ev.preventDefault();assistSubmitInput();return;}
 if(ev.target.id==='assist-settings-form'){ev.preventDefault();const v=assistReadSettingsForm();if(v.error){assistSettingsMsg(v.error,true);return;}if(v.provider==='openai'&&!v.key&&!aiSettings.key){assistSettingsMsg('Für OpenAI bitte einen API-Schlüssel eingeben.',true);return;}
  const ok=assistApplySettings(v);assistRenderSettings();const mode=assistMode();
  assistSettingsMsg(!ok?'Speichern im Browser nicht möglich. Die Einstellung gilt nur bis zum Neuladen.':mode==='openai'?`Gespeichert. KI aktiv mit ${aiSettings.model}.`:mode==='browser'?`Gespeichert. Kostenlose KI im Browser mit ${browserShort()}. Das Modell lädt bei der ersten Frage nach Rückfrage.`:'Gespeichert. Der Assistent nutzt nur das eingebaute Wissen.',!ok);}});
document.addEventListener('change',ev=>{const f=ev.target.closest('#assist-settings-form');if(!f)return;
 if(ev.target.name==='model'){const w=$('#assist-custom-wrap');if(w)w.hidden=ev.target.value!=='custom';}
 if(ev.target.name==='provider'){$('#assist-opts-browser').hidden=ev.target.value!=='browser';$('#assist-opts-openai').hidden=ev.target.value!=='openai';}
 if(ev.target.name==='browserModel'){$('#assist-browser-hint').textContent=assistBrowserHint(browserModelInfo(ev.target.value));}});
document.addEventListener('input',ev=>{if(ev.target.id==='assist-input')assistAutoGrow();});
document.addEventListener('keydown',ev=>{if(ev.target.id==='assist-input'&&ev.key==='Enter'&&!ev.shiftKey&&!ev.isComposing){ev.preventDefault();assistSubmitInput();return;}
 if(ev.key==='Escape'&&!$('#assist-panel').hidden&&!$('#modal').open&&$('#assist-panel').contains(document.activeElement)){ev.preventDefault();if(assistChat.settingsOpen)assistToggleSettings(false);else assistClose();}});
aiLoadSettings();assistUpdateStatus();
