# Rechte und private Verwendung

Dieses Repository ist als private Entwicklungsablage vorgesehen. Es wurde keine Open-Source-Lizenz vergeben. `private: true` in `package.json` verhindert eine versehentliche npm-Veröffentlichung, macht ein GitHub-Repository aber nicht privat.

Die fünf Ausschnitte unter `assets/manuals/` sowie dieselben eingebetteten Bilddaten in `src/manual-assets.mjs` und `dist/index.html` stammen aus dem bereitgestellten Bentley-Handbuch. Sie wurden für die private Arbeitsfassung übernommen. Öffentliche oder kommerzielle Nutzungsrechte sind nicht geklärt. Der Herkunftsnachweis steht in `data/manual-image-provenance.json` und `docs/HANDBUCH_AUSWERTUNG.md`.

Die vollständigen Handbücher und die 18 Originaldateien aus „Gutachten etc“ sind nicht Teil des Repositorys. Erfasst sind redaktionelle Einordnungen, Dateihashes, Fundstellen und Links zum jeweils zugangsbeschränkten Original. Die Aufnahme eines Links verändert keine Drive-Freigabe und überträgt keine Nutzungsrechte. Auch vor öffentlicher Weitergabe des Registers sind Inhalte, Links und persönliche Bezüge zu prüfen.

Vor einem Wechsel auf öffentlich oder einer kommerziellen Nutzung sind Daten-, Bild-, Text- und Markenrechte gesondert zu klären. Das betrifft auch frühere Commits: Das Entfernen einer Datei aus dem neuesten Stand entfernt sie nicht aus der Git-Historie.

Für fremde Kataloge, Reparaturdaten oder Videoanbieter wird durch dieses Projekt keine Lizenz erteilt. Die technischen und fachlichen Grenzen in `README.md` und `docs/REVIEW.md` gelten weiter.

## Werkstatt-Assistent ab 0.5

Die Wissensbasis in `src/assistant-data.mjs` besteht aus eigenen, kurzen redaktionellen Einordnungen typischer Ursachen und Prüfschritte. Sie übernimmt keine Texte, Tabellen, Drehmomente oder Sollwerte aus Handbüchern, Herstellerunterlagen oder kostenpflichtigen Datenbanken. Die Bedeutung genormter OBD-Codes ist allgemein bekannt; herstellerspezifische Codes werden bewusst nicht gedeutet. Die Inhalte sind keine fachlich freigegebenen Reparaturdaten.

Die kostenlose Browser-KI lädt zur Laufzeit WebLLM (Apache-2.0) und frei verfügbare Modellgewichte direkt von den Anbietern; nichts davon liegt im Repository. Lizenzen der angebotenen Modelle: Qwen2.5 0,5B und 1,5B Apache-2.0, Llama 3.2 3B Llama 3.2 Community License (inklusive Nutzungsrichtlinie von Meta). Qwen2.5 3B wurde wegen seiner nicht-kommerziellen Lizenz bewusst nicht aufgenommen.

Die optionale OpenAI-Funktion nutzt das Konto und den API-Schlüssel des Nutzers bei OpenAI; dafür gelten dessen Nutzungsbedingungen. Das Projekt erteilt keine Lizenz für KI-Antworten und prüft sie nicht fachlich. Vor einer öffentlichen oder kommerziellen Nutzung wären unter anderem Datenschutzhinweise, ein Server statt Nutzerschlüssel im Browser und die Haftungsfrage zu klären.

## Kuratierte Lernquellen ab 0.4

AUTODOC wird über die öffentlich angebotenen Originalseiten und YouTube-Originalvideos erschlossen. Nur kurze eigene Einordnungen, bibliografische Metadaten und URLs sind im Repository. Neue fremde PDF-Texte, Bilder, Vorschaubilder oder Videodateien werden nicht weiterverteilt. Die Videos bleiben im offiziellen YouTube-Player; er wird erst auf Klick geladen und umgeht keine Anbieterbeschränkungen. Eine Rückverknüpfung zum Original bleibt sichtbar.

Ein verfügbarer Player bestätigt keine Reparaturfreigabe und keine allgemeine kommerzielle Datenlizenz. Ein Buchkauf bestätigt ebenfalls keine Lizenz, Buchtexte oder Abbildungen an Nutzer des Tools weiterzugeben. Vor einer öffentlichen oder kommerziellen Einbindung sind die konkrete Verwendung und erforderliche Rechte getrennt zu klären. Die Quellen- und Preisrecherche ist in `docs/QUELLEN_KAUF_UND_AUTODOC.md` dokumentiert.
