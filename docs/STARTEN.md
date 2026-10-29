# COLDSTART PRO starten

Stand: 29.10.2026 · Anwendung 0.4.0. Zwei Startwege für denselben ausgelieferten Programmstand.

## Privat im Browser – PC und Handy

**Adresse: https://coldstart-pro-garage-atlas.solarcedar22.chatgpt.site**

Die Site wird ausschließlich für das Eigentümerkonto bereitgestellt. Beim ersten Aufruf gegebenenfalls mit demselben ChatGPT-Konto anmelden, das diese Site besitzt. Eine private GitHub-Anmeldung ersetzt diese Anmeldung nicht. Die App lässt sich bei Bedarf über die Adresse öffnen; der eigene PC muss dafür nicht laufen. Es gibt keinen lokalen Server, den du starten musst. Keine kostenpflichtige Registrierung, Domain oder neues Abo wurde für diese Bereitstellung abgeschlossen.

- **PC:** Link im Browser öffnen. Unter Windows alternativ die mitgelieferte `COLDSTART-PRO-Cloud.url` doppelklicken. Eine Verknüpfung auf dem Desktop ist möglich.
- **iPhone:** Adresse in Safari öffnen, anmelden und als Lesezeichen speichern. Optional über das Teilen-Menü „Zu Home-Bildschirm hinzufügen“ und – falls angeboten – „Als Web-App öffnen“ wählen; siehe [Apple-Anleitung](https://support.apple.com/de-de/guide/iphone/iphea86e5236/ios). Diese Fassung hat keinen eigenen Offline-Service-Worker; Cloudzugang und externe Videos benötigen Internet. Eine eigenständige native iOS-App wird nicht mitgeliefert.
- **Unterwegs:** denselben Link aufrufen. Eine Unterhaltung in ChatGPT oder diese Entwicklungsumgebung muss dafür nicht geöffnet bleiben. Verfügbarkeit und Anmeldung richten sich nach dem Sites-Dienst; keine 24/7-Garantie zugesagt.

## Lokal auf Windows – sofort und ohne Installation

1. In deinem privaten GitHub-Repository [COLDSTART-PRO](https://github.com/mugennoyami/COLDSTART-PRO) anmelden.
2. **Code → Download ZIP**, anschließend das ZIP vollständig entpacken. Nicht aus der ZIP-Vorschau starten.
3. `COLDSTART-PRO-Start.cmd` doppelklicken. Das öffnet die mitgelieferte `dist/index.html` im Standardbrowser. Alternativ direkt diese HTML-Datei mit Chrome, Edge oder Firefox öffnen.
4. Optional eine Desktop-Verknüpfung zur Startdatei anlegen. Den entpackten Projektordner danach am gleichen Ort lassen.

Es werden kein Node.js, Python, npm, Konto, API-Schlüssel, Server oder Administratorrechte für die lokale Nutzung benötigt. Es ist eine Browseranwendung und kein natives EXE-Programm. Die Startdatei öffnet ausschließlich die lokale HTML-Datei und führt keinen Download oder Update aus. Die Startlogik wurde gelesen und geprüft; ein echter Windows-Ausführungstest war in der Linux-Entwicklungsumgebung nicht möglich.

Zeichnungen, Datenbestand und Suche funktionieren lokal auch ohne Internet. Originalverweise, Drive und YouTube benötigen Internet. Speicherung unter `file://` kann browserabhängig abweichen; wichtige Änderungen regelmäßig exportieren und bei Problemen die private HTTPS-Fassung verwenden.

## Eigene Daten und Gerätewechsel

**Cloud-Hosting bedeutet derzeit keine Synchronisierung deiner persönlichen App-Daten.** Die Site liefert die Anwendung; Projektlisten, Notizen, eigene Anleitungen und Verknüpfungen speichert die App im jeweiligen Browser. Lokal geöffnete HTML, Cloudadresse, unterschiedliche Browser und unterschiedliche Geräte haben getrennte Speicherbereiche.

1. Auf dem bisherigen Gerät **Daten & eigene Inhalte → Projekt-Sicherung exportieren** nutzen.
2. Die JSON-Sicherung selbst auf das Zielgerät übertragen und dort über die Importfunktion wiederherstellen. Vor dem Import auch den dortigen Stand sichern; die Wiederherstellung ist kein Zusammenführen parallel bearbeiteter Stände.
3. PDF-/JPEG-Originale sind in der JSON-Sicherung nicht enthalten. Originale am Zielgerät erneut lokal zuordnen oder mit deinem bestehenden Google-Drive-Zugriff öffnen.
4. Regelmäßig außerhalb des Browserprofils sichern. Gelöschte Browserdaten, private Tabs und Speicherbereinigung können lokale Ergänzungen entfernen.

Die Bereitstellung lädt deine nachträglich zugeordneten PDFs und persönlichen Browsernotizen nicht automatisch in eine neue zentrale Datenbank. Es wurden keine Server-Synchronisierung, Accounts für Dritte oder Freigaben eingerichtet. Für eine spätere Synchronisierung wären ein eigener Daten-/Dateispeicher, Zugriffsregeln, Backups und Konfliktbehandlung nötig.

## Updates

GitHub bleibt das führende Code-Repository. Der bisherige GitHub-Workflow prüft neue Commits, veröffentlicht sie aber nicht automatisch auf Sites. Die Cloud benötigt einen expliziten Abgleich und eine neue private Bereitstellung. Lokal die aktualisierte ZIP-Fassung herunterladen und entpacken; vorher eigene Änderungen exportieren, Originaldateien separat behalten und beim Wechsel erneut zuordnen, falls der Browser einen anderen Speicherbereich verwendet.

Die feste Cloudadresse bleibt bei späteren Bereitstellungen derselben Site bestehen. Browser gegebenenfalls neu laden. Keine automatische Online-Nachprüfung der externen Kaufpreise oder Videoquellen durch das Hosting.

## Grenzen

Das Tool bleibt ein begrenzter E36-/E46-Atlas und keine vollständige Reparaturdatenbank. Sicherheits- und Gültigkeitshinweise gelten bei beiden Startwegen. Die private Bereitstellung erteilt keine kommerzielle Nutzungslizenz für fremde Buchabbildungen. Keine öffentliche Freigabe vorgenommen.
