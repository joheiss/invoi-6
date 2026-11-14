# H04 Rückmeldung durch Snackbars und Spinner

**Epic:** H · **Rolle:** alle

## User Story
Als Benutzer möchte ich bei Aktionen sofort Rückmeldung bekommen.

## Akzeptanzkriterien
1. **Gegeben** eine asynchrone Aktion läuft (Speichern, Upload, PDF), **dann** zeigt die Anwendung einen Spinner.
2. **Gegeben** die Aktion war erfolgreich, **dann** erscheint eine Erfolgsmeldung mit deutschem Text aus dem Meldungskatalog.
3. **Gegeben** die Meldung enthält Platzhalter (`$%`), **dann** werden sie der Reihe nach durch die Parameter (z. B. Dateiname) ersetzt.
