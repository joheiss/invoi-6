# E07 Rechnung löschen

**Epic:** E · **Rolle:** `sales-user`

## User Story
Als Vertriebsmitarbeiter möchte ich eine Rechnung löschen, die nicht mehr gebraucht wird.

## Akzeptanzkriterien
1. **Gegeben** die Rechnung ist änderbar (nicht „bezahlt"), **dann** ist „Löschen" sichtbar.
2. **Gegeben** ich wähle „Löschen", **dann** erscheint „Soll die Rechnung {Nr} wirklich gelöscht werden?".
3. **Gegeben** ich bestätige, **dann** wird die Rechnung gelöscht, der Nummernkreis zurückgesetzt (falls letzte Nummer), die Dokumentverknüpfungen entfernt und der Umsatz zurückgerechnet (siehe I01, I02, I04).
