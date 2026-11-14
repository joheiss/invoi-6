# C03 Empfänger bearbeiten

**Epic:** C · **Rolle:** `sales-user`

## User Story
Als Vertriebsmitarbeiter möchte ich Stammdaten eines Empfängers ändern, damit Anschrift und Kontaktdaten aktuell sind.

## Akzeptanzkriterien
1. **Gegeben** ich öffne einen Empfänger, **dann** sehe ich alle Felder (Status, Name, Namenszusatz, Land, Straße, PLZ, Ort, E-Mail, Telefon, Fax, Webseite, Logo-URL) und die Nummer ist nicht änderbar.
2. **Gegeben** ich ändere ein Feld mit gültigem Wert, **dann** wird die Änderung nach 500 ms übernommen und „Speichern" ist bedienbar.
3. **Gegeben** ich wähle „Speichern", **dann** ist das Formular wieder unverändert (pristine) und die Änderung ist gespeichert.
