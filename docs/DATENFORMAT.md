# Datenformat und Inhaltsworkflow

Stand 29.10.2026 · Anwendung 0.3.0; Import-/Sicherungsschema weiterhin Version 1.

## Importierbares Datenpaket

```json
{
  "schemaVersion": 1,
  "sources": [{
    "id": "meine-quelle",
    "title": "Herausgeber · Dokumenttitel",
    "url": "https://example.org/quellennachweis",
    "accessed": "29.10.2026",
    "note": "Gültigkeitsbereich und Grenzen"
  }],
  "parts": [{
    "id": "front-disc",
    "model": "E36",
    "group": "front",
    "kind": "disc",
    "name": "Bremsscheibe, vorne",
    "number": null,
    "sourceId": null,
    "aliases": "Bremsscheibe Bremse Rotor",
    "note": "Quelle und individuelle Passung noch nicht bestätigt."
  }]
}
```

Das Beispiel erfindet ausdrücklich keine Teilenummer. Tatsächliche Nummern sind elfstellige Zeichenketten, keine JSON-Zahlen. So bleiben mögliche führende Nullen erhalten. Eine Nummer erfordert eine im selben Paket enthaltene Quelle. Die Quelle muss eine HTTPS-Adresse ohne eingebettete Zugangsdaten haben.

Erlaubte Baureihen: `E36`, `E46`. Erlaubte Baugruppen: `front` (vordere Bremse), `rear` (hintere Bremse), `oil` (Ölfilter/Gehäuse), `cool` (Wasserpumpe/Thermostat). Version 1 bildet vier kuratierte Baugruppen ab; für eine vollständige ETK-Hierarchie ist das Schema um Baureihenvarianten, Katalogtafeln und dynamische Baugruppen zu erweitern.

`kind` wählt eine symbolische Grafik: `disc`, `caliper`, `pad`, `sensor`, `shield`, `bolt`, `cap`, `filter`, `ring`, `housing`, `gasket`, `switch`, `pump`, `flange`, `thermostat`, `pulley`. Andere Typen werden zu `housing` normalisiert. Das ist eine Darstellungsentscheidung, kein technischer Teilematch. Eigene lizenzierte Zeichnungen sind für genaue Abbildungen vorgesehen.

Grenzen: 5.000 Teile und 2.000 Quellen pro Paket, 30 MB Dateigröße. Die Grenzen sind Eingabeschutz, keine Leistungszusage für große Kataloge. Dubletten derselben Modell-/Teile-ID innerhalb eines Pakets werden abgewiesen. Bereits vorhandene IDs werden durch einen gültigen Import aktualisiert; andere Datensätze bleiben erhalten. Ungültige Pakete werden vor der Übernahme verworfen. Ein Import kann den Startbestand fachlich verändern; vor produktivem Einsatz ist daher eine zusätzliche redaktionelle Freigabe nötig.

`data/startbestand.json` ist der vollständige mitgelieferte Datenstand. `tests/fixtures/import-beispiel.json` ergänzt eine einzelne recherchierte Schraubenreferenz. `import-zusatzteil.json` demonstriert eine zusätzliche Schema-Seite, ohne eine konkrete Einbauposition freizugeben. `import-ungueltig.json` ist ausdrücklich ein negativer Testfall und muss abgewiesen werden.

## Bilder und Hotspots

Eigene Zeichnung über „Daten & eigene Inhalte“ hochladen. PNG, JPEG oder WebP bis 2 MB; kein SVG-/HTML-Import. Originaldatei, Lizenz und technische Prüfung außerhalb der App aufbewahren. Im Bildeditor Quelle/Lizenz dokumentieren, Bauteil wählen und die Position anklicken. Die Koordinaten werden relativ zum Bild in Prozent gespeichert. Ein bestehender Punkt kann erneut gesetzt oder entfernt werden. Nicht markierte Teile bleiben in der Tabelle erreichbar.

Das Programm behauptet keine automatische Bilderkennung. Die Zuordnung ist eine Eingabe des Nutzers. Rechtebestätigung und fachliche Richtigkeit sind unterschiedliche Aufgaben. Ein Nutzungsrecht an einem Bild bestätigt nicht dessen Fahrzeugbezug. Beim Wechsel zurück zum eigenen Schema wird nur die lokale Bildverknüpfung dieser Baugruppe entfernt; die Ursprungsdatei auf dem Computer wird nicht verändert. Vor größeren Änderungen sichern.

## Serviceinhalte

Unterlage am Teil im Service-Tab hinterlegen. Felder: Titel, HTTPS-Quelle, Vorbereitung, Ausbau, Einbau, Service/Abschluss, Nutzungsrechte, fachlicher Prüfer, Prüfdatum. Ohne vollständig dokumentierte Rechte und Fachprüfung bleibt der Status Entwurf. Auch ein vollständig ausgefüllter Datensatz ist eine Nutzerdokumentation und kein Gütesiegel von COLDSTART.

Ein künftiger Redaktionsprozess sollte Quellenvertrag, Baureihe/Bauzeit/Motor, relevante Ausstattungsmerkmale, Umbauzustand, Quellenversion, fachliche Freigabe, Änderungsprotokoll und Rückruf einer fehlerhaften Anleitung getrennt erfassen. Diese Version besitzt keine zentrale Inhaltsmoderation und keine serverseitig geschützte Freigaberolle. Solche Kontrollen sind vor einem Verkauf von Reparaturinformationen nötig.

Keine technischen Sollwerte aus einem allgemeinen KI-Modell übernehmen. Keine Werte aus einem Teilebild ableiten. Bei Bremsen sind passende Fachkenntnis, Ausrüstung und fahrzeugbezogene Reparaturdaten Voraussetzung. Die Anwendung enthält keine KI-Diagnosefunktion.

## Videos

Unterstützt werden öffentliche YouTube-/Shorts-URLs und direkte HTTPS-Links auf `.mp4` oder `.webm`. Keine Anmeldung, kein Upload zum Anbieter und keine Videodatei-Kopie durch die App. Die Wiedergabe von YouTube wird erst auf Klick über `youtube-nocookie.com` eingebettet; Direktdateien werden erst dann einem HTML-Videoplayer zugewiesen. Die Anbieter können Einbettung oder Abruf beschränken. Eine URL-Prüfung kann Verfügbarkeit, Nutzungsrechte oder fachliche Eignung nicht garantieren.

Noch nicht enthalten: lokale Videodateiablage, Videokonvertierung, Untertitelverwaltung, Zugangsschutz oder kommerzielles Videohosting. Diese Funktionen erfordern eine getrennte Produktentscheidung.

## Sicherungsformat

Eine vollständige Sicherung enthält das Datenpaket plus `type: "coldstart-backup"`, Erstellzeit und `personal` mit Bauzustand, Liste, Videos, Serviceinhalten und Bildern/Hotspots. Import einer Sicherung aktualisiert den Katalog und ersetzt die persönlichen Felder durch deren gespeicherten Stand. Daher vorher den aktuellen Stand sichern. Eine Dateisicherung ist unverschlüsselt.

Die CSV-Projektliste ist ein Export, kein vollständiges Backup. Eine gedruckte Arbeitskarte enthält ebenfalls keine Bild- oder Anleitungssicherung. Für Weiterentwicklung und Migration das vollständige JSON aufbewahren.

## Handbuchindex ab Version 0.2

`src/manual-data.mjs` und `data/manual-index.json` führen die beiden Ausgaben mit Seitenanzahl, Dateigröße, SHA-256, ISBN und Gültigkeitsgrenzen. Themen enthalten `manualId`, `pdfPage`, gedruckte `bookPage`, redaktionelle Abschnitte und Risikohinweise. Die 47 Kapitelanfänge sind aus Seitenkopf-OCR erschlossen; sie ersetzen keine vollständige technische Kapitelprüfung. OCR-Resultate werden nicht automatisch zu Teilenummern oder freigegebenen Sollwerten.

Die fünf mitgelieferten Abbildungsausschnitte haben normalisierte Bildpositionen mit `partId`, `x` und `y`. Koordinaten sind relativ zum konkreten Ausschnitt. Die dargestellte Positionsnummer ist ein Atlas-Label; sie ist weder eine ETK-Nummer noch eine Zahl aus dem Reparaturtext. Neue Bildpositionen nur nach Sichtprüfung, exakter Quellenangabe und Rechteklärung ergänzen.

Die Legacy-Ausgabe erhält bewusst `models: []`; für E46 liefern die Zuordnungsfunktionen keine Handbuchthemen oder Bilder. Benutzerimportierte Teile können den Katalog verändern, aber eine Typzuordnung bestätigt keine fahrzeugspezifische Reparaturgültigkeit.

Die zwei Original-PDFs werden ausschließlich vom Nutzer ausgewählt. Nach Prüfung speichert IndexedDB sie unter `coldstart-atlas-manuals-v1/pdfs`; bei blockiertem oder vollem Speicher gilt Sitzungsspeicherung. Die vollständige lokale Dateiprüfung nutzt Web Crypto, ersatzweise eine getestete lokale SHA-256-Implementierung. Es gibt keinen Upload-Endpunkt und keine automatische Fernabfrage.

**Migration und Backup:** Schema-Version 1 bleibt kompatibel. Projekt-Sicherungen enthalten weiterhin Katalog, persönliche Daten und eigene Bilder, aber keine Handbuch-PDFs. Die statisch kuratierten Themen/Bilder stecken in der HTML-/Quellcodefassung und werden mit dieser versioniert. Original-PDFs separat aufbewahren; für einen Browser- oder Gerätewechsel erneut zuordnen.

## Dokumentenregal ab Version 0.3

`data/dokumente.json` und `src/documents-data.mjs` enthalten die 18 zusätzlichen Drive-Dateien. Felder sind unter anderem stabile Atlas-ID, Drive-ID/-URL, MIME-Typ, vollständiger SHA-256, Dateigröße, Ausgabe, Quellenumfang, Modellbezug, Risikohinweise und PDF-/Druckseiten. `generic` kennzeichnet produktbezogene Quellen, etwa Reifenbestätigungen. Dieser Modellbezug ist ein Suchkriterium und keine Fahrzeugfreigabe. Die eigentliche Teile-Importschnittstelle bleibt unverändert.

`MANUALS` ist die gemeinsame interne Datei-Registrierung der zwei Handbücher und 18 zusätzlichen Quellen. Die Handbuchansicht zeigt weiterhin nur die zwei ursprünglichen Bücher. Alle 20 Dateifassungen nutzen die bestehende lokale Verwaltung. JPEG-Bilder werden anhand von Signatur und vollständigem Hash geprüft und als Bild angezeigt; sie werden nicht als PDF behandelt. Eine Sammelzuordnung prüft jede Datei einzeln und übernimmt ausschließlich identische registrierte Fassungen.

`documents-core.mjs` vergleicht beim Radabgleich ausschließlich die ausgewählten Kennzeichnungs-/Maßfelder. Es existiert keine Zulassungsautomatik. Auch ein vollständiger Merkmalsabgleich oder allgemeiner V17-Listentreffer setzt `approved` nie auf wahr. BBS bleibt wegen des erkannten Quellenkonflikts ausdrücklich ungeklärt. Rondell V02 und V04 besitzen getrennte Seitenverweise. Es werden keine Radschrauben-Drehmomente aus dem Vergleich erzeugt.

Die PDC-Varianten verwenden getrennte Abschnittsgrenzen im Original. Die sechs Funktionsfelder sind Links auf diese Quelle; sie sind kein neuer Schaltplan. Die sechs redaktionellen Arbeitsübersichten ergänzen die bisherigen Handbuchthemen und führen keine unbestätigten OEM-Nummern in den Teilekatalog ein.

Das CSV-Register enthält Metadaten, Hinweise und Quellen, keine PDF-/JPEG-Binärdaten und keine eingegebenen Rad-Prüfwerte. Der Radabgleich hält Eingaben nur im Arbeitsspeicher dieses Seitenaufrufs. Bibliotheks-Originale müssen zusätzlich selbst aufbewahrt werden. Das Import-/Sicherungsschema bleibt Version 1; vorhandene Projekt-JSON-Dateien bleiben lesbar.
