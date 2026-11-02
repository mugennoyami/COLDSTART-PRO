# Änderungen am Garage Atlas

## Lokal starten

Node.js 24 verwenden; es sind keine npm-Abhängigkeiten zu installieren.

```bash
node build.mjs
node --test tests/*.test.mjs
```

Danach `dist/index.html` in einem aktuellen Browser öffnen. `src/index.html` ist die Buildvorlage und enthält noch Platzhalter. Persönliche Projektlisten und lokal zugeordnete Originaldokumente liegen im Browser und sind keine Git-Dateien.

## Branch, Commit und Push

Ziel ist `mugennoyami/COLDSTART-PRO`. Die Arbeitskopie kann über `git clone https://github.com/mugennoyami/COLDSTART-PRO.git` angelegt werden. Für das private Repository ist eine eigene GitHub-Anmeldung mit entsprechendem Zugriff erforderlich. Es werden keine Zugangsdaten mitgeliefert.

Vor Arbeiten am Hauptstand `git pull --ff-only` ausführen. Für eine Änderung einen eigenen Branch erstellen:

```bash
git switch -c feature/kurze-beschreibung
```

Quelldateien unter `src/` bearbeiten. Redaktionelle Register in `data/` und ihre Entsprechung in den Datenmodulen gemeinsam pflegen. Änderungen an `dist/index.html` immer durch `node build.mjs` erzeugen. Erst bauen, dann Tests ausführen und den Diff prüfen:

```bash
node build.mjs
node --test tests/*.test.mjs
git diff --stat
git diff --check
git status --short
```

Die beabsichtigten Dateien einzeln mit `git add <pfad>` auswählen. Generierte Änderungen an `dist/index.html` gehören mit zum Commit. Danach:

```bash
git commit -m "Kurze Beschreibung der Änderung"
git push -u origin HEAD
```

Auf GitHub einen Pull Request nach `main` erstellen. Der Workflow „Build und Tests“ prüft Build, Tests und die Aktualität des mitgelieferten HTML. Er veröffentlicht keine Website und pusht keine Änderungen zurück. Branchschutz wird nicht durch diese Dateien eingerichtet. GitHub-Actions-Läufe benötigen die im Konto verfügbaren Actions-Minuten; das Projekt richtet keine kostenpflichtigen Dienste ein.

Die lokale Git-Identität für künftige Commits aus den eigenen Git-Einstellungen verwenden. Der GitHub-Import baut auf dem vorhandenen Initial-Commit des Repositorys auf. Die zuvor vorbereiteten lokalen Bundle-Commits sind ein historischer Export und haben einen eigenen Verlauf; für weitere Arbeiten die GitHub-Arbeitskopie verwenden.

## Inhalt prüfen

- Wissensbasis des Werkstatt-Assistenten (`src/assistant-data.mjs`): keine Drehmomente, Füllmengen oder Sollwerte, herstellerspezifische Codes nicht deuten. Verweisvorlagen (`{M}` = Baureihe) werden durch `tests/assistant.test.mjs` gegen Teile, Quellen und Kapitel geprüft. Schlüsselwörter normalisiert schreiben (klein, ä→ae, ß→ss).
- WebLLM-Update: in `src/assistant-data.mjs` Version, URL und SHA-256 von `lib/index.js` aus dem npm-Paket gemeinsam ändern (nur Versionen, die mindestens zwei Wochen alt sind) und prüfen, dass die Modell-IDs in `BROWSER_MODELS` in `prebuiltAppConfig` der neuen Version enthalten sind.

- Bei geänderten Oberflächen die betroffene Aufgabe im Browser auf Desktop und schmaler Breite prüfen.
- Neue Teile-/Serviceangaben brauchen passende Quellen, Variantenabgrenzung und den zutreffenden Prüfstatus.
- Widersprüche nicht als bestätigte Referenz oder Freigabe ausgeben. Keine Drehmomente, Teilematches oder Rechtsfreigaben aus Modellnamen ableiten.
- Neue Bilder und Texte benötigen dokumentierte Nutzungsrechte; Einzelheiten stehen in [RIGHTS.md](RIGHTS.md).
- Keine Original-PDFs, persönlichen Browser-Backups, VINs, Kennzeichen oder Zugangsdaten committen. `.gitignore` ersetzt keine Prüfung des Diffs.
- Second Brain (Lesekopie) und Second Brain Inbox bleiben ausschließlich lesbar. Diese Repository-Anleitung autorisiert dort keine Änderungen.

## Neue Version

Versionsnummer und sichtbare Versionshinweise gemeinsam aktualisieren; Änderungsinhalt und Prüfung in `CHANGELOG.md` beziehungsweise `docs/REVIEW.md` festhalten. Erst nach bestandenen Prüfungen einen passenden Git-Tag setzen. Eine neue Version bedeutet keine fachliche Freigabe der Fahrzeugdaten.
