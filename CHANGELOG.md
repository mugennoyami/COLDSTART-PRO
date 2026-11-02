# Änderungsverlauf

## 0.7.0 · 02.11.2026

Zusammenführung von 0.6 (ChatGPT), den Korrekturen aus 0.4.1 und dem Werkstatt-Assistenten aus 0.5.

- 0.6 aus der veröffentlichten Seite rekonstruiert (Build bytegenau identisch) und mit allen 4.300 Laufzeitdateien gesichert; siehe `docs/IMPORT_0.6.md`.
- Korrekturen aus 0.4.1 in 0.6 übernommen; Sicherung, Rückfrage und Rücksicherung um Katalog-Projektliste, Fahrzeugvarianten und Variantenprofile erweitert.
- Content-Security-Policy für den Katalog erweitert: Bilder und Katalogdaten der eigenen Seite (`'self'`).
- Werkstatt-Assistent: neuer Verweis `[[katalog:MODELL:Suchbegriff]]` öffnet die BMW-Originalzeichnungen mit Suche; 48 Suchbegriffe an Fehlercodes und Themen; eigene Ansichten heißen im Chat „Eigene Ansicht“; Sprung in eine eigene Ansicht schaltet den Katalog korrekt aus, auch beim Wechsel der Baureihe.
- `.gitignore` versioniert `dist/catalog` und `dist/assets`.
- 140 automatisierte Tests.

## 0.6.0 · 30.10.2026 (ChatGPT, nachträglich importiert)

Von ChatGPT außerhalb des Repositorys entwickelt und direkt veröffentlicht, auf Basis von 0.4.0. Originalkatalog (Leebmann24, Stand 30.10.2026) mit Zoom und Positionen, 810 Fahrzeugvarianten, Werkstatt-FAQ, realistische Fahrzeugbilder, Katalog-Projektliste. Änderungsverlauf und Tests von 0.6 lagen nicht vor.

## 0.5.0 · 01.11.2026

Werkstatt-Assistent (Chat) mit eingebautem Wissen, kostenloser Open-Source-KI im Browser und optionaler OpenAI-API.

- Chatfenster unten rechts, auf dem Handy als Vollbild. Tastatur: Enter sendet, Umschalt+Enter neue Zeile, Esc schließt.
- Eingebautes Wissen ohne Internet: 16 Fehlercodes und 18 Codegruppen mit Dringlichkeit, Ursachen und Prüfschritten; Strukturerklärung für alle übrigen OBD-Codes; Hinweis auf BMW-Hex-Fehlerorte; 32 Themen zu Diagnose, Arbeiten und Bedienung des Atlas.
- Antworten mit Sprungknöpfen zu Baugruppe/Zeichnung, Bauteil, kuratierter Anleitung oder geprüftem Video, Handbuch-Arbeitsübersicht, Bentley-Kapitel, Arbeitsübersicht aus „Dokumente & Gutachten“, App-Bereichen und YouTube-Suche. Alle Ziele werden gegen die Daten geprüft; zurückgestellte Quellen sind ausgeschlossen.
- Kostenlose KI im Browser mit WebLLM 0.2.86 (github.com/mlc-ai/web-llm, Apache-2.0): Qwen2.5 1,5B (Standard), Qwen2.5 0,5B (Handy), Llama 3.2 3B (PC). Bibliothek wird bei Bedarf von jsDelivr geladen und nur nach erfolgreichem SHA-256-Abgleich ausgeführt; Modelldownload erst nach Rückfrage, Speicherung in IndexedDB, automatische 32-Bit-Fassung ohne `shader-f16`. Kurze, faktengestützte Anweisung für 4096 Token Kontext; Antworten erscheinen beim Mitschreiben; Stopp-Knopf. Ohne WebGPU antwortet der Assistent aus dem eingebauten Wissen.
- Einstellungen „Wer antwortet?“: eingebautes Wissen, KI im Browser (kostenlos) oder OpenAI (kostenpflichtig). Ältere Einstellungen werden übernommen.
- Optional KI über die OpenAI Chat Completions API mit eigenem Schlüssel; Modelle `gpt-5-mini` (Standard), `gpt-5-nano`, `gpt-4o-mini` oder eigene ID. Verweise der KI laufen über dieselbe Prüfung. Bei abgelehnten Optionen ein zweiter, schlichter Versuch; verständliche Fehlermeldungen (Schlüssel, Guthaben, Modell, Verbindung); Kostenschätzung je Antwort.
- Schlüssel und Einstellungen in eigenem Speicherbereich (wahlweise nur Sitzung), nie in der Projekt-Sicherung. Topbar zeigt „KI-Chat aktiv“, solange Fragen an OpenAI gehen.
- Content-Security-Policy: `connect-src` von `'none'` auf `api.openai.com`, `cdn.jsdelivr.net`, Hugging Face und `raw.githubusercontent.com`; `script-src` zusätzlich `blob:` und `'wasm-unsafe-eval'` für die Browser-KI. Alle anderen Ziele bleiben blockiert.
- Hilfe und „Daten & eigene Inhalte“ erklären den Assistenten. Linkprüfung erfasst die neuen festen Links.
- 138 automatisierte Tests (108 bisherige, 30 neue).

## 0.4.1 · 30.10.2026

Korrekturen aus einer Prüfung des Stands 0.4.0.

- Import und Sicherung: strenge Typprüfung (u. a. Teilenummer als JSON-Zahl, numerische oder reservierte IDs, leere Einträge). Vorher konnte ein solches Paket gespeichert werden und die betroffene Baugruppe nach dem Neuladen leer lassen. Der Import ist jetzt transaktional, ein beschädigter gespeicherter Zusatzkatalog wird beim Start verworfen, „Zusatzkatalog zurücksetzen“ ergänzt.
- Sicherung einspielen fragt nach, zeigt aktuellen Stand und Sicherung und kann den aktuellen Stand vorher sichern. Sicherungen enthalten nur ergänzte Teile; Startbestand wird beim Import nicht mehr als Kopie eingefroren.
- Speichern meldet Fehler ehrlich (kein „gespeichert“ bei vollem Speicher).
- Eigene Zeichnungen liegen in IndexedDB; Migration alter Zeichnungen beim Start; Rückfall auf den Browserspeicher ohne IndexedDB. Die gespeicherte Zeichnung wird sofort angezeigt, auch bei E36 nach dem Neuladen.
- Content-Security-Policy mit Skript-Hash im gebauten HTML.
- Videos: richtiger Eintrag beim Entfernen und Laden. Gespeicherte Daten werden beim Laden bereinigt. Totes Feld `checks` entfernt.
- Projektliste nach Baureihe gruppiert; Button „Projektliste als CSV“; Arbeitskarte nennt die gewählte Baureihe.
- Lesbarkeit: Mindestschrift 10 px, Kontrast der Nebentexte (u. a. Quellenhinweise, Abzeichen, Hinweise zu zurückgestellten Quellen) auf mindestens 4,5:1, beschriftete Tabellenkopfzelle.
- Lernquellen zeigen Datumsangaben als TT.MM.JJJJ; Radabgleich akzeptiert Einheiten („40 mm“, „8,0 J“); das Dokumentenregister nutzt dieselbe CSV-Maskierung wie die Projektliste.
- Build: mehrzeilige Imports, Abbruch bei übrig gebliebenen Modulanweisungen. `docs/test-results.tap` entfernt (war veraltet und nicht reproduzierbar). `scripts/check-links.mjs` für die externen Verweise.
- 108 automatisierte Tests (61 bisherige, 47 neue).

## 0.4.0 · 29.10.2026

- Kuratierte AUTODOC-Originalquellen und aktuelle Kaufangebote mit Ausgabe, Preisstand und Nutzungsgrenzen.
- Quellenbibliothek mit Modell-, Baugruppen-, Medien- und Textfilter sowie sichtbar schaltbaren Ausschlüssen.
- Kontextverweise im Service-/Video-Tab; YouTube-Player erst nach ausdrücklichem Klick.
- E46-Ölvideo für 1,9 l und Diesel-Thermostatquellen nicht am 325i/M54 empfehlen; widersprüchliche E36-Achsangabe zurückstellen.
- Persönliche Videoverknüpfungen und Datenformat 1 bleiben erhalten.

## 0.3.0 · 29.10.2026

- Quellenregal mit 18 Dokumenten, Such-/Modellfiltern und genauen Fundstellen.
- Sechs Arbeitsübersichten, karosseriespezifische PDC-Auswahl und begrenzter Rad-/Gutachtenabgleich.
- Lokale Mehrfachzuordnung mit vollständiger SHA-256-Prüfung, JPEG-Anzeige und CSV-Register.
- Bestehender Teileatlas, Handbuchansichten, Projektliste und Dateneditor erhalten.
- 51 automatisierte Tests; dokumentierte Browserprüfung im Prüfbericht.

### GitHub-Import am 29.10.2026

- Entwicklungsstand auf dem Branch `main` von `mugennoyami/COLDSTART-PRO`; der vorhandene Initial-Commit des Zielrepositorys bleibt erhalten. Die zuvor erstellte lokale Bundle-Historie ist ein historischer Export.
- Build-/Test-Workflow für GitHub Actions mit nur lesendem Repository-Zugriff, festgelegten Action-Commits und Node.js 24.
- Regeln für Git-Dateien, Rechtehinweis und Anleitung für Branches, Commits und Pull Requests.
- Der Import verändert keine Anwendungsfunktion und veröffentlicht keine Website.

## Startwege und private Bereitstellung · 29.10.2026

- Private Sites-Bereitstellung für das Eigentümerkonto vorbereitet; GitHub bleibt führende Codequelle.
- Windows-Startdatei für die lokale HTML-Fassung und Internetverknüpfung zur festen Cloudadresse ergänzt.
- Start-, Sicherungs-, Gerätewechsel- und Updateanleitung ergänzt; browserlokale Daten bleiben ausdrücklich ohne automatische Gerätesynchronisierung.
- Kein nativer EXE-Installer, kein Offline-Service-Worker und keine neue Server-Datenbank.
