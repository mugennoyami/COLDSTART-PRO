# Handbuchauswertung und Integration

COLDSTART Garage Atlas 0.2.0 · Auswertung und Implementierung: 29.10.2026.

## Ergebnis und Entscheidung

Das Bentley-Buch ist eine nützliche historische E36-Arbeitsquelle. Es liefert echte Komponentenabbildungen, nachvollziehbare Kapitel und Reparaturkontext. Es ist jedoch eine US-Ausgabe mit Redaktionsstand Januar 1999. Die Abdeckung eines US-328i/M52 belegt weder die genaue europäische Fahrzeugausführung noch den heute eingebauten Teilezustand.

Das zweite PDF ist kein E36-Handbuch. Sein Dateiname ist dafür zu unspezifisch: Im Buch selbst wird der E36 ausdrücklich ausgeschlossen. Es bleibt als historischer Hintergrund für allgemeine Sicherheit, Werkzeuge und systematisches Arbeiten sichtbar. **Für den E46 ist keines der beiden Bücher eine geeignete fahrzeugspezifische Reparaturquelle.**

Empfehlung: Die neue Version als lokalen E36-Recherche- und Vorbereitungsatlas verwenden. Für eine tatsächlich ausgeführte Arbeit sind die passende Variante, aktuelle Reparaturdaten und bei sicherheitskritischen Arbeiten eine qualifizierte Prüfung erforderlich. Ein Verkauf als vollständige oder fachlich freigegebene E36-/E46-Reparaturdatenbank ist durch diese Dokumente nicht vorbereitet.

## 1. Welche Dokumente vorliegen

| Merkmal | Bentley E36 | Historisches Haynes-Buch |
|---|---|---|
| Upload-Datei | BMW - E36 - 3 Series Service Manual (1992 - 1998) EN.pdf | BMW_Service_And_Repair_Manual_83-91-3er5er.pdf |
| Tatsächlicher Titel / Verlag | BMW 3 Series Service Manual / Robert Bentley, Inc. | BMW 3- & 5-Series Service and Repair Manual / Haynes Publishing |
| Ausgabe | Copyright 1999; Redaktionsschluss 01/1999 | Copyright 1997 |
| ISBN | 0-8376-0326-9 | 1 85960 236 3 |
| Umfang dieser Datei | 759 PDF-Seiten; 100.257.998 Bytes | 228 PDF-Seiten; 7.445.125 Bytes |
| Relevante Gültigkeit | US-E36 1992–1998; M3, 318i, 323i, 325i, 328i; Limousine, Coupé, Cabrio | E30 sowie E28/E34; überwiegend Baujahre 1981–1991, modellabhängig |
| Abgrenzung | US-Markt auf PDF 5 / Buch v; kein E46; Touring/Compact und europäische Varianten nicht pauschal abgedeckt | E36 auf PDF 4 / Buch 0•4 ausdrücklich ausgeschlossen; kein E46 |
| M52-Bezug | PDF 43 / 100-1 ordnet den US-328i 1996–1998 dem M52 zu | Keine passende M52-Grundlage |
| Einordnung | Historische E36-Quelle, konkrete Anwendbarkeit prüfen | Allgemeiner historischer Hintergrund, keine Zuordnung zu E36-/E46-Reparaturen |

Die Jahresangaben im Uploadnamen ersetzen nicht die Angaben im Buch. Das Bentley-Impressum weist darauf hin, dass BMW das Handbuch nicht geprüft hat, Teilenummern dort Identifikationszwecken dienen und zwischenzeitliche Änderungen nicht vollständig erfasst werden. Die Dateiidentität kann technisch geprüft werden; dadurch wird keine Verlags-Authentifizierung oder Nutzungslizenz nachgewiesen.

## 2. Umfang und Grenzen der Analyse

Beim Bentley-PDF wurden alle 759 Seitenkopfbereiche per OCR erschlossen. 92 für Gültigkeit, Grundlagen, Wartung, Schmiersystem, Kühlsystem und Bremsen relevante Vollseiten wurden zusätzlich per OCR ausgewertet; ausgewählte entscheidende Fundstellen und alle fünf übernommenen Abbildungsausschnitte wurden am Seitenbild geprüft. Das ist keine vollständige fachliche Prüfung aller 759 Buchseiten. Insbesondere wurden nicht sämtliche Schaltpläne, Motorausführungen oder Anzugsdrehmomente validiert.

Die vorhandenen PDF-Lesezeichen der E36-Datei zeigen auf die erste PDF-Seite und sind daher kein brauchbarer Navigationsindex. Stattdessen wurden PDF-Seiten und gedruckte Kapitelnummern getrennt erfasst. 28 numerisch bezeichnete kuratierte Fundstellen wurden gegen die ausgelesenen Seitenköpfe abgeglichen; dabei gab es keine Zuordnungsabweichung. Die 47 Kapitelanfänge sind ein OCR-gestützter Navigationsindex, keine technische Freigabe dieser Kapitel.

Das Haynes-PDF besitzt auf 217 der 228 Seiten eine verwertbare Textschicht. Ausgewertet wurden Gültigkeit, Einleitung und die allgemeinen Referenzabschnitte. Historische fahrzeugspezifische Sollwerte daraus werden nicht in den E36-/E46-Bestand übernommen.

OCR kann Zeichen, Einheiten und Tabellenzuordnungen verwechseln. Daher wurde keine OCR-Zahl automatisch als OEM-Nummer, Drehmoment, Füllmenge, Verschleißgrenze oder Bestellfreigabe eingetragen. Unnötige persönliche Angaben aus Lizenzwasserzeichen sind weder in den neuen Texten noch in den ausgewählten Bildausschnitten enthalten.

## 3. Was konkret eingebaut wurde

| Erweiterung | Umfang | Praktischer Nutzen | Verbleibende Grenze |
|---|---:|---|---|
| Originale E36-Abbildungsausschnitte | 5 | Vorne/hinten Bremse, Ölfiltergehäuse, Thermostat, Wasserpumpe erkennen | Nur ausgewählte historische US-Abbildungen; kein vollständiges Fahrzeug |
| Anklickbare Bildpositionen | 54 | Vom Bild direkt zum passenden Bauteildatensatz | Atlas-Labels, keine ETK-Positions- oder OEM-Nummern |
| Zusätzliche E36-Bauteiltypen | 35 | Führungen, Dichtungen, Sattelinnenteile und Feststellbremskomponenten werden einzeln auffindbar | OEM-Nummern offen; keine Überholungs- oder Reparaturfreigabe |
| Gesamter Startbestand | 83 Plätze | 59 E36 und 24 E46 in je vier Baugruppen | Keine vollständige Modellabdeckung |
| Belegte Nummernplätze | unverändert 19 | Bereits dokumentierte Händlerreferenzen bleiben nachvollziehbar | 16 unterschiedliche Nummern; individuelle Passung weiter offen |
| Nummernlose Plätze | 64 | Fehlende Daten sind sichtbar statt erfunden | Exakte Varianten-/Quellenrecherche erforderlich |
| Deutsche Themenübersichten | 13 | Reparaturkontext, Abgrenzung und relevante Originalstellen schneller finden | Redaktionelle Zusammenfassung, Fachprüfung offen |
| Kapitelanfänge | 47 | Direkter Einstieg in das lokal vorhandene E36-Buch | Nicht alle Kapitel inhaltlich geprüft oder im Teileatlas modelliert |
| Lokale PDF-Bibliothek | 2 Ausgaben | Quelle einmal zuordnen, passende Originalseite per Klick öffnen | Browserlokal; Originale separat aufbewahren |

Die fünf ausgewählten Bilder und ihre Zuordnung:

| Bild | PDF-Seite / gedruckte Seite | Originalabbildung | Klickpositionen |
|---|---|---|---:|
| Vorderbremse | 294 / 340-4 | Fig. 2 | 16 |
| Hinterbremse und Feststellbremse | 296 / 340-6 | Fig. 7 | 25 |
| Ölfiltergehäuse, Sechszylinder | 32 / 020-10 | Fig. 7 | 6 |
| Thermostat und Gehäuse | 203 / 170-9 | Fig. 14 | 5 |
| Wasserpumpe am Steuergehäuse | 204 / 170-10 | Fig. 16 | 2 |

Die normalisierte Bildposition wird mit dem Originalausschnitt skaliert. Nicht gezeichnete Teile bleiben über die Liste erreichbar. Die Hinterradbremse enthält auch Feststellbremsteile; deren Darstellung bedeutet nicht, dass Sattelüberholung oder Bremsarbeit für Einsteiger freigegeben ist.

## 4. Sinnvolle Inhalte und bewusste redaktionelle Entscheidungen

**Belagwechsel und vollständigen Sattelausbau trennen.** Die Quelle beschreibt den Belagwechsel grundsätzlich ohne Abtrennen des Bremsschlauchs. Ein vollständiger Sattelausbau öffnet gegebenenfalls die Hydraulik und löst weitere Entlüftungs-, Dichtheits- und Funktionsprüfungen aus. Im Tool sind daraus getrennte Themen geworden. Eine kurze Zusammenfassung darf diese Arbeitsumfänge nicht vermischen.

**Vorbereitung und Abschluss sichtbar machen.** Die Übersichten verweisen auf standsicheres Abstützen, geeignete Ausrüstung, die Vermeidung von aufgewirbeltem Bremsstaub und das Abstützen des Sattels. Der Prüfabschluss wird nicht als bloßer Klick auf „erledigt“ dargestellt. Die kurzen deutschen Abschnitte ersetzen keine vollständige, passende Originalanweisung.

**Sattelinnenteile nur als Bauteiltypen.** Kolben, Kolbendichtring, Staubmanschette, Ring, Führungen und Entlüfter lassen sich am Bild anklicken. Es werden daraus weder ein pauschal verfügbares Ersatzteilset noch ein zulässiger Überholungsumfang oder ein Teilematch abgeleitet.

**Ölfilter und Öldruck unterscheiden.** Der Atlas führt Wartung am Filter getrennt vom Öldruckschalter beziehungsweise der Öldruckprüfung. Eine Warnleuchte oder ein Symptom wird damit nicht zu einer automatischen Diagnose. Keine fahrzeugbezogene Druckvorgabe oder Ölfüllmenge wurde aus einer unsicheren Tabellenzuordnung übernommen.

**Kühlsystem nach Ausführung prüfen.** Thermostat, Gehäuse, Dichtungen und mechanische Wasserpumpe erhalten eigene Bildpositionen. Reservoir- und Entlüftungsvarianten aus dem Buch wurden nicht zu einer universellen Schrittfolge zusammengezogen. Bei heißem beziehungsweise unter Druck stehendem System bleiben die Originalwarnungen relevant.

**Alte Kaufregeln nicht ungeprüft fortschreiben.** Die pauschale Empfehlung des historischen Buchs zu Wasserpumpen-Laufradmaterialien ist keine aktuelle produktübergreifende Kaufregel. Konstruktion, Herstellerfreigabe, konkrete Anwendung und aktuelle Spezifikation müssen geprüft werden.

**Wartungsintervalle nicht automatisch übernehmen.** Der Wartungsplan ist als historischer US-Plan auffindbar. Er wird nicht als aktueller, allgemeiner Plan für jedes europäische oder umgebaute E36-Fahrzeug hinterlegt.

### Erkannter Konflikt bei der Hinterbremse

Auf PDF 291 / 340-1 beschreibt das Bentley-Buch für Nicht-M3 hinten eine massive Scheibe; die Tabelle auf PDF 297 / 340-7 enthält dazu eine hintere Verschleißgrenze von 8,4 mm. Eine aktuelle Original-Händlerreferenz für E36 328i Coupé/M52 führt hingegen eine belüftete hintere Scheibe. Ob die Abweichung auf regionale Ausführung, Modellabgrenzung oder einen Buchfehler zurückgeht, wurde nicht abschließend geklärt.

**Folge:** Der Wert wird nicht als gültige hintere 328i-Grenze in den Atlas übernommen. Die Serviceansicht und das Scheibenthema zeigen einen ausdrücklichen Quellenkonflikt. Am konkreten Fahrzeug müssen Bremsausführung, Abmessung, Herstellerkennzeichnung und geeignete aktuelle Reparaturdaten zusammenpassen.

Zusätzlicher Originalbeleg, abgerufen 29.10.2026: Hubauer, „328i Coupé Bremsen“, BG11/M52, Position 19 belüftete Bremsscheibe: https://www.hubauer-shop.de/de/autoteile/oldtimer/3-classic/bg11-e36-m52/328i-coupe-bremsen-bg11/bg11-342332-rear-wh/ . Die Händlerreferenz ist ein Konfliktsignal, keine Bestätigung der individuellen Fahrzeugpassung.

## 5. Fundstellen für die nächste fachliche Prüfung

PDF-Seiten zählen ab Dateianfang; gedruckte Buchseiten sind davon unabhängig.

| Thema | Dokument | PDF-Seite(n) | Gedruckte Seite(n) | Verwendung |
|---|---|---|---|---|
| Titel, Grenzen, US-Gültigkeit | Bentley | 1, 2, 5 | Titel, Impressum, v | Gültigkeit vor Reparatur prüfen |
| M52-/Modelltabelle | Bentley | 43 | 100-1 | US-328i-Zuordnung; kein Nachweis des eingebauten Motors |
| Warnungen und Abstützen | Bentley | 7, 8, 11, 12 | vii, viii, 010-3, 010-4 | Vorbereitung und Abbruchentscheidung |
| Wartungsprogramm | Bentley | 23–25 | 020-1 bis 020-3 | Historischen Plan einordnen |
| Öl-/Filterservice | Bentley | 31–33 | 020-9 bis 020-11 | Wartungsthema und Ölfilterbild |
| Öldruck | Bentley | 115, 116 | 119-1, 119-2 | Messkontext statt vorschneller Diagnose |
| Kühlsystem-Grundlagen | Bentley | 195, 196, 199–202 | 170-1, 170-2, 170-5 bis 170-8 | Ausführungen und sichere Vorbereitung |
| Thermostat | Bentley | 203 | 170-9 | Gehäuse-/Dichtungszuordnung |
| Wasserpumpe | Bentley | 204, 205 | 170-10, 170-11 | Bauteile und Arbeitskontext |
| Bremsbeläge | Bentley | 293–295 | 340-3 bis 340-5 | Belagwechsel getrennt vom hydraulischen Ausbau |
| Bremssattel / Hydraulik | Bentley | 292, 293, 296 | 340-2, 340-3, 340-6 | Zusätzlichen Arbeitsumfang erkennen |
| Bremsscheibe | Bentley | 296, 297 | 340-6, 340-7 | Arbeitskontext; hintere Grenzwerte gesperrt |
| Feststellbremse | Bentley | 300–302 | 340-10 bis 340-12 | Separates Thema mit Originalverweisen |
| E36 ausdrücklich ausgeschlossen | Haynes | 4 | 0•4 | Keine falsche Modellzuordnung |
| Allgemeine Sicherheit | Haynes | 6 | 0•6 | Historischer Hintergrund |
| Werkzeuge / allgemeine Verfahren | Haynes | 206–209 | REF•5 bis REF•8 | Allgemeiner Hintergrund, keine Sollwerte |
| Teile / Fahrzeugidentifikation | Haynes | 219 | REF•19 | Historische Hinweise zur Quellenarbeit |

## 6. Bedienung, Datenspeicherung und Rechte

„Meine Handbücher“ zeigt beide Ausgaben mit Gültigkeit, Dateigröße, Prüfsumme und Suchfunktion. Die Originaldateien werden vom Nutzer lokal ausgewählt. Dateigröße und PDF-Kennung werden geprüft; anschließend wird der SHA-256 des vollständigen Inhalts mit der analysierten Fassung verglichen. Ein falsches PDF oder eine andere Edition wird nicht stillschweigend den festen Seitenverweisen zugeordnet.

Die App verwendet Web Crypto, falls verfügbar; andernfalls eine lokale, gegen Standardvektoren und Node geprüfte SHA-256-Funktion. Es gibt keinen Upload-Endpunkt. IndexedDB hält die PDF im Browserprofil, sofern ausreichend Speicher verfügbar ist. Bei Speicherfehlern ist nur die Sitzung verfügbar und wird so gekennzeichnet. Die Projekt-JSON-Sicherung enthält ausdrücklich keine PDF-Binärdateien. Originale separat sichern und bei Browserwechsel neu zuordnen.

Die PDF-Anzeige nutzt den PDF-Leser des Browsers. Im geprüften Chrome-Kontext funktionierten die eingebettete Darstellung und der Sprung auf PDF 294 sowie weiter auf 295. Für abweichende Browser gibt es den gesonderten Öffnen-Link und eine manuelle Seitenangabe. Ein echter iPhone-/Safari-Test wurde nicht durchgeführt.

Die vollständigen Originalbücher sind nicht im HTML oder im Quellcode-ZIP enthalten. Die HTML-Fassung enthält fünf ausgewählte Ausschnitte und kurze deutsche redaktionelle Arbeitsübersichten für diese lokale private Reviewfassung. Die Bereitstellung eines Buchs durch den Nutzer belegt keine öffentlichen oder kommerziellen Nutzungsrechte. Vor Veröffentlichung oder Verkauf sind Rechte an Abbildungen und Bearbeitungen sowie die technische Freigabe gesondert zu klären. Verlags-/Quellenangaben bleiben sichtbar; personenbezogene Lizenzwasserzeichen wurden nicht in die neuen Unterlagen übernommen.

## 7. Review-Ergebnis und sinnvoller nächster Schritt

Die Version verbessert vor allem **Bauteilerkennung, Quellenwiederfinden und Vorbereitung**. Sie senkt das Risiko einer falschen Modellzuordnung durch sichtbare Ausgabengrenzen und getrennte E46-Daten. Es wurden keine realen Reparaturzeiten, Fehlkaufraten oder Kosteneinsparungen gemessen.

Die technische Prüfung umfasst 39 bestandene automatisierte Tests, 54/54 korrekt geöffnete Bildpositionen im Desktopbrowser, erfolgreiche Zuordnung der beiden Original-PDFs, Abweisung der falschen Datei, Originalseitenaufruf, Suchfunktion und Fortbestand der PDF-Zuordnung nach Neuladen. Auf Telefonbreite 375 px und Tabletbreite 753 px entstand kein horizontaler Seitenüberlauf. Die mobile Großansicht wurde nachgemessen: 720 px Bildbreite innerhalb eines separat verschiebbaren Bildbereichs.

Als nächste fachliche Freigabeeinheit empfiehlt sich **eine einzige dokumentierte E36-Baugruppe**: tatsächlich verbaute Ausführung erfassen, Händler-/Herstellerreferenzen abgleichen, ausgewählte Bauteile vollständig nummerieren, Originalanweisung auf Gültigkeit prüfen und eine qualifizierte Person den deutschen Ablauf kontrollieren lassen. Dafür muss keine Bremsreparatur als Test ausgeführt werden. Für den E46 wird zuerst eine wirklich passende Quelle benötigt. Weitere Kapitel als bloße Klickziele hinzuzufügen wäre vor dieser Datenprüfung weniger nützlich.
