# B02 Umsatz je Jahr und Monat ansehen

**Epic:** B · **Rolle:** `sales-user`, `auditor` · **Route:** `/invoicing`

## User Story
Als Vertriebsmitarbeiter möchte ich den Umsatz der letzten drei Jahre pro Monat sehen, damit ich die Geschäftsentwicklung beurteilen kann.

## Akzeptanzkriterien
1. **Gegeben** Umsatzdaten (`revenues`) liegen vor, **wenn** ich „Überblick" öffne, **dann** sehe ich die Umsatzliste für das aktuelle und die zwei vorherigen Jahre.
2. **Gegeben** die Liste ist sichtbar, **dann** zeigt jedes Jahr zwölf Monatssummen und eine Jahressumme über alle Empfänger.
3. **Gegeben** eine Rechnung kommt neu hinzu oder ändert sich, **dann** aktualisieren sich die Summen (siehe I02).
