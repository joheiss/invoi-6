# E05 Rechnung bearbeiten

**Epic:** E · **Rolle:** `sales-user`

## User Story
Als Vertriebsmitarbeiter möchte ich eine noch nicht bezahlte Rechnung ändern.

## Akzeptanzkriterien
1. **Gegeben** der Status ist nicht „bezahlt", **wenn** ich die Rechnung öffne, **dann** sind die Felder änderbar und „Speichern" ist sichtbar.
2. **Gegeben** ich ändere den Empfänger, **dann** wird der MwSt-Satz für sein Land neu ermittelt.
3. **Gegeben** ich ändere Werte und speichere, **dann** ist die Rechnung aktualisiert, und der Umsatz wird fortgeschrieben (siehe I02).
4. **Gegeben** der Status ist „bezahlt", **dann** ist die Rechnung nicht änderbar.
