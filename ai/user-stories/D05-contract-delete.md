# D05 Vertrag löschen

**Epic:** D · **Rolle:** `sales-user`

## User Story
Als Vertriebsmitarbeiter möchte ich einen Vertrag ohne Rechnungen löschen.

## Akzeptanzkriterien
1. **Gegeben** der Vertrag hat keine Rechnungen, **dann** ist „Löschen" sichtbar.
2. **Gegeben** ich wähle „Löschen" und bestätige (siehe H02), **dann** wird der Vertrag gelöscht.
3. **Gegeben** er war der zuletzt vergebene, **dann** wird der Nummernkreis `contracts` zurückgesetzt, und seine Dokumentverknüpfungen werden entfernt (siehe I01, I04).
