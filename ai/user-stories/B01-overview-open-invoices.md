# B01 Offene Rechnungen ansehen

**Epic:** B Überblick · **Rolle:** `sales-user`, `auditor` · **Route:** `/invoicing`

## User Story
Als Vertriebsmitarbeiter möchte ich auf der Überblicksseite alle offenen Rechnungen sehen, damit ich weiß, welche Zahlungen noch ausstehen.

## Akzeptanzkriterien
1. **Gegeben** es gibt Rechnungen mit Status „In Bearbeitung" oder „versandt", **wenn** ich „Überblick" öffne, **dann** sehe ich die Liste „Offene Rechnungen" mit Nr., Datum, Kunde, Leistungszeitraum, Nettobetrag, Zahlungsbetrag und Fällig am.
2. **Gegeben** die Liste hat mehrere Einträge, **dann** ist sie nach Fälligkeitsdatum aufsteigend sortiert.
3. **Gegeben** eine Rechnung ist bezahlt, **dann** erscheint sie nicht in der Liste.
4. **Gegeben** ich wähle eine Rechnung, **dann** öffnet sich ihre Detailseite.
