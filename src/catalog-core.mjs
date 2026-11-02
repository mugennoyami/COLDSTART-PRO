import {norm,safeURL} from './core.mjs';

export function catalogId(url){return String(url).match(/-(\d+)(?:\?|$)/)?.[1]??'';}
export function catalogImagePath(url){
 const id=String(url??'').match(/\/components\/(\d+)\.\w+/)?.[1];
 return id?`assets/catalog/${id}.webp`:'';
}
export function zoomAtPoint(transform,scale,x,y){
 const next=Math.min(5,Math.max(.6,scale));
 const ratio=next/transform.scale;
 return {scale:next,x:x-(x-transform.x)*ratio,y:y-(y-transform.y)*ratio};
}
export function catalogMatches(group,query,terms=''){
 const q=norm(query);return !q||norm(`${group.name} ${group.id} ${group.categoryName??''} ${terms}`).includes(q);
}
export function catalogItemKey(p){return `${p.model}:${p.variantId??''}:${p.componentId}:${p.position}:${p.number||p.articleNumber||p.name}`;}
export function cleanCatalogList(value){
 if(!Array.isArray(value)||value.length>5000)throw new Error('Katalog-Projektliste ist ungültig.');
 return value.map(x=>{
  if(!x||!['E36','E46'].includes(x.model)||!/^\d[a-z\d]{5}$/i.test(x.componentId)||!/^\d{1,3}[a-z]?$/i.test(String(x.position)))throw new Error('Ungültige Katalogposition.');
  if(x.variantId&&!/^[A-Z\d]{4}$/.test(x.variantId))throw new Error('Ungültiger Fahrzeug-Typschlüssel.');
  const url=safeURL(x.url);if(!url||!/^https:\/\/www\.leebmann24\.com\/de\/de\/(?:component|product)\//.test(url))throw new Error('Ungültige Katalogquelle.');
  return {model:x.model,variantId:x.variantId||'',vehicleLabel:String(x.vehicleLabel??'').slice(0,180),engine:String(x.engine??'').slice(0,30),componentId:x.componentId,position:String(x.position),number:/^[A-Z\d]{11}$/i.test(x.number)?String(x.number):null,articleNumber:String(x.articleNumber??'').slice(0,40),name:String(x.name??'Bauteil').slice(0,250),componentName:String(x.componentName??'').slice(0,250),url,qty:Math.max(1,Math.min(99,Math.floor(Number(x.qty)||1))),checked:x.checked===true,userNote:String(x.userNote??'').slice(0,1000)};
 });
}
export function addCatalogItem(list,item){
 const entry=cleanCatalogList([{...item,qty:1}])[0],key=catalogItemKey(entry);
 const next=list.map(x=>({...x})),old=next.find(x=>catalogItemKey(x)===key);
 if(old)old.qty=Math.min(99,old.qty+1);else next.push(entry);return next;
}
