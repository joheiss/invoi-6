# C02 Empfänger anlegen

**Epic:** C · **Rolle:** `sales-user`

## User Story
Als Vertriebsmitarbeiter möchte ich einen neuen Rechnungsempfänger anlegen, damit ich ihm Verträge und Rechnungen zuordnen kann.

## Akzeptanzkriterien
1. **Gegeben** ich bin in der Empfängerliste, **wenn** ich einen Empfänger anlegen wähle, **dann** öffnet sich ein Formular (`/invoicing/receivers/new`) mit der nächsten freien Nummer aus dem Nummernkreis `receivers` und Status „aktiv".
2. **Gegeben** Name, PLZ und Ort sind gefüllt und alle Felder gültig, **wenn** ich „Speichern" wähle, **dann** wird der Empfänger mit meiner Organisation gespeichert.
3. **Gegeben** der Empfänger wurde angelegt, **dann** setzt das System `lastUsedId` des Nummernkreises `receivers` auf die vergebene Nummer (siehe I01).
