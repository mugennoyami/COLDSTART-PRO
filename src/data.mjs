import {MANUAL_PARTS} from './manual-data.mjs';
export const META={version:'0.7.0',date:'02.11.2026',schemaVersion:1};
export const MODELS={E36:{label:'BMW E36',profile:'328i Coupé · M52',code:'BG11',years:'Referenzprofil, kein VIN-Abgleich'},E46:{label:'BMW E46',profile:'325i Limousine · M54',code:'AV31',years:'Referenzprofil, kein VIN-Abgleich'}};
export const GROUPS=[{id:'front',name:'Vorderradbremse',family:'Bremsanlage',code:'34 / VA',icon:'disc',desc:'Scheibe, Belag und Bremssattel',risk:'sicherheitskritisch'},{id:'rear',name:'Hinterradbremse',family:'Bremsanlage',code:'34 / HA',icon:'disc',desc:'Hintere Reib- und Anbauteile',risk:'sicherheitskritisch'},{id:'oil',name:'Ölfilter & Gehäuse',family:'Motor',code:'11 / ÖL',icon:'filter',desc:'Filtereinsatz, Deckel und Dichtungen',risk:'Fachprüfung erforderlich'},{id:'cool',name:'Wasserpumpe & Thermostat',family:'Motor',code:'11 / KÜ',icon:'pump',desc:'Pumpe, Gehäuse und Dichtungen',risk:'Fachprüfung erforderlich'}];
export const SOURCES=[
{id:'e36-front',title:'HUBAUER · E36 328i Coupé: Vorderradbremse',url:'https://www.hubauer-shop.de/de/autoteile/oldtimer/3-classic/bg11-e36-m52/328i-coupe-bremsen-bg11/bg11-342328-front-b/',note:'Manuell recherchierte Einzelreferenzen. Keine Bildübernahme und kein VIN-Abgleich.'},
{id:'e36-cool',title:'HUBAUER · E36 328i: Wasserpumpe / Thermostat',url:'https://www.hubauer-shop.de/de/autoteile/oldtimer/3-classic/bg11-e36-m52/328i-coupe-motor-bg11/bg11-116080-waterpu/',note:'Die Quelle listet Bauzeitvarianten, die gesondert geprüft werden müssen.'},
{id:'oil-cap',title:'HUBAUER · Ölfilterdeckel 11421744000',url:'https://www.hubauer-shop.de/de/oelfilterdeckel-11421744000.html',note:'Einzelteilreferenz, mehrere Modelle. Eine Nummer belegt keine Passung am konkreten Fahrzeug.'},
{id:'e46-oil',title:'HUBAUER · E46 M54: Ölversorgung',url:'https://www.hubauer-shop.de/de/autoteile/3er-ersatzteilkatalog/touring-3er/en31-e46-m54/325i-touring-motor-en31/en31-11-2201-tempera/',note:'Referenzseite zeigt Touring EN31. Übertragung auf eine Limousine ist nicht bestätigt.'},
{id:'e36-oil',title:'HUBAUER · E36 M52: Ölversorgung',url:'https://www.hubauer-shop.de/de/autoteile/oldtimer/3-classic/cd21-e36-m52/328ia-limousine-motor-cd21/cd21-111288-lubrica/',note:'Referenzseite zeigt Automatik-Limousine CD21 und verschiedene Bauzustände. Keine automatische Zuordnung zum Coupé.'},
{id:'e46-front',title:'RealOEM · E46 325i: vordere Bremsscheibe',url:'https://www.realoem.com/bmw/enUS/showparts?diagId=34_0758&id=AV31-EUR-01_2000_E46_BMW_325i',note:'Katalogreferenz, keine BMW-Freigabe. Abweichende Ausstattungsvarianten S100A, S106A, S847A vorhanden.'},
{id:'e46-pad',title:'RealOEM · E46 325i: Sattel, Belag und Fühler',url:'https://www.realoem.com/bmw/enUS/showparts?diagId=34_0757&id=AV31-EUR---E46-BMW-325i',note:'Standard- und Sonderausstattung unterscheiden sich. Nicht automatisch bestellen.'},
{id:'e46-rear',title:'RealOEM · E46 325i: hintere Bremsscheibe',url:'https://www.realoem.com/bmw/enUS/showparts?diagId=34_1014&id=AV31-EUR---E46-BMW-325i',note:'Zusätzliche Varianten für Sicherheitsfahrzeuge; Achse und Bauzustand abgleichen.'},
{id:'e46-disc',title:'HUBAUER · Bremsscheiben-Referenz 34116864058',url:'https://www.hubauer-shop.de/de/bremsscheibe-belueftet-34116864058.html',note:'Händler-Produktseite bestätigt Nummer und Bezeichnung, nicht den individuellen Einbau.'},
{id:'e36-rear',title:'HUBAUER · E36 328i: Hinterradbremse',url:'https://www.hubauer-shop.de/de/autoteile/oldtimer/3-classic/bg11-e36-m52/328i-coupe-bremsen-bg11/bg11-342332-rear-wh/',note:'Mehrere Sattelvarianten sichtbar. In dieser Fassung bleibt die eindeutige Zuordnung offen.'},
{id:'brembo',title:'Brembo · Hersteller-Anleitungen',url:'https://www.brembostore.com/pages/product-faq',note:'Englische Herstellerübersicht mit Original-Montageanleitungen. Allgemeine Produktunterlagen, keine E36/E46-spezifische Reparaturfreigabe.'},
{id:'haynes',title:'HaynesPro · professionelle Datenintegration',url:'https://www.infopro-digital-automotive.com/haynespro/',note:'Funktionsreferenz. Keine Partnerschaft, Datenlizenz oder Anbindung vorhanden.'},
{id:'leebmann',title:'Leebmann24 · Originalteile-Katalog',url:'https://www.leebmann24.com/de/de',note:'Kategorien, Originalzeichnungen und verfügbare Teilepositionen am 30.10.2026 über den sichtbaren Browserkatalog erfasst.'},
{"id": "h-caliper", "title": "HUBAUER · Bremssattelgehäuse links", "url": "https://www.hubauer-shop.de/de/bremssattelgehaeuse-links-34116758113.html", "note": "Original-Händlerangebot bestätigt Bezeichnung und Nummer. Katalog- und Ausstattungsbedingungen sind vor Verwendung fahrzeuggenau zu prüfen."},
{"id": "h-pad", "title": "HUBAUER · Bremsbelagsatz", "url": "https://www.hubauer-shop.de/de/reparatursatz-bremsbelaege-asbestfrei-34116761244.html", "note": "Original-Händlerangebot bestätigt Bezeichnung und Nummer. Katalog- und Ausstattungsbedingungen sind vor Verwendung fahrzeuggenau zu prüfen."},
{"id": "h-sensor", "title": "HUBAUER · Bremsbelagfühler", "url": "https://www.hubauer-shop.de/de/bremsbelagfuehler-34351164371.html", "note": "Original-Händlerangebot bestätigt Bezeichnung und Nummer. Katalog- und Ausstattungsbedingungen sind vor Verwendung fahrzeuggenau zu prüfen."},
{"id": "h-shield", "title": "HUBAUER · Schutzblech vorne links", "url": "https://www.hubauer-shop.de/de/schutzblech-links-34116750129.html", "note": "Original-Händlerangebot bestätigt Bezeichnung und Nummer. Katalog- und Ausstattungsbedingungen sind vor Verwendung fahrzeuggenau zu prüfen."},
{"id": "h-bolt", "title": "HUBAUER · Innensechskantschraube", "url": "https://www.hubauer-shop.de/de/innensechskantschraube-34211161806.html", "note": "Original-Händlerangebot bestätigt Bezeichnung und Nummer. Katalog- und Ausstattungsbedingungen sind vor Verwendung fahrzeuggenau zu prüfen."},
{"id": "h-rear", "title": "HUBAUER · Bremsscheibe hinten", "url": "https://www.hubauer-shop.de/de/bremsscheibe-belueftet-34216864056.html", "note": "Original-Händlerangebot bestätigt Bezeichnung und Nummer. Katalog- und Ausstattungsbedingungen sind vor Verwendung fahrzeuggenau zu prüfen."},
{"id": "h-rshield", "title": "HUBAUER · Schutzblech hinten links", "url": "https://www.hubauer-shop.de/de/schutzblech-links-34211158991.html", "note": "Original-Händlerangebot bestätigt Bezeichnung und Nummer. Katalog- und Ausstattungsbedingungen sind vor Verwendung fahrzeuggenau zu prüfen."}
].map(s=>({...s,accessed:s.id==='leebmann'?'30.10.2026':'29.10.2026'}));
const templates={
front:[['disc','Bremsscheibe, vorne','Bremsscheibe Bremse Rotor'],['caliper','Bremssattel, vorne links','Bremssattel Bremszange'],['pad','Bremsbelagsatz, vorne','Bremsklötze Beläge'],['sensor','Verschleißsensor, vorne','Fühler Warnkontakt'],['shield','Schutzblech, vorne links','Ankerblech Staubschutz'],['bolt','Bremsscheiben-Halteschraube','Innensechskantschraube Schraube']],
rear:[['disc','Bremsscheibe, hinten','Bremsscheibe Hinterachse'],['caliper','Bremssattel, hinten links','Bremszange'],['pad','Bremsbelagsatz, hinten','Bremsklötze Beläge'],['sensor','Verschleißsensor, hinten','Fühler Warnkontakt'],['shield','Schutzblech, hinten links','Ankerblech'],['bolt','Bremsscheiben-Halteschraube','Schraube']],
oil:[['cap','Ölfilterdeckel','Filterdeckel'],['filter','Ölfiltereinsatz','Ölfilter Filter'],['ring','O-Ring am Filterdeckel','Dichtring'],['housing','Ölfiltergehäuse','Aggregateträger'],['gasket','Gehäusedichtung','Dichtung'],['switch','Öldruckschalter','Drucksensor']],
cool:[['pump','Kühlmittelpumpe','Wasserpumpe'],['ring','O-Ring an der Wasserpumpe','Dichtring'],['flange','Anschluss- / Thermostatgehäuse','Flansch Gehäuse'],['thermostat','Thermostat','Kühlmittelregler'],['gasket','Gehäusedichtung','Profildichtung'],['pulley','Riemenscheibe','Wasserpumpenrad']]
};
const refs={
'E36-front-disc':['34116864060','e36-front','Nummer im Referenzkatalog belegt. Umbauten und andere Bremsanlagen sind nicht erfasst.'],
'E36-front-shield':['34111158985','e36-front','Linkes Schutzblech. Rechte Seite separat zuordnen.'],
'E36-oil-cap':['11421744000','oil-cap','Referenz belegt; Bauzustand und Gehäuseausführung prüfen.'],
'E36-oil-ring':['11421741000','e36-oil','Die Referenzquelle zeigt CD21; Coupé-Passung bleibt offen.'],
'E36-cool-pump':['11517527799','e36-cool','Referenznummer der mechanischen Pumpe im Beispielkatalog.'],
'E36-cool-ring':['11511711484','e36-cool','Bauzeitabhängigkeit in der Quelle beachten.'],
'E36-cool-flange':['11531722531','e36-cool','Anschlussflansch; Bauzeitabhängigkeit in der Quelle beachten.'],
'E46-front-disc':['34116864058','e46-disc','Nummernreferenz belegt; konkrete Fahrzeugzuordnung offen. Bauzeit, Ausstattung und verbaute Bremsanlage unabhängig abgleichen.'],
'E46-front-caliper':['34116758113','h-caliper','Linke Bauteilreferenz im Händlerkatalog belegt. Ausstattungs- und Bauzeitzuordnung offen.'],
'E46-front-pad':['34116761244','h-pad','Nummernreferenz im Händlerkatalog belegt. Tatsächlich verbauten Sattel und Ausstattung prüfen.'],
'E46-front-sensor':['34351164371','h-sensor','Vordere Referenz. Nicht auf Hinterachse übertragen.'],
'E46-front-shield':['34116750129','h-shield','Linkes Schutzblech im Händlerangebot. Die konkrete Ausstattungsvariante ist nicht abgeglichen.'],
'E46-front-bolt':['34211161806','h-bolt','Nur Referenz, keine Angabe zu Anzugsmoment oder Wiederverwendung.'],
'E46-rear-disc':['34216864056','h-rear','Händlerbeleg mit Ausstattungsbedingungen. Kein bestätigter Teilematch am konkreten Fahrzeug.'],
'E46-rear-shield':['34211158991','h-rshield','Linke Bauteilreferenz. Bauzeit- und Ausstattungszuordnung bleibt offen.'],
'E46-rear-bolt':['34211161806','h-bolt','Keine Montagewerte oder Freigabe zur Wiederverwendung enthalten.'],
'E46-oil-cap':['11421744000','oil-cap','Referenznummer belegt. Individuelle Gehäuseausführung prüfen.'],
'E46-oil-filter':['11427512300','e46-oil','M54-Referenz aus Touring EN31. Kein bestätigter Teilematch für AV31.'],
'E46-oil-ring':['11421741000','e46-oil','Bauzeitvarianten in der Quelle; Zuordnung bleibt offen.']
};
export const PARTS=Object.keys(MODELS).flatMap(model=>GROUPS.flatMap(g=>templates[g.id].map(([kind,name,aliases],i)=>{let id=`${g.id}-${kind}`,r=refs[`${model}-${id}`];return{id,model,group:g.id,kind,name,aliases,number:r?.[0]??null,sourceId:r?.[1]??null,note:r?.[2]??'Für diesen Platzhalter wurde keine eindeutige Referenznummer freigegeben. Eine passende, rechtmäßig nutzbare Quelle ergänzen.',references:[]};}))).concat(MANUAL_PARTS);
