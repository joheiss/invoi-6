# E03 Gutschrift (Gutschriftverfahren) anlegen

**Epic:** E · **Rolle:** `sales-user`

## User Story
Als Vertriebsmitarbeiter möchte ich eine Rechnung im Gutschriftverfahren anlegen, die eine eigene Nummernfolge nutzt.

## Akzeptanzkriterien
1. **Gegeben** ich lege eine Rechnung mit Abrechnungsart „Gutschriftverfahren" an, **wenn** ich speichere, **dann** wird sie gespeichert.
2. **Gegeben** die Rechnung wurde angelegt, **dann** wird `lastUsedId` des Nummernkreises `credit-requests` (nicht `invoices`) fortgeschrieben.
3. **Gegeben** die Abrechnungsart ist „Gutschriftverfahren", **dann** ist „PDF erzeugen" nicht sichtbar.
