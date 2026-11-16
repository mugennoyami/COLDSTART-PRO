# COLDSTART PRO starten

Stand: 16.11.2026 · Anwendung 0.7.0. Drei Startwege für denselben ausgelieferten Programmstand.

## Online über GitHub Pages – PC und Handy

**Adresse: https://mugennoyami.github.io/COLDSTART-PRO/**

Der Workflow „GitHub Pages“ (`.github/workflows/pages.yml`) baut die App bei jedem Push auf `main`, führt die Tests aus und veröffentlicht den Ordner `dist/` mit Katalogdaten und Bildern. Ohne Anmeldung erreichbar; die Seite ist **öffentlich**, wie das Repository selbst. Kein Konto, Server oder Abo nötig.

- **Einmalige Einstellung:** Im Repository unter Settings → Pages → Build and deployment → Source „GitHub Actions“ wählen. Mit „Deploy from a branch“ zeigt die Adresse stattdessen die README; die App liegt dann nur unter `…/COLDSTART-PRO/dist/`.
- **Aktualisieren:** Änderungen nach `main` mergen. Den Lauf unter „Actions → GitHub Pages“ verfolgen; nach etwa ein bis zwei Minuten ist der neue Stand online. Ein manueller Lauf ist über „Run workflow“ möglich.
- **iPhone:** Adresse in Safari öffnen und wie unten beschrieben zum Home-Bildschirm hinzufügen.
- Browserdaten (Projektlisten, Notizen, KI-Modell, API-Schlüssel) liegen pro Adresse getrennt. GitHub Pages, Sites-Adresse und lokale HTML-Datei teilen keinen Speicher; Wechsel über die JSON-Sicherung.

## Privat im Browser – PC und Handy

**Adresse: https://coldstart-pro-garage-atlas.solarcedar22.chatgpt.site**

Die Site wird ausschließlich für das Eigentümerkonto bereitgestellt. Beim ersten Aufruf gegebenenfalls mit demselben ChatGPT-Konto anmelden, das diese Site besitzt. Eine private GitHub-Anmeldung ersetzt diese Anmeldung nicht. Die App lässt sich bei Bedarf über die Adresse öffnen; der eigene PC muss dafür nicht laufen. Es gibt keinen lokalen Server, den du starten musst. Keine kostenpflichtige Registrierung, Domain oder neues Abo wurde für diese Bereitstellung abgeschlossen.

- **PC:** Link im Browser öffnen. Unter Windows alternativ die mitgelieferte `COLDSTART-PRO-Cloud.url` doppelklicken. Eine Verknüpfung auf dem Desktop ist möglich.
- **iPhone:** Adresse in Safari öffnen, anmelden und als Lesezeichen speichern. Optional über das Teilen-Menü „Zu Home-Bildschirm hinzufügen“ und – falls angeboten – „Als Web-App öffnen“ wählen; siehe [Apple-Anleitung](https://support.apple.com/de-de/guide/iphone/iphea86e5236/ios). Diese Fassung hat keinen eigenen Offline-Service-Worker; Cloudzugang und externe Videos benötigen Internet. Eine eigenständige native iOS-App wird nicht mitgeliefert.
- **Unterwegs:** denselben Link aufrufen. Eine Unterhaltung in ChatGPT oder diese Entwicklungsumgebung muss dafür nicht geöffnet bleiben. Verfügbarkeit und Anmeldung richten sich nach dem Sites-Dienst; keine 24/7-Garantie zugesagt.

## Lokal auf Windows – sofort und ohne Installation

Ab 0.6 lädt der Originalkatalog Bildtafeln und Teilelisten als eigene Dateien nach. Beim Öffnen der HTML-Datei direkt von der Festplatte (`file://`) blockieren Browser diese Abrufe; Fahrzeugauswahl, eigene Ansichten, Dokumente und Assistent funktionieren, die Originalzeichnungen nicht. Für den vollen Katalog GitHub Pages oder die Cloudfassung nutzen.


1. In deinem privaten GitHub-Repository [COLDSTART-PRO](https://github.com/mugennoyami/COLDSTART-PRO) anmelden.
2. **Code → Download ZIP**, anschließend das ZIP vollständig entpacken. Nicht aus der ZIP-Vorschau starten.
3. `COLDSTART-PRO-Start.cmd` doppelklicken. Das öffnet die mitgelieferte `dist/index.html` im Standardbrowser. Alternativ direkt diese HTML-Datei mit Chrome, Edge oder Firefox öffnen.
4. Optional eine Desktop-Verknüpfung zur Startdatei anlegen. Den entpackten Projektordner danach am gleichen Ort lassen.

Es werden kein Node.js, Python, npm, Konto, API-Schlüssel, Server oder Administratorrechte für die lokale Nutzung benötigt. Nur die optionalen KI-Antworten des Assistenten brauchen einen OpenAI-API-Schlüssel. Es ist eine Browseranwendung und kein natives EXE-Programm. Die Startdatei öffnet ausschließlich die lokale HTML-Datei und führt keinen Download oder Update aus. Die Startlogik wurde gelesen und geprüft; ein echter Windows-Ausführungstest war in der Linux-Entwicklungsumgebung nicht möglich.

Zeichnungen, Datenbestand und Suche funktionieren lokal auch ohne Internet. Originalverweise, Drive und YouTube benötigen Internet. Speicherung unter `file://` kann browserabhängig abweichen; wichtige Änderungen regelmäßig exportieren und bei Problemen die private HTTPS-Fassung verwenden.

## Werkstatt-Assistent und KI (optional)

Der Assistent unten rechts funktioniert sofort mit eingebautem Wissen, auch offline. Für freie Fragen gibt es zwei Wege.

### Kostenlos: KI im Browser

1. Assistent öffnen, ⚙ wählen, „KI im Browser · kostenlos“ anklicken und ein Modell wählen: Qwen2.5 1,5B (Standard, etwa 0,9 GB), Qwen2.5 0,5B (Handy, etwa 0,3 GB) oder Llama 3.2 3B (PC, etwa 1,8 GB). „Speichern“.
2. Bei der ersten Frage fragt der Assistent, ob er das Modell laden soll („Jetzt laden“). Alternativ in den Einstellungen „Modell jetzt laden“. Auf dem Handy im WLAN laden.
3. Danach liegt das Modell im Browser und arbeitet ohne Internet. Fragen verlassen das Gerät nicht. „Modell vom Gerät löschen“ gibt den Speicher wieder frei.

Voraussetzung ist WebGPU: aktuelles Chrome oder Edge am PC, Safari ab Version 26 auf Mac, iPhone und iPad. Ohne WebGPU oder bei zu wenig Grafikspeicher antwortet der Assistent mit eingebautem Wissen und nennt den Grund. Cloudadresse, lokale HTML-Datei und jedes Gerät haben einen eigenen Browserspeicher und laden das Modell jeweils einmal. Kleine Modelle sind schwächer als OpenAI; ihre Antworten stützen sich auf das eingebaute Wissen.

### Kostenpflichtig: OpenAI

Die OpenAI-API hat kein Gratiskontingent.

1. Auf [platform.openai.com](https://platform.openai.com/api-keys) mit einem OpenAI-Konto anmelden. Die API wird **getrennt vom ChatGPT-Abo** nach Verbrauch abgerechnet; dafür ist Guthaben im API-Konto nötig.
2. Empfohlen: ein eigenes Projekt „COLDSTART“ mit monatlichem Budgetlimit anlegen und darin einen API-Schlüssel erstellen.
3. Im Atlas den Assistenten öffnen, ⚙ wählen, „KI-Antworten verwenden“ anhaken, Schlüssel einfügen, „Verbindung testen“ und „Speichern“.
4. Jede Startvariante hat einen eigenen Browserspeicher: Cloudadresse, lokale HTML-Datei und jedes Gerät brauchen eine eigene Eingabe. Ohne Häkchen bei „Auf diesem Gerät merken“ gilt der Schlüssel nur bis zum Schließen des Tabs.

Eine typische Frage kostet mit `gpt-5-mini` grob 0,1–0,5 US-Cent; die App zeigt nach jeder Antwort eine Schätzung (Preise laut OpenAI, Stand 01.11.2026). Bei Verdacht auf Missbrauch den Schlüssel auf platform.openai.com widerrufen. Ob die Cloudplattform eigene Sicherheitsregeln setzt, die den Aufruf von `api.openai.com` blockieren, ist ungeprüft; dann antwortet der Assistent mit eingebautem Wissen und nennt den Verbindungsfehler.

## Eigene Daten und Gerätewechsel

**Cloud-Hosting bedeutet derzeit keine Synchronisierung deiner persönlichen App-Daten.** Die Site liefert die Anwendung; Projektlisten, Notizen, eigene Anleitungen und Verknüpfungen speichert die App im jeweiligen Browser. Lokal geöffnete HTML, Cloudadresse, unterschiedliche Browser und unterschiedliche Geräte haben getrennte Speicherbereiche.

1. Auf dem bisherigen Gerät **Daten & eigene Inhalte → Projekt-Sicherung exportieren** nutzen.
2. Die JSON-Sicherung selbst auf das Zielgerät übertragen und dort über die Importfunktion wiederherstellen. Die App fragt vor dem Ersetzen nach und kann den dortigen Stand vorher als Datei sichern; die Wiederherstellung ist kein Zusammenführen parallel bearbeiteter Stände.
3. PDF-/JPEG-Originale sind in der JSON-Sicherung nicht enthalten. Originale am Zielgerät erneut lokal zuordnen oder mit deinem bestehenden Google-Drive-Zugriff öffnen.
4. Regelmäßig außerhalb des Browserprofils sichern. Gelöschte Browserdaten, private Tabs und Speicherbereinigung können lokale Ergänzungen entfernen.

Die Bereitstellung lädt deine nachträglich zugeordneten PDFs und persönlichen Browsernotizen nicht automatisch in eine neue zentrale Datenbank. Es wurden keine Server-Synchronisierung, Accounts für Dritte oder Freigaben eingerichtet. Für eine spätere Synchronisierung wären ein eigener Daten-/Dateispeicher, Zugriffsregeln, Backups und Konfliktbehandlung nötig.

## Updates

GitHub bleibt das führende Code-Repository. GitHub Pages wird bei jedem Push auf `main` automatisch aktualisiert. Der Workflow „Build und Tests“ prüft neue Commits, veröffentlicht sie aber nicht automatisch auf Sites. Die Cloud benötigt einen expliziten Abgleich und eine neue private Bereitstellung. Lokal die aktualisierte ZIP-Fassung herunterladen und entpacken; vorher eigene Änderungen exportieren, Originaldateien separat behalten und beim Wechsel erneut zuordnen, falls der Browser einen anderen Speicherbereich verwendet.

Die feste Cloudadresse bleibt bei späteren Bereitstellungen derselben Site bestehen. Browser gegebenenfalls neu laden. Keine automatische Online-Nachprüfung der externen Kaufpreise oder Videoquellen durch das Hosting.

## Grenzen

Das Tool bleibt ein begrenzter E36-/E46-Atlas und keine vollständige Reparaturdatenbank. Sicherheits- und Gültigkeitshinweise gelten bei beiden Startwegen. Die private Bereitstellung erteilt keine kommerzielle Nutzungslizenz für fremde Buchabbildungen. Die Sites-Fassung ist nicht öffentlich freigegeben; die GitHub-Pages-Fassung ist öffentlich erreichbar.
