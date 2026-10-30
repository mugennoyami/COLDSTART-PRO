// Prüft die externen Verweise aus den Daten. Braucht Netzwerk, gehört nicht zu den automatischen Tests.
// Aufruf: node scripts/check-links.mjs   (beendet sich mit 1, sobald ein Link nachweislich tot ist)
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {SOURCES} from '../src/data.mjs';
import {LEARNING_RESOURCES} from '../src/learning-data.mjs';
const FIXED_LINKS=[...readFileSync(new URL('../src/documents-ui.mjs',import.meta.url),'utf8').matchAll(/href="(https:[^"]+)"/g)].map(m=>m[1]);
export const collectUrls=()=>[...new Set([...SOURCES.map(s=>s.url),...LEARNING_RESOURCES.map(r=>r.url),...FIXED_LINKS])];
// Shops und Portale sperren oft Skripte (403/429) oder antworten Skripten mit 503. Das gilt als „nicht prüfbar“ beziehungsweise „bitte ansehen“. Nachweislich tot sind nur 404 und 410.
export const classify=status=>status>=200&&status<400?'ok':[401,403,429].includes(status)?'blocked':status===404||status===410?'dead':'check';
async function probe(url){for(const method of ['HEAD','GET']){try{const res=await fetch(url,{method,redirect:'follow',signal:AbortSignal.timeout(20000),headers:{'user-agent':'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36 GarageAtlas-Linkcheck','accept':'text/html,*/*'}});if(method==='HEAD'&&res.status>=400)continue;return res.status;}catch(err){if(method==='GET')return 0;}}return 0;}
async function main(){
 const urls=collectUrls(),counts={ok:0,blocked:0,dead:0,check:0};let dead=0;
 for(const url of urls){const status=await probe(url),kind=status===0?'check':classify(status);counts[kind]++;if(kind==='dead')dead++;console.log(`${String(status||'ERR').padEnd(4)} ${kind.padEnd(8)} ${url}`);await new Promise(r=>setTimeout(r,600));}
 console.log(`\n${urls.length} Links: ${counts.ok} erreichbar, ${counts.blocked} gesperrt oder gedrosselt (nicht prüfbar), ${counts.check} bitte ansehen, ${counts.dead} tot`);
 process.exit(dead?1:0);
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1])await main();
