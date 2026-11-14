# I03 Offene Rechnungen im Backend

**Epic:** I · **Auslöser:** Batch `reporting-refresh` (siehe J01)

## User Story
Als Vertriebsmitarbeiter möchte ich eine Sammlung offener Rechnungen (`open-invoices`) haben, die den aktuellen Stand abbildet.

## Akzeptanzkriterien
1. **Gegeben** Rechnungen mit Status ungleich „bezahlt", **wenn** die Aktualisierung läuft, **dann** existiert zu jeder ein Dokument in `open-invoices` mit Empfängername, Leistungszeitraum, Nettobetrag, Zahlungsbetrag und Fälligkeitsdatum.
2. **Gegeben** eine Rechnung ist bezahlt, **dann** ist sie nach der Aktualisierung nicht mehr enthalten.

## Hinweise
Die Web-Oberfläche berechnet die Liste „Offene Rechnungen" selbst aus den Rechnungen (B01); die Sammlung wird nur vom Batch geschrieben.
