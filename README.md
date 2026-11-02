# COLDSTART-PRO · Garage Atlas · 0.7.0

Teile- und Serviceatlas rund um BMW E36 und E46 mit BMW-Originalzeichnungen, Fahrzeugvarianten, Werkstatt-FAQ und Werkstatt-Assistent. Stand: 02.11.2026.

## Neu in 0.7: alles zusammengeführt · 02.11.2026

0.7 vereint drei getrennt entstandene Stände in einer Fassung:

- **0.6 von ChatGPT** (bisher nur in der Cloudfassung, Quellcode nicht im Repository): Originalkatalog mit Leebmann24-Bildtafeln (E36 BG11: 30 Hauptgruppen, 702 Zeichnungen; E46 AV31: 33 Hauptgruppen, 935 Zeichnungen), anklickbare Positionen, Zoom und Verschieben, Suche über Zeichnungen und Teilepositionen, 810 Fahrzeugvarianten (Typschlüssel) mit 23 zusätzlichen Motorkatalogen, Werkstatt-FAQ & Schwachstellen (14 Themen, 21 Quellen), realistische Fahrzeugbilder, Katalog-Projektliste. Herkunft und Rekonstruktion: [docs/IMPORT_0.6.md](docs/IMPORT_0.6.md).
- **Korrekturen aus 0.4.1**, die 0.6 nicht enthielt (0.6 baute auf 0.4.0 auf): strenge Import- und Sicherungsprüfung mit Rückfrage und Rücksicherung, ehrliche Speicherfehler, Zeichnungen in IndexedDB, Content-Security-Policy, Lesbarkeit, Build-Schutz. Sicherung und Rückfrage umfassen jetzt auch Katalog-Projektliste, Fahrzeugvarianten und Variantenprofile.
- **Werkstatt-Assistent aus 0.5** mit eingebautem Wissen, kostenloser Browser-KI und optional OpenAI. Neu: Sprungknopf **„Originalzeichnungen“**, der den BMW-Katalog mit passender Suche öffnet (z. B. „Radlager“ führt zur Bildtafel Radlagerung). Fehlercodes und Themen sind mit 48 Katalog-Suchbegriffen verknüpft; die KI kann ebenfalls dorthin verlinken.

Katalogdaten und Bilder liegen unter `dist/catalog` und `dist/assets` (4.300 Dateien, 143 MB) und werden mit veröffentlicht. Die vier bisherigen eigenen Ansichten bleiben unter „Eigene Teile & Handbuchbilder“ erreichbar. Rechte: Die Bildtafeln stammen aus dem BMW-Originalkatalog über Leebmann24; nur private Nutzung, siehe [RIGHTS.md](RIGHTS.md).

## Neu in 0.5: Werkstatt-Assistent · 01.11.2026

Unten rechts sitzt ein Chat-Assistent. Er hilft bei der Navigation, erklärt Fehlercodes aus dem Steuergerät und gibt Tipps zu Alltagsproblemen und typischen Arbeiten.

- **Fehlercodes:** Eingaben wie `P0171`, `p 0301` oder `P0171 und P0174` werden erkannt. 16 Einzelcodes und 18 Codegruppen sind mit Dringlichkeit, typischen Ursachen am E36/E46 und Prüfschritten hinterlegt. Für alle anderen Codes erklärt er die Codestruktur (Bereich, genormt oder herstellerspezifisch, Teilsystem) und bietet eine YouTube-Suche an, statt eine Bedeutung zu erfinden.
- **Alltagsprobleme und Anleitungen:** 32 Themen, z. B. „Radlager defekt erkennen“, „Bremsscheiben vorne/hinten wechseln“, Überhitzung, Kühlmittel- und Ölverlust, Thermostat, Wasserpumpe, Bremsflüssigkeit, Zündkerzen, ABS-Leuchte, Fehlerspeicher auslesen sowie Hilfe zu den Bereichen des Atlas.
- **Direkte Sprünge:** Jede Antwort endet mit Knöpfen zur passenden Baugruppe beziehungsweise Explosionszeichnung (E36 mit Handbuchbild), zum Bauteil, zur kuratierten AUTODOC-Anleitung oder zum geprüften Video, zur Handbuch-Arbeitsübersicht oder zum Bentley-Kapitel (E36) und zu einer YouTube-Suche. Baureihe aus der Frage („beim E46“) hat Vorrang vor der Auswahl im Atlas. Zurückgestellte Quellen (andere Motorisierung, Quellenkonflikt) werden nie empfohlen.
- **Offline zuerst:** Ohne Einrichtung antwortet der Assistent nur aus dem eingebauten Wissen und sendet nichts ins Internet.
- **Kostenlose KI im Browser (Open Source):** Unter ⚙ „KI im Browser · kostenlos“ wählen. Ein Open-Source-Sprachmodell läuft dann mit [WebLLM](https://github.com/mlc-ai/web-llm) (Apache-2.0) direkt auf dem Gerät, ohne Konto, Schlüssel oder Server. Modelle: Qwen2.5 1,5B (Standard, etwa 0,9 GB Download, Apache-2.0), Qwen2.5 0,5B (Handy, etwa 0,3 GB, Apache-2.0) und Llama 3.2 3B (PC, etwa 1,8 GB, Llama 3.2 Community License). Der Download startet erst nach ausdrücklicher Bestätigung und bleibt im Browser gespeichert; danach laufen Fragen offline und verlassen das Gerät nicht. Die Bibliothek wird bei Bedarf von jsDelivr geladen und nur ausgeführt, wenn ihr SHA-256 dem geprüften npm-Paket 0.2.86 entspricht. Kleine Modelle irren sich häufiger; ihre Antworten stützen sich deshalb auf das eingebaute Wissen, das als Faktenblock mitgegeben wird. Braucht WebGPU (aktuelles Chrome/Edge am PC, Safari ab Version 26) und genug Grafikspeicher.
- **Optional OpenAI (kostenpflichtig):** Die OpenAI-API hat kein Gratiskontingent; sie wird getrennt vom ChatGPT-Abo vorab bezahlt und nach Verbrauch abgerechnet. Mit eigenem OpenAI-API-Schlüssel (⚙ im Assistenten) beantwortet der Assistent auch freie Fragen. Voreingestellt ist `gpt-5-mini`, wählbar sind `gpt-5-nano`, `gpt-4o-mini` oder eine eigene Modell-ID. Die KI bekommt die gültigen Atlas-Ziele und darf nur über geprüfte Markierungen verlinken; unbekannte Ziele werden verworfen, YouTube-Verweise sind immer Suchen und nie erfundene Video-Adressen. Unter jeder KI-Antwort steht eine Kostenschätzung.
- **Grenzen:** Keine Diagnose, keine Reparaturfreigabe, keine Drehmomente, Füllmengen oder Sollwerte. Die API wird getrennt vom ChatGPT-Abo nach Verbrauch abgerechnet. Der Aufruf direkt aus dem Browser wurde mit nachgebildeten Antworten geprüft, nicht mit einem echten Schlüssel. Bei der Browser-KI wurden Laden, Prüfsumme, Download und Speicherung echt geprüft, die Textausgabe noch nicht auf echter Grafikhardware; siehe [docs/REVIEW.md](docs/REVIEW.md).

## Neu in 0.4.1: Prüfkorrekturen · 30.10.2026

- Datenimport und Sicherung prüfen Datentypen streng (Teilenummern nur als Text mit 11 Ziffern, keine reservierten IDs, keine leeren Einträge). Ein fehlerhaftes Paket wird vollständig und ohne Speicherung abgewiesen; ein bereits gespeicherter fehlerhafter Zusatzkatalog wird beim Start verworfen. In „Daten & eigene Inhalte“ lässt sich der Zusatzkatalog zurücksetzen.
- Eine Sicherung einzuspielen fragt vorher nach, zeigt aktuellen Stand und Sicherung nebeneinander und kann den aktuellen Stand zuerst als Datei sichern. Sicherungen enthalten nur ergänzte Teile statt des ganzen Startbestands; ältere Sicherungen bleiben importierbar.
- Speicherfehler werden nicht mehr durch Erfolgsmeldungen überdeckt.
- Eigene Zeichnungen liegen in IndexedDB statt im 5-MB-Speicher des Browsers; ältere Zeichnungen werden beim ersten Start verschoben. Nach dem Speichern wird die eigene Zeichnung sofort angezeigt.
- Das ausgelieferte HTML enthält eine Content-Security-Policy: nur das eigene Skript (SHA-256-Hash), keine Netzwerkverbindungen, externe Frames nur von youtube-nocookie.com.
- Lesbarkeit: Schrift mindestens 10 px, Kontrast der Nebentexte angehoben, Tabellenkopf der Aktionsspalte beschriftet.
- Videoverknüpfungen entfernen und laden den richtigen Eintrag; die Projektliste führt E36 und E46 getrennt auf; der Seitenkopf-Button heißt „Projektliste als CSV“.
- Build bricht bei übrig gebliebenen Modulanweisungen ab, mehrzeilige Imports funktionieren. `node scripts/check-links.mjs` prüft die externen Verweise (Netzwerk nötig).

## Neu in 0.4: AUTODOC und Kaufquellen

„Anleitungen & Kaufquellen“ enthält 26 kuratierte Originalverweise: zehn AUTODOC-Textanleitungen, acht Videoquellen, sechs Kaufangebote und zwei Modellübersichten. Fünf Quellen sind wegen Motorabweichung oder Quellenkonflikt standardmäßig zurückgestellt. Die geeigneten Baugruppenverweise stehen auch im Service- und Video-Tab; sie bestätigen keine Passung jedes einzelnen Bauteils.

Die kommerziellen Angebote sind Preisaufnahmen vom 29.10.2026. Ein Gebrauchtangebot kann inzwischen verkauft sein. E46-PDF (14. Auflage 2021) und neues Papierbuch (15. Auflage 2025) werden getrennt behandelt. Der Detaildialog zeigt Ausgabe, Rechte und Versandbehandlung vor dem Anbieterlink. Die App löst keine Bestellung aus.

Kuratierte YouTube-Player werden nur auf Klick über `youtube-nocookie.com` geladen; das Original bleibt als Ausweichlink vorhanden. Titel, Beschreibung und/oder die AUTODOC-Zuordnung wurden recherchiert, die vollständigen Filme wurden nicht fachlich abgenommen. Ob YouTube die Einbettung aktuell zulässt, kann sich ändern. Keine fremden Anleitungs-PDFs, Videodateien, Vorschaubilder, Drehmomente oder Wartungsintervalle wurden kopiert. Deine eigenen gespeicherten Texte, Videos und Sicherungen bleiben getrennt.

Kaufempfehlung, geprüfte Preise, Quellenregister und Integrationsgrenzen stehen in [docs/QUELLEN_KAUF_UND_AUTODOC.md](docs/QUELLEN_KAUF_UND_AUTODOC.md). Der editierbare Katalog liegt in `data/lernquellen.json` und `src/learning-data.mjs`; beide gemeinsam pflegen. Die ursprünglichen zwei Handbücher werden dadurch nicht um bereits gekaufte neue Bücher erweitert.

## Git-Entwicklungsstand

Das private Projekt liegt in `mugennoyami/COLDSTART-PRO`. Es soll wegen der ungeklärten öffentlichen Bildrechte privat bleiben. Quellcode, Tests, redaktionelle Daten und die fertig gebaute HTML-Datei werden gemeinsam versioniert. Das bestehende COLDSTART-Website-Projekt bleibt ein separates Repository. Vollständige PDF-/JPEG-Originale, persönliche Browserdaten und Zugangsdaten sind nicht enthalten.

Node.js 24 genügt; es sind keine npm-Abhängigkeiten zu installieren. Hinweise zu Branches, Commits, Pushes und Pull Requests stehen in [CONTRIBUTING.md](CONTRIBUTING.md). Der GitHub-Workflow baut die App, führt die Tests aus und prüft `dist/index.html` gegen den Quellcode. Den Status eines konkreten Commits unter „Actions“ prüfen. GitHub-Commits werden nicht automatisch veröffentlicht. Die private Cloudfassung wird getrennt über Sites bereitgestellt; Zugriff und Startwege stehen in [docs/STARTEN.md](docs/STARTEN.md). Rechte und Grenzen der privaten Arbeitsfassung stehen in [RIGHTS.md](RIGHTS.md).

## Sofort starten

1. Privat online über die Adresse in [docs/STARTEN.md](docs/STARTEN.md) starten. Für Windows alternativ das Repository-ZIP herunterladen, vollständig entpacken und `COLDSTART-PRO-Start.cmd` doppelklicken; die Startdatei öffnet `dist/index.html` im Standardbrowser. `COLDSTART-PRO-Cloud.url` öffnet die private Onlinefassung.
2. E36 oder E46 auswählen, Baugruppe wählen und ein Bauteil in der Zeichnung oder Tabelle anklicken.
3. Referenz und Quelle lesen. Vor einer Teilebestellung die tatsächliche Passung unabhängig prüfen.
4. „Dokumente & Gutachten“ öffnet die 18 neuen Drive-Unterlagen mit Suchfunktion, Arbeitsübersichten und Rad-/Gutachtenabgleich. Originale direkt in Drive öffnen oder gesammelt lokal zuordnen.
5. Für eigene Ergänzungen „Daten & eigene Inhalte“ öffnen. Wichtige Änderungen als vollständige JSON-Sicherung exportieren.

Cloud-Hosting synchronisiert persönliche Projektlisten, Notizen und zugeordnete Originale bisher nicht zwischen Geräten. Daten bleiben browserlokal; die JSON-Sicherung überträgt keine PDF-Dateien und führt parallele Stände nicht zusammen.

Die Einzeldatei braucht weder Installation noch Konto, API-Schlüssel oder kostenpflichtiges Abo. Die optionale KI des Werkstatt-Assistenten läuft entweder kostenlos im Browser (einmaliger Modell-Download, Internet nur dafür) oder über OpenAI mit eigenem, kostenpflichtigem API-Schlüssel. Zeichnungen, Datenbestand, Suche und Projektliste funktionieren ohne Internet. Externe Originalquellen und Videos brauchen eine Internetverbindung. Einige Dateivorschauen führen JavaScript nicht aus; dann die HTML-Datei herunterladen und ausdrücklich mit Chrome, Edge, Firefox oder Safari öffnen. Die Bearbeitung ist auf Desktop am bequemsten. iOS-Dateivorschauen und die Persistenz unter `file://` wurden nicht auf einem echten iPhone geprüft.

## Was funktioniert

- Modellwechsel mit getrennten Teilen und Referenzprofilen.
- Fahrzeugübersicht mit anklickbaren Bereichen, vier ausgewählte Baugruppen je Baureihe.
- Acht schematische Bauteilansichten; 83 Datenplätze, davon 59 E36 und 24 E46.
- Fünf ausgewählte Abbildungsausschnitte aus dem bereitgestellten E36-Handbuch mit 54 anklickbaren Positionen.
- Handbuchbibliothek: zwei genau identifizierte Ausgaben, 13 Themenübersichten und 47 E36-Kapitelanfänge.
- Lokale Zuordnung der Original-PDFs mit vollständigem SHA-256-Abgleich, Seitenaufruf und browserlokaler Speicherung.
- Quellenregal mit 18 zusätzlichen Dokumenten, 294 PDF-Seiten und einem Originalbild; nach Thema, Modellbezug und Begriff filterbar.
- Sechs zusätzliche Arbeitsübersichten: PDC, Hinterachsplanung, Cabrio-Verdeck, Leuchtmittel, Gutachtenvorbereitung und Auspuffnachweis.
- Rad-/Gutachtenabgleich für erfasste Radausführungen, einschließlich getrenntem V17-Mischbereifungshinweis und Fassungswahl für Rondell 0021.
- Mehrfachzuordnung von Originaldateien mit SHA-256-Prüfung, CSV-Quellenregister und direkte Drive-Quellenlinks.
- Verbundene Zeichnung, Teileliste und Detailansicht; Zoom und veränderbarer Schemaabstand.
- Suche nach Bezeichnung, Alias und Nummer mit oder ohne Leerzeichen.
- 19 belegte Nummernreferenzen auf 83 Datenplätzen, 16 verschiedene Nummern. 64 Plätze haben noch keine freigegebene Referenznummer.
- Herkunft und Abrufdatum am Bauteil; belegte Fundstelle und individuelle Passung werden getrennt behandelt.
- Projektliste mit Menge, Notiz und eigener Passungsbestätigung; CSV-Export und druckbare Arbeitskarte.
- Lokal hinterlegbare Texte für Vorbereitung, Ausbau, Einbau und Serviceabschluss; getrennte Erfassung von Quelle, Rechten und dokumentierter Fachprüfung.
- Videoverknüpfungen je Teil: YouTube, Shorts und direkte HTTPS-MP4-/WebM-Dateien. Player werden erst auf Klick geladen.
- Eigene oder lizenzierte PNG-/JPEG-/WebP-Zeichnungen mit selbst gesetzten Hotspots.
- Atomarer JSON-Datenimport, vollständiger Sicherungsexport und Wiederherstellung.
- Tastaturzugang, mobile Anordnung und Rückweg von Details zur Zeichnung.

## Datenumfang ehrlich einordnen

Dies ist **kein vollständiger BMW-Teilekatalog und keine freigegebene Reparaturdatenbank**. Referenzprofile: E36 328i Coupé/M52/BG11 und E46 325i Limousine/M54/AV31. Eine Baureihe umfasst viele weitere Karosserien, Motoren, Bauzeiten, Ausstattungen und Umbauzustände. Sie werden nicht automatisch abgedeckt. Es gibt keinen VIN-Decoder und keine automatische Kompatibilitätsprüfung.

Die eingebauten Vektorbilder sind eigene symbolische Zeichnungen. Sie sind nicht maßstäblich, bilden nicht jede tatsächliche Bauteilgeometrie ab und zeigen keine Montagefolge. Die Positionsnummern sind Atlas-Positionen, keine ETK-Positionsnummern. Der Startbestand enthält Vorderradbremse, Hinterradbremse, Ölfilter/Gehäuse und Wasserpumpe/Thermostat. Weitere Fahrzeugbereiche sind noch nicht modelliert.

19 Nummernreferenzen sind durch manuelle Recherche im Original-Händlerangebot dokumentiert. Das bestätigt die Existenz der Referenz und Fundstelle, **keinen konkreten Teilematch**. Einige Quellen beziehen sich auf andere Karosserien oder Ausstattungen; die Abweichung ist ausdrücklich notiert. Keine Preise, Drehmomente oder Sollwerte werden aus dem Modellnamen generiert.

Für Leebmann-, BMW- oder HaynesPro-Kataloginhalte liegt keine Datenlizenz vor; solche Katalogdaten wurden nicht übernommen. Version 0.2 enthält fünf ausgewählte Bentley-Abbildungsausschnitte aus dem vom Nutzer bereitgestellten PDF als lokale private Arbeitsfassung. Eine kommerzielle oder öffentliche Verwertung dieser Ausschnitte ist nicht freigegeben. Leebmann24 ließ sich im Rechercheabruf nicht auslesen (HTTP 403). HaynesPro dient als Funktionsreferenz, nicht als angeschlossener Anbieter. Vor einem kommerziellen Produkt sind die nötigen Datenrechte und Fachprüfungen zu klären. Es wurden keine Anbieter kontaktiert oder kostenpflichtigen Abos abgeschlossen. Die Site wird privat für das Eigentümerkonto bereitgestellt; keine öffentliche Veröffentlichung.

Es sind **keine fachlich freigegebenen fahrzeugspezifischen Ausbau-/Einbauabläufe** mitgeliefert. Die Serviceansicht enthält einen Dokumentationsablauf, deutsche redaktionelle E36-Arbeitsübersichten mit exakten Original-Fundstellen und bei Bremsen einen Link zu allgemeinen Original-Herstellerunterlagen von Brembo. Diese sind kein fahrzeugspezifischer Ersatz für geeignete Reparaturdaten. Eigene Texte können ergänzt werden. „Fachprüfung vom Nutzer dokumentiert“ ist eine Selbstauskunft mit Prüfer und Datum; die App verifiziert deren Qualität nicht.

## Neu in 0.3: Dokumente und Gutachten

Die 18 Dateien aus `Second Brain (Lesekopie)/20-dokumente/Gutachten etc.` wurden ausschließlich gelesen. Das Quellenregal enthält kurze redaktionelle Einordnungen, Dateifassungen, Gültigkeitsgrenzen und Original-Fundstellen. Die vollständigen 17 PDFs und das JPEG sind nicht im HTML oder Quellcode-ZIP eingebettet. Die ursprüngliche Drive-Organisation und Freigaben bleiben bestehen.

1. **Suchen:** Quelle nach Thema, Fahrzeugbezug, Typ oder Gutachtennummer filtern. Ein Modelltreffer bedeutet nur, dass ein entsprechender Bezug in der Quelle vorkommt; er ist keine individuelle Freigabe.
2. **Gültigkeit lesen:** Dokumentart, Ausgabe und Prüfhinweise stehen vor den Seitenverweisen. Reifenbestätigungen, Festigkeitsberichte, Gutachten und Erfahrungsquellen werden getrennt bezeichnet.
3. **Original öffnen:** „Original in Google Drive öffnen“ nutzt deinen vorhandenen Zugriff. Für Offline-Seitensprünge „Originale gesammelt lokal zuordnen“ verwenden. Mehrere Dateien können in einem Durchgang geprüft werden. Eine veränderte Datei oder andere Edition wird nicht stillschweigend angenommen.
4. **Arbeitsübersicht nutzen:** PDC-Karosserie ausdrücklich auswählen. Coupé/Limousine, Touring, Compact und Cabrio führen zu unterschiedlichen Abschnitten. Das Verdeckkompendium gilt nur für E36-Cabrios. Aus dem Achsleitfaden werden Planungsstellen, keine ungeprüften Freigaben für Schweiß-, Brems- oder Umbauarbeiten.
5. **Radabgleich:** Tatsächlichen Hersteller-Radtyp, Breite, Durchmesser, ET, Lochkreis und Mittenloch übertragen. Nur sechs Merkmale werden mit erfassten Tabellenwerten verglichen. Herstellerzeichen, Ausführung, Fertigungsdatum, Fahrzeugzeile, Reifenindizes, Lasten, Freigängigkeit und Abnahme bleiben gesondert zu prüfen. Eingaben bleiben beim Ansichtswechsel erhalten und werden beim Neuladen verworfen. Das Demobeispiel ist kein verifizierter Fahrzeugzustand.

**Wichtige Funde:** „8 x 17.pdf“ ist das Rondell-0021-/R.O.D.-21-807-Dokument für 8J×17 ET40 und enthält V02/V04. Die Mischpaarung 235/40 R17 vorn mit 245/40 R17 hinten ist in beiden V17-Listen nicht enthalten. Ein anderer Nachweis oder eine individuelle Abnahme kann existieren. Rondell 0058 / Typ 58 807 / ET35 ist ein anderer Radtyp. Beim BBS-RC090-PDF widersprechen sich Schlussdatierung und später genannte Fahrzeugmodelle. Beim Work-VS-KF-Bericht ist der tatsächlich beschriebene Lochkreis 5×110; er liefert keine direkte BMW-5×120-Zuordnung. Diese Punkte sind in der Oberfläche ausdrücklich markiert.

**Sicherung:** Die Projekt-JSON-Sicherung enthält Katalog, eigene Notizen, Projektliste, eigene Baugruppenbilder/Hotspots, Serviceinhalte und Videoverknüpfungen. Die PDF-/JPEG-Originale der Dokumentenbibliothek liegen getrennt in IndexedDB und sind nicht Teil dieser JSON-Datei. Diese Originale selbst sichern und bei Browser- oder Gerätewechsel erneut zuordnen. Bei blockiertem oder vollem Speicher ist nur Sitzungsspeicherung möglich und wird angezeigt. Das ist kein Zugriffsschutz für gemeinsam genutzte Browserprofile.

Das Quellenregister kann im Atlas als CSV exportiert werden. Im Quellcodepaket stehen die redaktionellen Datensätze in `data/dokumente.json` und die vollständige Auswertung in `docs/DOKUMENTENAUSWERTUNG.md`. Eine öffentliche oder kommerzielle Nutzung der Originalinhalte ist damit nicht freigegeben.

## Handbücher sinnvoll verwenden

1. In E36 eine Baugruppe wählen und „Handbuchbild“ öffnen. Bauteilposition anklicken; „Vergrößern“ öffnet eine größere Ansicht. Nicht abgebildete Teile sind weiter über die Liste erreichbar.
2. Im Service-Tab „Arbeitsübersicht & Fundstellen“ öffnen. Deutsche Zusammenfassung, Modellgrenzen und Original-Fundstellen bleiben getrennt sichtbar.
3. In „Meine Handbücher“ die passende Original-PDF einmal lokal auswählen. Dateigröße, PDF-Kennung und der SHA-256 des gesamten Inhalts werden geprüft. Eine andere Edition wird abgewiesen, damit feste Seitenverweise nicht stillschweigend verrutschen.
4. Danach öffnet ein Fundstellenklick die passende PDF-Seite. Die native Browser-PDF-Anzeige übernimmt Suche und Zoom. Falls die Einbettung oder der Seitensprung nicht unterstützt wird, „Im PDF-Browser öffnen“ nutzen und die angezeigte PDF-Seite eingeben.
5. Original-PDFs zusätzlich selbst aufbewahren. Die Projekt-JSON-Sicherung enthält **keine PDF-Binärdateien**. Nach Browserwechsel oder Löschen von Websitedaten erneut zuordnen.

**Ausgaben:** Bentley, *BMW 3 Series Service Manual*, Copyright 1999, Redaktionsschluss 01/1999, 759 PDF-Seiten, ISBN 0-8376-0326-9; US-E36 1992–1998 einschließlich 328i/M52. Europäische Varianten sind damit nicht pauschal bestätigt. Das zweite Buch, Haynes *BMW 3- & 5-Series*, Copyright 1997, 228 PDF-Seiten, ISBN 1 85960 236 3, schließt den E36 ausdrücklich aus. Es dient ausschließlich als historischer allgemeiner Hintergrund. **Keines der beiden Bücher deckt den E46 ab.**

**Erkannter Quellenkonflikt:** Die Angaben zur hinteren Scheibenausführung und Verschleißgrenze im Bentley-Buch stimmen nicht ohne Weiteres mit der vorhandenen 328i-Händlerreferenz für eine belüftete Scheibe überein. Ursache beziehungsweise genaue Variantenabgrenzung bleiben ungeklärt. Keine Grenzwerte oder Drehmomente wurden deshalb als allgemeingültige EU-328i-Daten übernommen. Auch ältere pauschale Kaufregeln zum Wasserpumpen-Laufrad wurden nicht als aktuelle Empfehlung eingebaut.

Die 35 neuen E36-Datenplätze benennen in den Bildern erkennbare Bauteiltypen; ihre OEM-Nummern bleiben offen. Illustrationspositionen sind keine ETK-Nummern und keine Freigabe für eine Sattelüberholung. Der Atlas bleibt auf vier ausgewählte Baugruppen beschränkt. Die 47 Kapitelverweise erweitern den Zugang zum vorhandenen Buch, nicht die Teilekatalogabdeckung.

Die Handbuchauswertung steht in `docs/HANDBUCH_AUSWERTUNG.md`. Der ursprüngliche englische Text wird durch kurze deutsche redaktionelle Übersichten ergänzt, nicht durch eine vollständige fachlich geprüfte Übersetzung ersetzt. Die Originale sind nicht im Quellcodepaket enthalten. Ausgewählte Ausschnitte enthalten keine für das Tool unnötigen persönlichen Lizenzwasserzeichen.

## Daten und Privatsphäre

Es gibt keinen Backendserver und keine Telemetrie. Wählst du im Werkstatt-Assistenten „KI im Browser“, lädt der Browser nach Rückfrage einmalig die WebLLM-Bibliothek (cdn.jsdelivr.net) und das Modell (huggingface.co, raw.githubusercontent.com) und speichert sie in IndexedDB; Fragen werden lokal verarbeitet und nicht gesendet. Wählst du „OpenAI“ und hinterlegst einen eigenen API-Schlüssel, gehen beim Absenden einer Frage diese Frage, die letzten Chatnachrichten, Baureihe, Baugruppe und Bauteil der aktuellen Ansicht, Bauzeit und Motor aus „Bauzustand“ (falls erfasst) sowie die Liste der Atlas-Verweise direkt vom Browser an `api.openai.com`. Projektliste, Notizen, Dokumente, Bilder und Sicherungen werden nie gesendet. Der Schlüssel liegt unverschlüsselt im Browserspeicher (wahlweise nur für die Sitzung) und ist nie Teil der Projekt-Sicherung; der Chatverlauf verschwindet beim Neuladen. Die Content-Security-Policy erlaubt Netzwerkverbindungen ausschließlich zu `api.openai.com`, `cdn.jsdelivr.net`, Hugging Face (`huggingface.co`, `*.hf.co`) und `raw.githubusercontent.com`; Skripte nur das eigene (per Hash) sowie das geprüfte WebLLM-Modul als Blob, WebAssembly nur für die Modelle. Die Software lädt im Ausgangszustand keine externen Skripte, Schriftdateien oder Bilder. Ein Quellenklick öffnet die externe Website. Ein Klick auf „Video laden“ verbindet den Browser mit dem Videoanbieter. Diese Quellen liegen außerhalb der Kontrolle der App.

Persönliche Ergänzungen werden unverschlüsselt im lokalen Browserspeicher gehalten; zugeordnete PDFs und eigene Zeichnungen getrennt in IndexedDB. Falls dessen Nutzung scheitert, bleibt die Datei nur für die Sitzung verfügbar und wird entsprechend gekennzeichnet. Auf gemeinsam verwendeten Browserprofilen besteht kein Zugriffsschutz. Ein Browserwechsel, privater Modus, Speicherlimit oder Löschen von Websitedaten kann Ergänzungen entfernen. Eine HTML-Datei allein enthält keine später gespeicherten Ergänzungen; dafür ist die vollständige JSON-Sicherung erforderlich. Eine Sicherung kann Bauzustand, Notizen, Bilder und Texte enthalten und sollte nicht öffentlich geteilt werden. Die App benötigt keine vollständige VIN, Kennzeichen oder Kundenidentität.

Bei vollem oder blockiertem Speicher bleibt der aktuelle Stand im Arbeitsspeicher und eine sichtbare Warnung verlangt einen Export. Pro Bild sind 2 MB zulässig; Bilder liegen in IndexedDB, im Browserspeicher stehen nur Metadaten und Hotspots. Ohne IndexedDB (etwa in manchen privaten Modi) bleibt ein Bild im Browserspeicher, dessen Limit dann früh erreicht werden kann. Backups werden bis 30 MB akzeptiert. Es gibt keine Synchronisierung zwischen Geräten und keine Mehrbenutzerverwaltung.

## Entwickeln

Keine Abhängigkeiten installieren. Es werden nur eingebaute Node-Funktionen verwendet. Externe Verweise prüft `node scripts/check-links.mjs` (Netzwerk nötig, nicht Teil der Tests; gesperrte Shops gelten als nicht prüfbar, nicht als tot).

```bash
node build.mjs
node --test tests/*.test.mjs
```

`build.mjs` bündelt die lesbaren Quelldateien in eine einzige HTML-Datei. Die Tests prüfen ausdrücklich auch die fertig gebündelte Datei.

```text
src/index.html       Anwendungsstruktur
src/style.css        COLDSTART-Design und responsive Regeln
src/core.mjs         Suche, Datenvalidierung, CSV, URL- und Videoprüfung
src/documents-data.mjs  18 Drive-Quellen, Fundstellen und Arbeitsübersichten
src/documents-core.mjs  Filter, Registerexport und begrenzter Radabgleich
src/documents-ui.mjs    Quellenregal, PDC-Auswahl und Dokumentenbedienung
src/manual-data.mjs  Ausgaben, Themen, Fundstellen und Bildpositionen
src/manual-core.mjs  Lokaler PDF-/SHA-256-Abgleich
src/manual-ui.mjs    Handbuchbibliothek, Bildansicht und PDF-Leser
src/manual-assets.mjs Eingebettete ausgewählte Abbildungsausschnitte
assets/manuals/      Dieselben fünf Ausschnitte als bearbeitbare PNGs
src/data.mjs         Startbestand mit Quellen
src/draw.mjs         Eigene SVG-Schemata und Fahrzeugansicht
src/app.mjs          Bedienlogik, Speicherung, Editoren, Sicherung
src/assistant-data.mjs Wissensbasis des Assistenten: Fehlercodes, Themen, Modelle
src/assistant-core.mjs Codeerkennung, Themensuche, Verweisprüfung, OpenAI-Anfrage
src/assistant-ui.mjs   Chatfenster, Einstellungen, Navigation aus dem Chat
data/startbestand.json  Importierbarer Ausgangsdatenbestand
data/manual-index.json  Zwei ursprüngliche Handbücher und Seitenindex
data/dokumente.json    18 zusätzliche Quellen und Arbeitsübersichten
tests/               Automatisierte Tests und Import-/Bildbeispiele
docs/                Datenformat, Prüfbericht und Ausbauplan
dist/index.html      Ausführbare Einzeldatei
```

Anpassung des Startbestands: `src/data.mjs` bearbeiten, Quelle dokumentieren und neu bauen. Der Datenimport aktualisiert Teile über die Kombination aus Baureihe und Teile-ID; gleiche IDs in E36 und E46 sind getrennt. Bei mehr als sechs Teilen pro Baugruppe werden Schema-Seiten angeboten. Ein Auswahlklick in der Tabelle oder Suche öffnet die passende Seite.

Die Architektur bleibt bewusst lokal. Eine echte Datenanbieter-Integration benötigt anschließend einen lizenzierten Adapter und regelmäßig einen Server, damit Anbieterschlüssel nicht im Browser veröffentlicht werden. Zugangsdaten gehören niemals in die HTML-Datei.

## Empfohlene nächste Freigabe

Zuerst den Arbeitsablauf mit einem dokumentierten E36-Bauzustand und einer fachkundigen Person prüfen. Für eine einzige konkrete Baugruppe Lizenz/Originalzeichnung, vollständige Variantenzuordnung und einen fachlich geprüften Serviceablauf beschaffen. Erst danach Tiefe und Baureihenabdeckung erweitern. Ein vollständiges Fahrzeug digital abzubilden ist überwiegend eine Daten- und Qualitätsaufgabe; die Oberfläche allein löst sie nicht.
