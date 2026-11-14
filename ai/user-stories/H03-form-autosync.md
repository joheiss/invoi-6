# H03 Formularübernahme mit Verzögerung und Gültigkeitsprüfung

**Epic:** H · **Rolle:** alle mit Schreibrecht

## User Story
Als Benutzer möchte ich, dass gültige Eingaben automatisch übernommen und Summen sofort angezeigt werden.

## Akzeptanzkriterien
1. **Gegeben** ich ändere ein Feld mit gültigem Wert, **wenn** 500 ms vergangen sind, **dann** wird der Wert übernommen und abhängige Summen aktualisiert.
2. **Gegeben** der Wert ist ungültig, **dann** wird er nicht übernommen.
3. **Gegeben** ich gebe Beträge im deutschen Format ein (Tausenderpunkt, Dezimalkomma), **dann** werden sie korrekt verstanden und mit zwei Nachkommastellen angezeigt.
