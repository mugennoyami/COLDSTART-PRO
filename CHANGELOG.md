# Änderungsverlauf

## 0.5.0 · 01.11.2026

Werkstatt-Assistent (Chat) mit eingebautem Wissen und optionaler KI über die OpenAI-API.

- Chatfenster unten rechts, auf dem Handy als Vollbild. Tastatur: Enter sendet, Umschalt+Enter neue Zeile, Esc schließt.
- Eingebautes Wissen ohne Internet: 16 Fehlercodes und 18 Codegruppen mit Dringlichkeit, Ursachen und Prüfschritten; Strukturerklärung für alle übrigen OBD-Codes; Hinweis auf BMW-Hex-Fehlerorte; 32 Themen zu Diagnose, Arbeiten und Bedienung des Atlas.
- Antworten mit Sprungknöpfen zu Baugruppe/Zeichnung, Bauteil, kuratierter Anleitung oder geprüftem Video, Handbuch-Arbeitsübersicht, Bentley-Kapitel, Arbeitsübersicht aus „Dokumente & Gutachten“, App-Bereichen und YouTube-Suche. Alle Ziele werden gegen die Daten geprüft; zurückgestellte Quellen sind ausgeschlossen.
- Optional KI über die OpenAI Chat Completions API mit eigenem Schlüssel; Modelle `gpt-5-mini` (Standard), `gpt-5-nano`, `gpt-4o-mini` oder eigene ID. Verweise der KI laufen über dieselbe Prüfung. Bei abgelehnten Optionen ein zweiter, schlichter Versuch; verständliche Fehlermeldungen (Schlüssel, Guthaben, Modell, Verbindung); Kostenschätzung je Antwort.
- Schlüssel und Einstellungen in eigenem Speicherbereich (wahlweise nur Sitzung), nie in der Projekt-Sicherung. Topbar zeigt „KI-Chat aktiv“, solange Fragen an OpenAI gehen.
- Content-Security-Policy: `connect-src` von `'none'` auf `https://api.openai.com` geändert; alle anderen Ziele bleiben blockiert.
- Hilfe und „Daten & eigene Inhalte“ erklären den Assistenten. Linkprüfung erfasst die neuen festen Links.
- 133 automatisierte Tests (108 bisherige, 25 neue).

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
