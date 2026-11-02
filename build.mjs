import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=new URL('./',import.meta.url);
const MODULES=['src/core.mjs','src/vehicle-core.mjs','src/vehicle-data.mjs','src/vehicle-ui.mjs','src/catalog-core.mjs','src/catalog-data.mjs','src/catalog-ui.mjs','src/workshop-core.mjs','src/workshop-data.mjs','src/workshop-ui.mjs','src/learning-data.mjs','src/learning-core.mjs','src/learning-ui.mjs','src/documents-data.mjs','src/documents-core.mjs','src/manual-core.mjs','src/manual-data.mjs','src/manual-assets.mjs','src/data.mjs','src/draw.mjs','src/assistant-data.mjs','src/assistant-core.mjs','src/documents-ui.mjs','src/manual-ui.mjs','src/app.mjs','src/assistant-ui.mjs'];
// Entfernt Import-Zeilen (auch mehrzeilig) und das Schlüsselwort export vor Deklarationen. Alles andere bleibt stehen und wird von assertBundled gemeldet.
export const strip=s=>s.replace(/^import\s*['"][^'"\n]+['"];?[ \t]*\r?\n/gm,'').replace(/^import\s[^;]*?\sfrom\s*['"][^'"\n]+['"];?[ \t]*\r?\n/gm,'').replace(/^export\s+(?=(?:async\s+)?(?:function|const|let|class)\b)/gm,'');
export function assertBundled(script){const m=script.match(/^(?:import\s+[\w*{'"]|export\s+(?:(?:default|async|function|const|let|class)\b|[{*])).*$/m);if(m)throw new Error(`Build abgebrochen: Modulanweisung im Bündel übrig geblieben: ${m[0].slice(0,100)}`);}
// connect-src: OpenAI (kostenpflichtige KI), jsDelivr (WebLLM-Bibliothek, per SHA-256 geprüft), Hugging Face und GitHub (Modelle der kostenlosen Browser-KI).
// script-src blob: und 'wasm-unsafe-eval' braucht nur die Browser-KI: geprüfte Bibliothek als Blob-Modul, Modelle als WebAssembly.
export const cspFor=hash=>["default-src 'none'",`script-src '${hash}' blob: 'wasm-unsafe-eval'`,"style-src 'unsafe-inline'","img-src 'self' data: blob:","media-src https: blob:","frame-src https://www.youtube-nocookie.com blob:","object-src blob:","connect-src 'self' https://api.openai.com https://cdn.jsdelivr.net https://huggingface.co https://*.huggingface.co https://*.hf.co https://raw.githubusercontent.com","base-uri 'none'","form-action 'none'"].join('; ');
export function bundle(html,css,sources){
 const script='(()=>{\n"use strict";\n'+sources.map(strip).join('\n')+'\n})();';assertBundled(script);
 const hash='sha256-'+createHash('sha256').update(script).digest('base64');
 const out=html.replace('%CSP%',()=>cspFor(hash)).replace('/* INLINE_STYLE */',()=>css).replace('/* INLINE_SCRIPT */',()=>script);
 if(/%CSP%|INLINE_STYLE|INLINE_SCRIPT/.test(out.replace(script,'')))throw new Error('Build abgebrochen: Platzhalter nicht ersetzt.');
 return out;
}
async function main(){
 const get=p=>readFile(new URL(p,root),'utf8');
 const [html,css,...sources]=await Promise.all(['src/index.html','src/style.css',...MODULES].map(get));
 const result=bundle(html,css,sources);
 await mkdir(new URL('dist/',root),{recursive:true});await writeFile(new URL('dist/index.html',root),result);
 console.log(JSON.stringify({file:'dist/index.html',bytes:Buffer.byteLength(result)}));
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1])await main();
