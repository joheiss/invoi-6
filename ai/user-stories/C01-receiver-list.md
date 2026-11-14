# C01 Empfängerliste ansehen

**Epic:** C Rechnungsempfänger · **Rolle:** `sales-user`, `auditor` · **Route:** `/invoicing/receivers`

## User Story
Als Vertriebsmitarbeiter möchte ich alle Rechnungsempfänger als Karten mit Kennzahlen sehen, damit ich den Stand je Kunde schnell erfasse.

## Akzeptanzkriterien
1. **Gegeben** Empfänger existieren, **wenn** ich „Rechnungsempfänger" öffne, **dann** sehe ich pro Empfänger eine Karte mit Nummer und Name.
2. **Gegeben** die Karten sind sichtbar, **dann** zeigt jede: Aktive Verträge, Abgelaufene Verträge, Letzter Vertrag, Fällige Rechnungen, Offene Rechnungen und letzte Rechnung.
3. **Gegeben** mehrere Empfänger, **dann** sind sie nach Nummer aufsteigend sortiert.
4. **Gegeben** ich wähle eine Karte, **dann** öffnet sich der Empfänger (`/invoicing/receivers/{id}`).
