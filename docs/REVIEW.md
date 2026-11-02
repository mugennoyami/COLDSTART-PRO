# Prüfbericht und Nutzenbewertung

COLDSTART Garage Atlas 0.4.1 · 30.10.2026.

## Prüfstand 0.4.1: Korrekturen nach Audit

Grundlage ist eine Prüfung des Stands 0.4.0 (Tests, reproduzierbarer Build, Abgleich der Dokuzahlen mit den Daten, Browserdurchläufe, axe, Linkprüfung). Eigene technische Prüfung, keine KFZ-Fachfreigabe.

| Befund 0.4.0 | Korrektur 0.4.1 | Nachweis |
|---|---|---|
| Import mit Teilenummer als JSON-Zahl wurde gespeichert; Baugruppe nach Neuladen leer, Meldung „abgewiesen“ | Strenge Typprüfung, transaktionaler Import, Start verwirft beschädigten Zusatzkatalog, Reset-Knopf | Importtests (15 Negativfälle), Browser: Import abgewiesen, nichts gespeichert; alter vergifteter Speicher heilt beim Start |
| Sicherung ersetzte Daten ohne Rückfrage | Dialog mit Gegenüberstellung, Option „Aktuellen Stand sichern und einspielen“ | Browser: Abbrechen ändert nichts; Download vor dem Einspielen |
| Erfolgsmeldung überdeckte Speicherfehler | `save()` meldet Erfolg, nur dann Erfolgstext | Browser mit vollem Speicher: „Speichern nicht möglich“ bei Profil und Projektliste |
| Falscher Eintrag bei „Verknüpfung entfernen“ | Original-Index, Bereinigung beim Laden | Browser mit manipuliertem Speicher |
| Zwei 1,9-MB-Bilder füllten 5,1 Mio. Zeichen Speicher | Bilder in IndexedDB | Browser: fünf Bilder, Browserspeicher 921 Zeichen, nach Neuladen und Wiederherstellung vorhanden; Rückfall ohne IndexedDB geprüft |
| Veraltete `test-results.tap`, Build ließ mehrzeilige Imports stehen | Datei entfernt, Build-Guard, Tests | Tests: Mehrzeilen-Import, Abbruch bei `export {…}` |
| Kontrast bis 1,5:1, Schrift ab 6 px | Mindestschrift 10 px, Kontrast ≥ 4,5:1 | axe: 0 Verstöße in 24 Detailansichten und 9 Dialogen (ein Befund beim Einblenden der Toast-Meldung entsteht nur während der Animation); kein horizontaler Überlauf bei 360/390/768/1024 px |
| Keine CSP | CSP mit Skript-Hash | Browser: YouTube-Player lädt nach Klick, keine Konsolenfehler; Test: Hash passt zum Skript |

- Automatisierte Prüfungen: **108 bestanden, 0 fehlgeschlagen** (61 bisherige, 47 neue).
- Browser-Regression: 33 Einzelprüfungen bestanden (Import, Rückfrage, Speicher voll, IndexedDB-Migration und -Rückfall, CSP, Projektliste). Sie liefen mit Playwright in Chromium und sind kein Bestandteil des Repositorys.
- Nicht geprüft: Safari/Firefox, echte Mobilgeräte, die private Cloudbereitstellung mit der neuen CSP (blockiert diese Seite fremde Skripte der Plattform, muss `script-src` dort angepasst werden). Die externen Verweise sind weiter nur teilweise automatisch prüfbar (Shops sperren Skripte).

## Startwege und private Cloud · 29.10.2026

Die zusätzliche Bereitstellung verwendet denselben Anwendungscode; kein neuer Reparaturdatenstand. Sites-Projektidentität ist in `.openai/hosting.json` festgehalten. Zugang wurde vor Bereitstellung als Eigentümerkonto mit genau einem erlaubten Eigentümer und ohne Gruppen geprüft. Keine öffentliche Freigabe eingerichtet. Der konkrete Veröffentlichungserfolg wird vom Sites-Bereitstellungsergebnis bestätigt; eine vorbereitete URL allein belegt keinen laufenden Dienst.

- Finale lokale Prüfung nach angepasstem Speicherhinweis: **61 Tests bestanden, 0 fehlgeschlagen**. Browserdialog zeigt ChatGPT-Anmeldung für die private Cloud und fehlende Gerätesynchronisierung korrekt; Sicherungsknopf heißt „Projekt-Sicherung exportieren“.
- Windows-Startdatei öffnet ausschließlich `dist/index.html`, prüft deren Existenz und benötigt keine zusätzliche Laufzeit. Logik und Pfadquotierung geprüft; **kein echter Windows-Ausführungstest** im Linux-Container. CRLF für `.cmd`/`.url` explizit konfiguriert.
- Keine Datenbank, kein Offline-Service-Worker, keine automatische Veröffentlichung bei GitHub-Push und kein neues kostenpflichtiges Abo. JSON-Sicherung und erneute lokale Zuordnung von Originaldateien bleiben für Gerätewechsel nötig.
- Start- und Updateanleitung: [STARTEN.md](STARTEN.md). Die historischen Bedienprüfungen unten werden dadurch nicht als vollständiger erneuter Reparatur- oder Hardwaretest ausgegeben.

## Aktueller Prüfstand: Kaufquellen und AUTODOC

Eigene Daten-, Browser- und Layoutprüfungen. Kein vollständiger fachlicher Videoaudit, keine KFZ-Fachfreigabe und keine gemessene Ersparnis an realen Fahrzeugen. Alle historischen Prüfstände unten gelten jeweils für ihre damalige Fassung. Recherche, Angebotspreise und Quellenregister: [QUELLEN_KAUF_UND_AUTODOC.md](QUELLEN_KAUF_UND_AUTODOC.md).

| Prüfung 0.4 | Messbares Ergebnis | Praktische Aussage und Grenze |
|---|---|---|
| Finale automatisierte Prüfungen | **61 bestanden, 0 fehlgeschlagen** | 51 bestehende plus 10 neue Prüfungen; einschließlich finaler Bündelung, 26 Quelleinträge, Filter, Profilgrenzen, URL-Sicherheit, Preissumme, Player-Sperre und JSON-/Modulgleichheit |
| Neuer Quellenbestand | 26 Einträge: 10 Textanleitungen, 8 Videoquellen, 6 Kaufangebote, 2 Übersichten | 5 zurückgestellt; normal 21 sichtbar. Nicht 26 freigegebene Reparaturabläufe |
| Bibliothek im Desktopbrowser | Titel korrekt, 21 Karten; 0 externe Iframes vor Klick | Kein automatischer Video-/Vorschaubildabruf; keine Aussage über zukünftige externe Verfügbarkeit |
| E46-PDF / Papierbuch | Tatsächliche Detailklicks zeigen 27,99 € / 14. Auflage 2021 und 34,90 € / 15. Auflage 2025 | Verhindert falsche Gleichsetzung der aktuellen Angebote |
| E36-Gebrauchtbuch | Detail zeigt 9,90 € inklusive erfasstem Versand, Privatverkauf und Angebots-ID | Berechnung 7,00 + 2,90; Auflage offen, keine garantiert fortbestehende Verfügbarkeit |
| E46-Videofilter | 2 empfohlene Baugruppen-Videoverweise | Anders motorisierte Quellen bleiben standardmäßig verborgen; Motor-/Bremsausführung der übrigen Videos weiterhin prüfen |
| Falsches E46-Ölvideo bewusst öffnen | 1,9-l-/M54-Warnung sichtbar, **0 Playerbuttons** | Zurückgestellt bedeutet nicht nur eine andersfarbige Empfehlung |
| E46-M54-Öl / Kühlung am Bauteil | Öl-Video- und Kühl-Service-Tab zeigen jeweils keine passende kuratierte Quelle und 1 zurückgestellten Treffer | Diesel-/1,9-l-Anleitungen werden nicht auf M54 übertragen |
| E46-Hinterbremsen-Service | Originalverweis auf hintere Bremsbeläge sichtbar; Hinweis auf nur ähnliches Begleitvideo | Baugruppenbezug statt individueller Freigabe jedes Einzelteils |
| Video aktiv laden | Vorher 0, danach 1 Iframe: `youtube-nocookie.com/embed/udow01fDa_o?autoplay=0` | Klickschwelle funktioniert, Original-Link und Ausweichhinweis vorhanden. Tatsächliches vollständiges Abspielen nicht bestätigt |
| Neue Kauf-PDF | Detail nennt ausdrücklich noch fehlende Importfähigkeit und nötigen geprüften Dateieintrag | Keine neue Datei gekauft oder analysiert; bisherige Handbuchplätze nicht für beliebige PDFs geöffnet |
| Telefon: Quellenbibliothek | Iframe 375 px; nutzbare Seite 360/360 px, Dialog 347/347 px, Dialogkörper 332/332 px; 21 Karten | Scrollbar belegt 15 px; kein horizontaler Überlauf |
| Tablet: Quellenbibliothek | Iframe 753 px; nutzbare Seite 738/738 px, Dialog 725/725 px, Dialogkörper 710/710 px; 21 Karten | Kein horizontaler Überlauf |
| Sichtprüfung | Desktop sowie Telefon-/Tabletansicht geprüft | Telefon-/Tabletbreite per Browser-Iframe, keine Hardware-/Browsermatrix |
| Browserprotokoll | 0 Anwendungsfehler im ausgewerteten lokalen Protokoll | Browser-Erweiterungsfehler sind getrennt; kein Beweis für sämtliche Laufzeitpfade |

Die 26 Karten wurden durch Datenprüfungen abgedeckt. Im Browser wurden die oben benannten repräsentativen Kauf-, Video- und Bauteilpfade geprüft; **kein vollständiger 26-von-26-Klicktest wird behauptet**. Die bisherigen 83 Bauteilplätze und Nummernreferenzen wurden durch diese Quellenrecherche nicht um neue OEM-Nummern oder Reparaturwerte erweitert.

## Review-Schleifen 0.4

1. **Günstiger Preis gegen tatsächliche Ausgabe prüfen.** PDF und Print haben beim E46 verschiedene Auflagen. Preise/ISBN/Medium werden pro Angebot gespeichert; gebrauchte Versandkosten werden addiert. Unbestätigte Haynes-Preise erscheinen nicht als feste Kaufangebote.
2. **Baureihenfund gegen Motor prüfen.** Zwei E46-Texte und zwei E46-Videos betreffen andere Motoren. Sie bleiben zurückgestellt. Ein weiterer E36-Videokonflikt betrifft vorne/hinten; auch dort kein Player oder automatischer Bauteilverweis.
3. **Rechte und tatsächliche Importfähigkeit prüfen.** Ein Buchkauf wurde nicht als App-Lizenz behandelt. Eine zunächst zu allgemeine Formulierung zur späteren lokalen Zuordnung wurde präzisiert: neue PDF-Dateien benötigen erst eine Analyse und einen eigenen geprüften Eintrag. Keine fremden neuen Medien kopiert.
4. **Praktische Navigation prüfen.** Nutzer finden Quellen über Modell/Baugruppe/Art/Suche und direkt am Service-/Video-Tab. Eigene Videos bleiben separat. Vor einem Klick existiert kein externer Player; zurückgestellte Videos erhalten auch nach bewusstem Öffnen keinen Direktplayer.
5. **Finalen Build und Layout prüfen.** Alle 61 Tests bestanden. Beide responsiven Ansichten ohne horizontalen Überlauf; Screenshots visuell geprüft. Eine Wiedergabegarantie oder vollständige technische Prüfung der Videos wird nicht aus diesen UI-Tests abgeleitet.

**Heute sinnvoll:** passende Ausgangsquellen wiederfinden, Ausgaben und Preise vergleichen, abweichende Motoren erkennen und das Original gezielt öffnen. **Weiter offen:** genaue Ausführung am Fahrzeug, fachliche Prüfung der Reparatur, dauerhafte Medienverfügbarkeit und kommerzielle Nutzungsrechte. Nächste externe Nutzungsprüfung: fünf Zielnutzer müssen Quelle, Gültigkeitsgrenze und Originalzugang ohne Hilfe finden; Ziel mindestens 4/5 je Aufgabe und 5/5 unterscheiden Referenz von Reparaturfreigabe. Noch nicht durchgeführt.

---

# Historischer Prüfstand 0.3.0

# Prüfbericht und Nutzenbewertung

COLDSTART Garage Atlas 0.3.0 · 29.10.2026.

## Aktueller Prüfstand: Drive-Dokumente

Die neue Fassung erschließt alle 18 Dateien der geprüften Ordneraufnahme: 17 PDFs, 294 PDF-Seiten und ein JPEG. Sie ergänzt die Version 0.2 um ein Quellenregal, sechs Arbeitsübersichten und einen begrenzten Rad-/Gutachtenabgleich. Dies sind eigene technische und aufgabenbezogene Prüfungen; keine externe Nutzerstudie, keine KFZ-Fachfreigabe und kein realer Reparaturversuch. Die historischen Prüfberichte 0.2 und 0.1 folgen unten und sind als frühere Prüfstände zu lesen.

| Aufgabe / Prüfung 0.3 | Messbares Ergebnis | Praktische Aussage und Grenze |
|---|---|---|
| Automatisierte Tests der finalen Bündelung | 51 bestanden, 0 fehlgeschlagen | Enthält die bisherigen Prüfungen und 12 zusätzliche Quellen-/Radabgleich-/JPEG-/Exportprüfungen |
| Vollständige Quellenaufnahme | 18/18 Dateien erfasst; 294 PDF-Seiten und ein Bild | Alle Seiten lokal textlich/OCR erschlossen; entscheidende Stellen visuell kontrolliert, keine vollständige technische Fachprüfung |
| Ordner am Ende erneut lesen | Dieselben 18 IDs, Größen und Änderungsstände | Seit Beginn der Aufnahme keine neuen oder geänderten Dateien im geprüften Ordner |
| Quellenkarten | 18/18 öffnen den richtigen Titel und einen passenden Drive-Originalverweis | Alle Karten mit realen Browserklicks geprüft; externe Drive-Links wurden anhand der Connector-Metadaten zugeordnet, nicht im Browser neu authentifiziert |
| Gutachtennummer suchen | 02-2821-A01-V04 ergibt genau die Rondell-0021-Quelle | Dateiname „8 x 17.pdf“ wird über den tatsächlichen Inhalt auffindbar |
| Modellfilter | PDC + E46: 0 Quellen; PDC + E36: passende Quelle | Herstelleranleitung wird nicht auf den E46 übertragen |
| Neue Arbeitsübersichten | 6/6 richtige Titel und jeweils 4 Planungsabschnitte | PDC, Achse, Verdeck, Leuchtmittel, Gutachtenvorbereitung und Abgas; nicht fachlich freigegebene Vollanleitungen |
| PDC-Varianten | 4/4 getrennte Abschnittsfolgen | Coupé/Limousine PDF 5–7, Touring 7–9, Compact 9–11, Cabrio 11–14, ergänzt um gemeinsame Vorbereitung/Montage/Schaltplan |
| PDC-Funktionsfelder | 6 Felder; IDs gegen Originallegende PDF 16 kontrolliert | A81, H40 sowie B34–B37. Funktionsübersicht, keine neue Verdrahtungsvorlage |
| Mehrfachauswahl | Dateidialog erlaubt mehrere Dateien | Alle 18 Originale und eine abweichende Testkopie gemeinsam ausgewählt |
| Vollständige Dateiidentität | 18 zugeordnet, 1 abgewiesen | Alle Originale mit vollständigem Hash geprüft; veränderte Rondell-Testkopie trotz gleicher Größe nicht übernommen. Drive-Originale unverändert |
| Speicherung nach Neuladen | Rondell-Original erneut als lokal gespeichert erkannt | Browserprofil-bezogen; keine Garantie für private Modi, Speicherbereinigung oder Gerätewechsel |
| JPEG-Original | Geladen, natürliche Größe 1171×1672 px; 0 PDF-Iframes | Bild wird als Bild dargestellt und nicht als PDF behandelt |
| Rondell-Identität mit Demodaten | 6 Merkmale passend; 235/40 + 245/40 als „nicht gelistet“ | Richtige Trennung von Radmaßen und Mischkombination; keine Zulassungsfreigabe |
| Allgemeiner V17-Listentreffer | 225/45 + 245/40 als gelistet, übrige Voraussetzungen ausdrücklich offen | Fahrzeugzeile, Indizes, Achsen und alle Auflagen werden nicht übersprungen |
| Falscher Rondell-Radtyp | 0021-Angaben gegen 0058 ergeben Abweichung | Gleiche Nennbreite und gleicher Durchmesser reichen nicht |
| BBS-Quellenkonflikt | Status bleibt Quellenkonflikt | Passende Maße erzeugen keine Scheinfreigabe |
| Gutachtenfassung | V02 verweist auf PDF 7, V04 auf PDF 14 | Beide V17-Fundstellen getrennt; V04 im nativen PDF-Leser auf Seite 14 visuell geprüft |
| Echter Registerdownload | 18 Datenzeilen, 11 Spalten, alle Hashes identisch zum Register | Tatsächlichen Browserdownload mit CSV-Parser unabhängig kontrolliert |
| Telefon: Quellenregal | Seite 375/375 px, Dialoginhalt 347/347 px; 18 Karten | Kein horizontaler Seiten-/Dialogüberlauf |
| Tablet: Quellenregal | Seite 753/753 px, Dialoginhalt 725/725 px; 18 Karten | Kein horizontaler Seiten-/Dialogüberlauf |
| Telefon: Radabgleich | Seite 375/375 px, Dialog 347/347 px; Vergleichstabelle 311/450 px | Tabelle besitzt eigenen Scrollbereich. Eingaben, Demo und beide Statusanzeigen funktionieren |

Telefon und Tablet wurden in Browser-Iframes mit responsiver Viewportbreite geprüft, nicht auf echter iPhone-/iPad-Hardware. Bei PDF-Einbettung und Seitensprüngen können andere Browser abweichen; der separate Original-/PDF-Browser-Link bleibt als Ausweichweg vorhanden. Die HTML-Datei sollte heruntergeladen und in einem Browser geöffnet werden; reine Dateivorschauen führen JavaScript gegebenenfalls nicht aus.

## Review-Schleifen 0.3

1. **Quelleninhalt vor Dateiname:** Die neutrale Scan-Datei wurde als dbilas-Sammelgutachten identifiziert; „8 x 17.pdf“ als Rondell-0021-Quelle mit zwei Fassungen. Work VS-KF betrifft im tatsächlichen Bericht 5×110. Folge: eigenes Quellenregal mit Typ, Fassung, Produkt-/Fahrzeugbezug und klaren Grenzen.
2. **Widersprüche sichtbar lassen:** BBS-Schlussdatum 2000 und spätere Modelle im selben PDF passen nicht zusammen. Rondell V17 belegt die 235/245-Kombination nicht. Source-/Kombinationskonflikte bleiben sichtbar; keine pauschale Aussage über eine anderweitig bestehende Eintragung.
3. **Abgleich mit echten Benutzereingaben:** Ein Test mit dem typografischen Multiplikationszeichen „×“ deckte eine unnötige Abweichung bei 5×120 auf. Korrektur der Normalisierung; danach stimmen die sechs Demomerkmale überein und der davon getrennte V17-Hinweis bleibt korrekt. Fehlende/ungültige Zahlen werden nicht als vollständiger Abgleich akzeptiert.
4. **Dateifassung praktisch prüfen:** 18 echte Originale plus veränderte gleich große PDF-Testkopie über den Mehrfachdialog geprüft. Ergebnis 18/1. JPEG-Erkennung und Bildanzeige wurden ergänzt und mit dem Original geprüft; ein JPEG wird nicht über einen PDF-Frame geöffnet.
5. **Responsives Layout und Navigation prüfen:** Alle sechs neuen Arbeitsübersichten geöffnet, vier PDC-Varianten verglichen und Quellenregal/Radformular auf Telefon-/Tabletbreite gemessen. Die breitere Radvergleichstabelle scrollt innerhalb ihres eigenen Bereichs. Ein versehentlich mitgeändertes statisches Datum wurde auf 29.10.2026 korrigiert und im neu geladenen Stand kontrolliert.

## Nutzen und offene Freigaben

**Sinnvoll nutzbar:** Dokumente wiederfinden, konkrete Quelle dem richtigen Typ zuordnen, Varianten und Fassungen trennen, eine PDC-/Achsarbeit vorbereiten, offene Gutachtenpunkte sammeln und Originalseiten gezielt öffnen. Die Sammlung ist damit mehr als eine Linkliste: Erschließung, Arbeitskontext und begrenzte prüfbare Vergleichslogik sind hinterlegt.

**Nicht gemessen:** Zeitersparnis, vermiedene Fehlkäufe, Kostenersparnis oder Reparaturqualität an realen Fahrzeugen. Es wurden keine unabhängigen Nutzerinterviews oder Arbeiten am Fahrzeug durchgeführt.

**Weiter offen:** Teile-/Fahrzeugbesichtigung, aktuelle Hersteller-/Prüfstellenbestätigung bei Konflikten, qualifiziert geprüfte Reparaturanweisungen, individuelle Abnahme sowie öffentliche/kommerzielle Nutzungsrechte. Die 18 neuen Originaldateien werden nicht mit dem HTML oder Quellcode-ZIP weiterverteilt. Die vier bestehenden Teilebaugruppen je Baureihe und 83 Teileplätze werden durch das Dokumentenregal nicht zu einem vollständigen Fahrzeugkatalog.

---

# Historischer Prüfstand 0.2.0

# Prüfbericht und Nutzenbewertung

COLDSTART Garage Atlas 0.2.0 · 29.10.2026.

## Aktuelle Handbuchintegration

Dies sind eigene technische und aufgabenbezogene Browserprüfungen. Es gab keine externe KFZ-Fachfreigabe, keine echten Reparaturaufträge und keine gemessene Kostenersparnis. Die nachstehende historische Version-0.1-Dokumentation bleibt als Ausgangsnachweis erhalten; deren zusätzliche Bedienaufgaben wurden nicht sämtlich in 0.2 wiederholt.

| Prüfung 0.2 | Ergebnis | Aussage / Grenze |
|---|---|---|
| Automatisierte Prüfungen der finalen Fassung | 39 bestanden, 0 fehlgeschlagen | Gebündeltes JavaScript, 83 Teile, Quellen/Nummern, Import, Suche, Modelltrennung, 54 Bildpositionen, gültige Seiten, PDF-Dateiprüfung und lokaler SHA-256 |
| Vorderbremse im Handbuchbild | 16/16 richtige Detailansichten | Tatsächliche Klicks im Desktopbrowser |
| Hinterbremse im Handbuchbild | 25/25 richtige Detailansichten | Einschließlich Feststellbremsteile; keine technische Montagefreigabe |
| Ölfiltergehäuse | 6/6 richtige Detailansichten | Echter bereitgestellter Bildausschnitt |
| Thermostat / Wasserpumpe | 5/5 plus 2/2 richtige Detailansichten | Beide Bildvarianten in einer Baugruppe |
| Falsches PDF im E36-Slot | Abgewiesen | Haynes-Datei passt nicht zur erwarteten Größe/Fassung; keine Zuordnung übernommen |
| Echtes E36-PDF | Vollständig per SHA-256 geprüft und lokal gespeichert | Test mit dem 100.257.998-Byte-Upload; keine Verlags-Authentifizierung |
| Echtes historisches Haynes-PDF | Geprüft und lokal gespeichert | Separater Gültigkeitsbereich, keine E36-/E46-Reparaturzuordnung |
| Exakte Originalseite öffnen | PDF 294 / Buch 340-4 sichtbar | Native Chrome-PDF-Anzeige einschließlich richtiger Seitenzahl visuell kontrolliert |
| Seitennavigation | Nächste Seite 295 geöffnet | PDF-Fragment und Dialogtitel stimmen |
| Lokale PDF-Persistenz | Beide Dateien nach Neuladen verfügbar | Gilt für den geprüften Browserkontext; kein Gerätesync |
| Themenfilter | „Thermostat“ liefert passendes kuratiertes Thema | Kein Volltextindex des gesamten Buchs |
| E46-Abgrenzung | Handbuchbild-Schalter verborgen; Service nennt fehlende Abdeckung | Keine Übernahme historischer E36-/E30-Arbeitsfolgen |
| Hintere Bremse | Konfliktwarnung im Service sichtbar | Buch-/Händlerreferenz nicht ungeprüft zu einem Sollwert vereinigt |
| Telefonansicht | 375 px Inhaltsbreite und 375 px Dokumentbreite | Kein horizontaler Seitenüberlauf; Bildpositionen bleiben auf kleinem Bild dicht |
| Tabletansicht | 753 px Inhaltsbreite und 753 px Dokumentbreite | Kein horizontaler Seitenüberlauf |
| Mobile Großansicht nach Korrektur | 720 px Bild in separat verschiebbarem Bereich, Seite weiter 375/375 px | Großansicht ist wirklich größer; eine weit rechts liegende Haltefederposition praktisch ausgewählt, richtige Details, Dialog schließt |
| Konsole | Keine Anwendungsfehler im ausgewerteten Browserprotokoll | Vorhandene Browser-Erweiterungsfehler sind davon getrennt; keine vollständige Browsermatrix |

Der ausgelieferte Startbestand enthält 83 Teileplätze (59 E36 / 24 E46), 19 nummerierte Plätze und 64 offene Plätze. Das sind weiterhin 16 unterschiedliche belegte Nummern. Die 35 zusätzlichen Plätze stammen aus der benannten Bild-/Typerschließung; aus den Bildern wurden keine neuen OEM-Nummern oder Anzugsdrehmomente abgeleitet. Die lokalen Testnotizen und zuvor angelegten Projektpositionen des QA-Browsers sind nicht in der HTML-Startdatei enthalten.

## Review-Schleifen in 0.2

1. **Dokumente nach tatsächlicher Gültigkeit statt Dateiname einordnen.** Ergebnis: Bentley nur US-E36; Haynes ausdrücklich kein E36; beide kein E46. Die Modelltrennung ist in Datenfunktionen, Tests und Oberfläche sichtbar.
2. **Bilder mit bestehenden Teilebegriffen verbinden.** Ergebnis: fünf echte Ausschnitte, 54 Bildpunkte, 35 zusätzliche E36-Typen. Alle 54 Punkte im Browser angeklickt; 54 richtige Detailansichten. Nummernplätze bleiben unverändert 19.
3. **Original-PDF an die richtige Fundstelle binden.** Erster echter Zuordnungsversuch scheiterte, weil die HTTP-Vorschau kein Web Crypto bereitstellt. Korrektur: lokale SHA-256-Alternative mit Tests für Standardvektoren, Block-/Paddinggrenzen und eine Million Bytes. Danach echte Originaldatei vollständig geprüft, gespeichert, PDF 294 sichtbar, Seitensprung 295 und Persistenz nach Neuladen bestanden. Falsche Ausgabe weiterhin abgewiesen. Ein sichtbarer Prüfstatus wurde ergänzt.
4. **Mobile Nutzbarkeit messen.** Die anfängliche „Vergrößern“-Ansicht war auf Telefonbreite mit 285 px schmaler als das Hauptbild mit rund 333 px. Korrektur: 720 px breite Großansicht in einem eigenen horizontal/vertikal verschiebbaren Bereich; 24-px-Bildpunkte. Danach 720 px Bild bei weiterhin 375/375 px Seitenbreite und erfolgreicher Auswahl einer rechten Bildposition. Für dicht belegte Bilder bleibt die Textliste ein verlässlicher ergänzender Zugang.
5. **Inhaltskonflikte nicht verdecken.** Die hintere Scheibenausführung im historischen Buch passt nicht ohne Weiteres zur 328i-Händlerreferenz. Konsequenz: sichtbare Warnung, keine übernommene pauschale Verschleißgrenze. Ausgabe und Fachprüfstatus bleiben am Serviceinhalt sichtbar. Dialoge setzen beim Wechsel ihren Scrollbereich zurück, damit neue Übersichten am Anfang lesbar sind.

## Praktische Bewertung 0.2

**Heute sinnvoll:** Bauteile in vier ausgewählten E36-Baugruppen erkennen, Namen/Referenzen zusammenführen, deutsche Arbeitsübersicht lesen und die Originalfundstelle schnell wiederfinden; eigene Notizen, Videos und Quellen weiter am Teil sammeln. E46 behält den bisherigen ausgewählten Teilebestand, erhält aber keine unpassenden Buchanweisungen.

**Weiter offen:** Vollständige Fahrzeugabdeckung, aktuelle europäische Varianten, individuelle Fahrzeugpassung, öffentlich/kommerziell lizenzierte Bilder, qualifiziert geprüfte Reparaturanweisungen und echter Werkstattbetrieb. Ein vollständiges Kapitelregister ist kein vollständiger Teilekatalog. Browserinteraktionen und Datenvalidierung beweisen keine mechanische Richtigkeit.

**Nächste messbare Freigabe:** Eine konkrete E36-Baugruppe mit tatsächlicher Ausführung und qualifizierter Person prüfen; alle Teile/Quellen und jeder relevante Arbeitsschritt müssen dokumentiert zusammenpassen. Anschließend fünf Zielnutzer die Aufgaben „Teil finden – Quelle öffnen – Gültigkeitsgrenze erklären – Projekt sichern“ ohne Anleitung bearbeiten lassen. Ziel: mindestens 4/5 lösen jede Kernaufgabe; 5/5 unterscheiden Referenz von Passungs-/Reparaturfreigabe. Dieser externe Test wurde noch nicht durchgeführt.

---

# Historischer Prüfstand 0.1.0

# Prüfbericht und Nutzenbewertung

COLDSTART Garage Atlas 0.1.0 · 29.10.2026.

Es handelt sich um eigene technische Prüfungen und aufgabenbasierte Bedienprüfungen, nicht um externe Nutzerinterviews, einen Werkstatttest oder eine KFZ-Fachfreigabe. Keine Zeit- oder Kosteneinsparung wurde an realen Reparaturaufträgen gemessen.

## Messbare Ergebnisse

| Prüfung | Ergebnis | Bedeutung / Grenze |
|---|---|---|
| Automatisierte Prüfungen | 26 bestanden, 0 fehlgeschlagen | Syntax der fertig gebündelten Datei, Datenbeziehungen, Suche, Modelltrennung, Importgrenzen, sichere URLs, CSV und Schema-Seiten |
| E36: sechs Bauteile in vier Zeichnungen anklicken | 24/24 richtige Detailansichten nach Überarbeitung | Prüfung mit realen Klickaktionen im Browser |
| E46: sechs Bauteile in vier Zeichnungen anklicken | 24/24 richtige Detailansichten | Gleicher Ablauf, getrennte Daten |
| Nummernsuche mit Leerzeichen | „34 35 1 164 371“ ergibt einen E46-Treffer | Richtige Detailansicht des vorderen Verschleißsensors geöffnet |
| Suche mit Alias | „Bremsklötze“ ergibt zwei E46-Treffer | Vorne und hinten getrennt; hintere Nummer bleibt offen |
| Fahrzeugwechsel | E36-Scheibenreferenz 34116864060, E46 34116864058 | Unterschiedliche Daten bleiben getrennt; keine Passungsfreigabe |
| Lokale Persistenz | Menge 2 und Notiz nach Neuladen erhalten | Browser-Lokalspeicher getestet; kein geräteübergreifender Sync |
| Ungültiger JSON-Import | 3-stellige Nummer vollständig abgewiesen | Vorheriger Bestand blieb erhalten |
| Gültiger JSON-Import | E36-Schraubenreferenz übernommen | Keine automatische Einbaupositionsprüfung |
| Eigene Service-Unterlage | Text gespeichert, Status „Entwurf“ | Fachlich nicht freigegeben |
| Unvollständige Fachprüfung | Freigabeangabe ohne Prüfer/Datum blockiert | Die App überprüft nicht die tatsächliche Qualifikation des Eingebenden |
| Videoverwaltung | Verknüpfung gespeichert und entfernt; 0 geladene Player vor Klick | Kein reales Drittanbieter-Video abgespielt; Live-Verfügbarkeit und Einbettungsregeln bleiben ungetestet |
| Eigenes Rasterbild mit Hotspot | Ein Punkt gesetzt, gespeichert, nach Neuladen vorhanden | Klick öffnet das zugeordnete Bauteil; Bild war eine selbst erstellte Testgrafik |
| Vollständige Sicherung | Export und Wiederherstellung bestanden | Zwischenzeitlich Menge 3; danach Menge 2, Notiz, Bild/Hotspot und Service-Unterlage aus Sicherung zurück |
| Telefonrahmen 390 px | Tatsächliche Inhaltsbreite 375 px; Dokumentbreite 375 px | Kein horizontaler Überlauf der gesamten Seite; Tabellen haben einen eigenen Scrollbereich |
| Tabletrahmen 768 px | Tatsächliche Inhaltsbreite 753 px; Dokumentbreite 753 px | Kein horizontaler Überlauf der gesamten Seite |
| Mobile Zeichnung | Breite 347 px, Scrollbreite 347 px bei 100 % Zoom | Nach Layoutkorrektur passt die Zeichnung ohne seitliches Scrollen |
| Nummer kopieren | Zwischenablage enthält 34116864058 | Öffentliche E46-Referenz nach dem Klick tatsächlich ausgelesen |
| Bauzustand erfassen | Bauzeit-/Motorangabe sichtbar; Status bleibt „Passung offen“ | Eingabe löst keine automatische Freigabe aus |
| CSV-Datei exportieren | Tatsächliche Datei heruntergeladen | UTF-8/BOM, eine Datenzeile und Menge 2 anhand der exportierten Bytes bestätigt |
| Tastatur | Enter wählt ein SVG-Bauteil; „/“ fokussiert Suche | Keine vollständige Screenreader- oder Barrierefreiheitszertifizierung |

Im Startbestand sind 48 Datenplätze und 19 Nummernreferenzen enthalten. Da einzelne Nummern mehrfach vorkommen, sind das 16 unterschiedliche Nummern. Es gibt 20 dokumentierte Quellen-/Referenzseiten, davon auch Recherche- und Funktionsreferenzen ohne direkten Teilebeleg. Alle 19 nummerierten Datenplätze verweisen auf Original-Händlerangebote. Ein gebündelter Datensicherungstest enthielt anschließend zusätzlich einen importierten Referenzdatensatz und einen Test-Quelleneintrag; diese persönlichen Testdaten sind nicht in die ausgelieferte HTML-Startdatei eingebettet.

## Durchgeführte Review-Schleifen

### 1. Start und Bündelung

Erster Browserlauf: JavaScript wurde nicht ausgeführt. Ursache war die Interpretation von `$$` in einem JavaScript-Ersetzungsstring beim Bündeln, wodurch zwei gleichnamige Deklarationen entstanden. Korrektur: Funktionsersetzungen beim Einsetzen der Quelldateien und abgeschlossener Namensraum. Eine zusätzliche Prüfung kompiliert die tatsächlich ausgelieferte HTML-Skriptfassung. Danach waren Daten und Interaktionen sichtbar.

### 2. Bauteile zuverlässig auswählen

Erster E36-Durchlauf: 18 von 24 Klickzielen öffneten die erwartete Detailansicht. Ringförmige Bauteile und dünne Schrauben hatten zu kleine beziehungsweise hohle Trefferflächen; auch weit entfernte Positionsmarken verschoben den geometrischen Mittelpunkt eines Ziels.

Korrektur: größere transparente Trefferflächen in den Bauteilgruppen und an die Bauteilform angepasste Positionsmarken. Wiederholung: E36 24/24, E46 24/24. Dieses Ergebnis belegt die Bedienverknüpfung, nicht die technische Richtigkeit der Schemazeichnung.

### 3. Änderungen behalten und mobil navigieren

Ein Mengenwert blieb beim ersten Neuladen nicht erhalten. Korrektur: Speicherung bereits beim Eingabeereignis statt nur bei einer späteren Änderungsbestätigung. Wiederholung mit Menge und Notiz bestand.

Die Telefonansicht zeigte zunächst einen unnötigen horizontalen Scrollbereich in der Zeichnung. Korrektur der Mindestbreite; Messung danach 347/347 px. Zusätzlich sind wesentliche mobile Klickflächen größer und ein Rückweg von den Details zur Zeichnung vorhanden. Telefon und Tablet wurden in echten Browser-Iframes mit eigener responsiver Viewportbreite geprüft; dies ist kein Test auf physischer iPhone-/iPad-Hardware.

### 4. Datenerweiterung und Inhaltstrennung

Ungültige und gültige Importdateien wurden über den Dateidialog geprüft. Ein selbst erzeugtes Bild wurde hochgeladen, markiert, gespeichert und wieder geöffnet. Eine vollständige Sicherung wurde exportiert, nach einer Änderung importiert und die wiederhergestellte Menge/Notiz sowie der Bild-Hotspot kontrolliert.

Zusätzliche Teile jenseits von sechs Positionen werden auf Schema-Seiten aufgeteilt. Dies ist automatisiert geprüft, einschließlich richtiger Positionsnummer und Auswahlseite. Ein großer realer Katalogimport mit Tausenden Teilen wurde nicht durchgeführt; dafür gibt es keine Leistungszusage.

## Praktischer Nutzen heute

**Gut nutzbar:** visuell zu einer ausgewählten Baugruppe navigieren, Begriffe zuordnen, eine recherchierte Referenz und ihre Quelle wiederfinden, eigene Unterlagen am Teil bündeln, Projektteile mit offenen Fragen sammeln und weitergeben. Das funktioniert ohne Plattformkonto und ohne laufende Toolkosten. Quellen bleiben sichtbar und fehlende Daten werden nicht durch KI ergänzt.

**Nur bedingt nutzbar:** Vorbereitung einer konkreten Teilebestellung. Die Software kann Referenzen sammeln, prüft aber weder das individuelle Fahrzeug noch Umbauten, Ausstattungen, Ersetzungen oder aktuelle Lieferbarkeit vollständig. Ein Nutzer muss den Abgleich selbst mit geeigneten Quellen vornehmen.

**Noch nicht einsatzbereit:** Reparaturausführung allein mit dieser Anwendung, vollständige E36-/E46-Fahrzeugabdeckung, Werkstattbetrieb mit zentraler Qualitätsfreigabe oder Verkauf als technische Reparaturdatenbank. Dafür fehlen vollständige und lizenzierte Zeichnungen/Daten, belastbare Varianten-/VIN-Zuordnung, qualifiziert geprüfte Serviceinhalte, zentrale Rechteverwaltung und ein Aktualisierungsprozess.

## Priorisierte nächste Ausbaustufe

1. **Eine Baugruppe vollständig freigeben:** für ein dokumentiertes Referenzfahrzeug Originalzeichnung/Rechte, vollständige Teileliste und qualifizierte Serviceprüfung beschaffen. Zuerst vordere Bremse als Datenprüfung; der Nutzer muss keine Bremsarbeit für einen Test durchführen.
2. **Variantenmodell ergänzen:** Baureihe, Karosserie, Motor, Bauzeit, Ausstattung und Umbauzustand als unabhängige Datenfelder; strenge „nicht eindeutig“-Antwort bei fehlenden Informationen. Ein frei eingegebener Bauzeittext darf nicht als Kompatibilitätsprüfung gelten.
3. **Mit Datenanbieter klären:** zugelassene Darstellung, Endnutzerkreis, Datenlieferung/API, Zwischenspeicherung, Bilder, Reparaturtexte, Aktualisierung und Video-/KI-Nutzung. HaynesPro nennt Datenintegrationswege; es wurde keine Anbindung implementiert oder Lizenz zugesichert.
4. **Fünf echte Zielnutzer testen:** ohne Hilfestellung Modell/Baugruppe wählen, Bauteil finden, Quelle nennen, Passungsstatus erklären, Unterlage hinzufügen, Liste sichern und wiederherstellen. Ziel als nächste Managementschwelle: mindestens 4/5 lösen jede Kernaufgabe; 5/5 verstehen, dass eine Referenz keine Freigabe ist. Diese Nutzerprüfung wurde noch nicht durchgeführt.
5. **Erst nach Beleg ausweiten:** weitere Baugruppen, lokale Videodateien, Zugangssystem und Datenbank. Keine vollständige HaynesPro-Alternative aus dem aktuellen Softwarestand ableiten.
