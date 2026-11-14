# E06 Rechnung kopieren

**Epic:** E · **Rolle:** `sales-user`

## User Story
Als Vertriebsmitarbeiter möchte ich eine Rechnung kopieren, um wiederkehrende Rechnungen schnell zu erstellen.

## Akzeptanzkriterien
1. **Gegeben** ich habe eine Rechnung geöffnet, **wenn** ich „Kopieren" wähle, **dann** öffnet sich `/invoicing/invoices/copy` mit allen Daten und Positionen, neuer Nummer, heutigem Datum und Status „In Bearbeitung".
2. **Gegeben** ich speichere, **dann** entsteht eine neue Rechnung; das Original bleibt unverändert.
