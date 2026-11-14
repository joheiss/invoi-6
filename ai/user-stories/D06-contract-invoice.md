# D06 Rechnung aus Vertrag erzeugen

**Epic:** D · **Rolle:** `sales-user`

## User Story
Als Vertriebsmitarbeiter möchte ich aus einem laufenden Vertrag direkt eine Rechnung erzeugen.

## Akzeptanzkriterien
1. **Gegeben** die Laufzeit des Vertrags ist abrechenbar (Beginn ≤ heute ≤ Ende + 15 Tage), das Formular ist gültig und unverändert, **dann** ist „Neue Rechnung" sichtbar.
2. **Gegeben** ich wähle „Neue Rechnung", **dann** öffnet sich eine neue Rechnung, deren Kopfdaten aus dem Vertrag übernommen sind (Empfänger, Abrechnungsart, Zahlungsart, Zahlungsbedingungen, Skonto, Fälligkeit, Rechnungstext) und die Position aus der ersten Vertragsposition entsteht.
3. **Gegeben** der Vertrag ist nicht abrechenbar, **dann** ist „Neue Rechnung" nicht sichtbar.
