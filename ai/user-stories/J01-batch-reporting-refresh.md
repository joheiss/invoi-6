# J01 Batch: Berichte neu aufbauen (`reporting-refresh`)

**Epic:** J Batch-Jobs · **Rolle:** Betreiber (lokal, mit Service-Account)

## User Story
Als Betreiber möchte ich Umsatz und offene Rechnungen aus allen Rechnungen neu aufbauen, damit die Berichte nach Korrekturen wieder stimmen.

## Akzeptanzkriterien
1. **Gegeben** Rechnungen mit Umsatzperiode nach dem Vorjahr, **wenn** ich `reporting-refresh` ausführe, **dann** werden die Dokumente `revenues/{Jahr}_{Organisation}` für diese Jahre aus der Summe der Nettobeträge je Monat und Empfänger neu geschrieben.
2. **Gegeben** Jahre bis einschließlich Vorjahr − 1, **dann** bleiben ihre Umsatzdokumente unverändert.
3. **Gegeben** offene Rechnungen, **dann** werden alle `open-invoices` gelöscht und durch aktuelle Einträge (mit Empfängername) ersetzt.
4. **Gegeben** der Lauf ist beendet, **dann** meldet das Programm den Abschluss.
