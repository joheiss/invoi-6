# E09 Rechnungs-PDF erzeugen

**Epic:** E · **Rolle:** `sales-user`

## User Story
Als Vertriebsmitarbeiter möchte ich zu einer Rechnung ein PDF erzeugen, das ich versenden kann.

## Akzeptanzkriterien
1. **Gegeben** Status „In Bearbeitung" und Abrechnungsart „Rechnung", **dann** ist „PDF erzeugen" sichtbar.
2. **Gegeben** ich wähle „PDF erzeugen", **dann** erzeugt das System ein PDF „Rechnung" mit Absenderblock, Empfängeranschrift, Kunden-Nr., Rechnungs-Nr., Datum, Leistungszeitraum, Positionstabelle, Summen, Zahlungsbedingungen und Rechnungstext (Beträge im Format `1.234,50 €`).
3. **Gegeben** das PDF wurde erzeugt, **dann** liegt es unter `docs/invoices/{Nr}/R{Nr}.pdf` und ist als Dokument der Rechnung (Typ „Rechnung", an E-Mail anhängen) in der Dokumentliste sichtbar.
4. **Gegeben** das PDF wurde erzeugt, **dann** erscheint „Das PDF für die Rechnung wurde erstellt und gespeichert.".

## Hinweise
E-Mail-Versand („Senden") ist zurückgestellt.
