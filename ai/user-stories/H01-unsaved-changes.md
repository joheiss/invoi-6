# H01 Warnung bei ungesicherten Änderungen

**Epic:** H Querschnitt · **Rolle:** alle mit Schreibrecht

## User Story
Als Benutzer möchte ich gewarnt werden, wenn ich eine Seite mit ungesicherten Änderungen verlasse.

## Akzeptanzkriterien
1. **Gegeben** ein Detailformular ist geändert (dirty), **wenn** ich wegnavigiere, **dann** erscheint „Sie haben noch ungesicherte Änderungen. Wollen Sie den Dialog trotzdem verlassen?".
2. **Gegeben** der Dialog ist offen, **wenn** ich bestätige, **dann** verlasse ich die Seite; **wenn** ich abbreche, **dann** bleibe ich.
3. **Gegeben** das Formular ist unverändert, **dann** erscheint kein Dialog und die Schaltfläche heißt „Zurück"; bei geändertem Formular heißt sie „Abbrechen".
