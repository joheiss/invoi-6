# E02 Rechnung anlegen

**Epic:** E · **Rolle:** `sales-user`

## User Story
Als Vertriebsmitarbeiter möchte ich eine neue Rechnung für einen Empfänger und Vertrag anlegen.

## Akzeptanzkriterien
1. **Gegeben** ich wähle „Neu", **dann** öffnet sich `/invoicing/invoices/new` mit nächster Nummer aus Nummernkreis `invoices`, Datum heute, Status „In Bearbeitung", MwSt 19 %, Zahlungsbedingung „30 Tage: netto".
2. **Gegeben** ich wähle Empfänger (aktive Empfänger) und Vertrag (abrechenbare Verträge), **dann** werden die Kopfdaten aus dem Vertrag übernommen und der MwSt-Satz des Empfängerlandes zum Rechnungsdatum aus den Einstellungen gesetzt.
3. **Gegeben** Pflichtfelder (Leistungszeitraum, Währung, Abrechnungsart, Zahlungsbedingungen, Zahlungsart, Fälligkeit) sind gültig und mindestens eine Position ist erfasst, **wenn** ich speichere, **dann** ist die Rechnung mit meiner Organisation gespeichert.
4. **Gegeben** die Rechnung wurde angelegt, **dann** wird der Nummernkreis fortgeschrieben und der Umsatz aktualisiert (siehe I01, I02).
