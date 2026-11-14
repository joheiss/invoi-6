# J03 Batch: Daten exportieren (`export`)

**Epic:** J · **Rolle:** Betreiber

## User Story
Als Betreiber möchte ich Nummernkreise, Einstellungen, Verträge, Empfänger, Rechnungen und Umsätze als JSON-Dateien exportieren.

## Akzeptanzkriterien
1. **Gegeben** die Sammlungen enthalten Daten, **wenn** ich `export` ausführe, **dann** entsteht je Sammlung (`number-ranges`, `settings`, `contracts`, `receivers`, `invoices`, `revenues`) eine JSON-Datei im Ordner `exports/`.
2. **Gegeben** der Lauf ist beendet, **dann** enthalten die Dateien alle Dokumente der Sammlung.

## Hinweise
Im Altprogramm sind die Optionen fehlerhaft (siehe `04-backend-behavior.md`); das Verhalten im Neubau muss den Happy Path zuverlässig erfüllen.
