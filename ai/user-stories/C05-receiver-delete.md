# C05 Empfänger löschen

**Epic:** C · **Rolle:** `sales-user`

## User Story
Als Vertriebsmitarbeiter möchte ich einen Empfänger ohne Verträge und Rechnungen löschen, damit keine unnötigen Stammdaten bleiben.

## Akzeptanzkriterien
1. **Gegeben** ein Empfänger hat weder Verträge noch Rechnungen, **dann** ist „Löschen" sichtbar.
2. **Gegeben** ich wähle „Löschen", **dann** erscheint eine Bestätigung (siehe H02).
3. **Gegeben** ich bestätige, **dann** wird der Empfänger gelöscht, und das System setzt den Nummernkreis `receivers` zurück, falls es die zuletzt vergebene Nummer war (siehe I01).
4. **Gegeben** der Empfänger hatte Dokumente, **dann** werden die zugehörigen Dokumentverknüpfungen mitgelöscht (siehe I04).
