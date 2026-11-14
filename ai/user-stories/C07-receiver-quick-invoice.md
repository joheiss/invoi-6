# C07 Schnellrechnung aus dem Empfänger erzeugen

**Epic:** C · **Rolle:** `sales-user`

## User Story
Als Vertriebsmitarbeiter möchte ich für einen Empfänger mit genau einem abrechenbaren Vertrag per „Neue Rechnung" schnell eine Rechnung erstellen.

## Akzeptanzkriterien
1. **Gegeben** der Empfänger hat genau einen abrechenbaren Vertrag, das Formular ist gültig und unverändert, **dann** ist „Neue Rechnung" sichtbar.
2. **Gegeben** ich wähle „Neue Rechnung", **dann** öffnet sich das Schnellrechnungsformular (`/invoicing/invoices/quick`) mit Rechnungsdatum, Leistungszeitraum, Menge und Beschreibung.
3. **Gegeben** alle Pflichtfelder sind ausgefüllt, **dann** zeigt das Formular live Netto, MwSt und Brutto; der MwSt-Satz wird per Steuercode `{Land}_full` und Rechnungsdatum aus den Einstellungen ermittelt.
4. **Gegeben** ich speichere, **dann** wird eine Rechnung mit einer Position aus dem Vertrag angelegt (siehe E10).
