# H05 Auditor liest alles, ändert nichts

**Epic:** H · **Rolle:** `auditor` · **Entscheidung:** A1 (siehe `ai/spec/07-open-points.md`)

## User Story
Als Auditor möchte ich alle Geschäftsdaten einsehen, ohne sie ändern zu können.

## Akzeptanzkriterien
1. **Gegeben** ich bin `auditor`, **dann** kann ich Überblick, Empfänger, Verträge und Rechnungen öffnen und lesen.
2. **Gegeben** ich bin `auditor`, **dann** sind Schreibaktionen nicht möglich: die Firestore-Regeln lehnen Schreibzugriffe ab (Annahme: die Oberfläche blendet Speichern/Löschen/Neu aus; im Detail zu bestätigen).
3. **Gegeben** ich bin `auditor`, **dann** sehe ich weder „Einstellungen" noch „Benutzer".
