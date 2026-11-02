# Import der ChatGPT-Fassung 0.6 (Garage Atlas)

Stand: 02.11.2026. Rekonstruiert von Claude aus der veröffentlichten Seite `https://coldstart-pro-garage-atlas.solarcedar22.chatgpt.site/` (Quelltext von Simon im Browser gespeichert, 02.11.2026).

## Herkunft und Prüfung

- Der Quellcode von 0.6 lag nicht im Repository. ChatGPT hat ihn direkt aus seiner Arbeitsumgebung veröffentlicht.
- 0.6 baut auf **0.4.0** (Commit `8f1aab8`) auf, nicht auf 0.4.1. Die Korrekturen aus 0.4.1 (Pull Request #1) fehlen in 0.6.
- Die Module wurden aus dem gebündelten Skript zurückgewonnen. Prüfung: `node build.mjs` erzeugt aus diesem Branch **bytegenau** dieselbe HTML-Datei wie die veröffentlichte Seite. Einzige Ausnahme ist ein von der Plattform eingefügtes Cloudflare-Skript, das nicht zur App gehört.
- Nicht exakt rekonstruierbar sind nur Dinge ohne Einfluss auf das Bündel: Importzeilen und `export`-Schlüsselwörter der neun neuen Module (hier aus der tatsächlichen Nutzung abgeleitet) und das ursprüngliche `build.mjs` von 0.6, das die Katalogdaten aus JSON-Dateien einsetzte. Hier stehen die Daten direkt in `src/vehicle-data.mjs`, `src/catalog-data.mjs` und `src/workshop-data.mjs`. Tests, Dokumentation und Änderungsverlauf von 0.6 lagen nicht vor.

## Neue Module in 0.6

| Datei | Inhalt |
| --- | --- |
| `src/vehicle-core.mjs`, `src/vehicle-data.mjs`, `src/vehicle-ui.mjs` | 810 Fahrzeugvarianten (Typschlüssel) mit Auswahl, Erfassung 30.10.2026 über Leebmann24 |
| `src/catalog-core.mjs`, `src/catalog-data.mjs`, `src/catalog-ui.mjs` | Katalog mit Originalzeichnungen: E36 BG11 30 Hauptgruppen/702 Zeichnungen, E46 AV31 33/935; Zoom, Positionen, Suche, Katalog-Projektliste |
| `src/workshop-core.mjs`, `src/workshop-data.mjs`, `src/workshop-ui.mjs` | Werkstatt-FAQ & Schwachstellen (14 Einträge, 21 Quellen) |

Geändert: `src/app.mjs`, `src/data.mjs` (Version 0.6.0, Leebmann-Quelle), `src/draw.mjs` (Fahrzeugbild), `src/index.html`, `src/style.css`.

## Fehlende Laufzeitdateien

Die Seite lädt beim Bedienen Dateien nach, die nicht im HTML stecken und nur auf dem Server der ChatGPT-Site liegen:

- `catalog/coverage.json`
- `catalog/E36/<Zeichnung>.json` (702) und `catalog/E46/<Zeichnung>.json` (935)
- `catalog/search-E36.json`, `catalog/search-E46.json`
- für 23 Varianten mit lokalem Motorkatalog: `catalog/profiles/<Baureihe>/<Typ>.json`, `catalog/variants/<Baureihe>/<Typ>/<Zeichnung>.json`, `catalog/variants/search-<Baureihe>-<Typ>.json`
- `assets/catalog/<Bild>.webp` (mindestens 1.385 Zeichnungsbilder), `assets/catalog/unavailable.svg`, `assets/vehicles/e36.webp`, `assets/vehicles/e46.webp`

Ohne diese Dateien zeigt der Katalog Listen und Fahrzeugauswahl, aber keine Zeichnungen und Positionen. **Die Cloudfassung darf nicht aus einem Stand ohne diese Dateien neu bereitgestellt werden**, sonst gehen sie dort verloren.

## Rechte

Die Katalogdaten und Zeichnungen stammen laut Daten aus Leebmann24 (BMW-Originalkatalog). Eine Lizenz zur Weitergabe liegt nicht vor. Nur private Nutzung, Repository privat halten; siehe `RIGHTS.md`.
