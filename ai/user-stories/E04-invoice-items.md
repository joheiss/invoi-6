# E04 Rechnungspositionen erfassen und Beträge berechnen

**Epic:** E · **Rolle:** `sales-user`

## User Story
Als Vertriebsmitarbeiter möchte ich Positionen erfassen und sofort Netto, MwSt, Brutto, Skonto und Zahlungsbetrag sehen.

## Akzeptanzkriterien
1. **Gegeben** ich füge eine Position hinzu, **dann** erhält sie die nächste freie Positionsnummer und die Voreinstellungen (Menge 0, Preis 0, Skonto nicht erlaubt).
2. **Gegeben** ich wähle eine Vertragsposition, **dann** werden Beschreibung, Einheit, Preis und Skonto-Kennzeichen aus ihr übernommen.
3. **Gegeben** ich gebe Menge und Einzelpreis im deutschen Format ein (z. B. `1.234,50`), **dann** zeigt die Position den Gesamtpreis (Menge × Einzelpreis).
4. **Gegeben** Positionen sind erfasst, **dann** zeigt die Rechnung Nettobetrag (Summe), MwSt-Betrag (Kopf-MwSt-Satz), Bruttobetrag, Skontobasis, Skontobetrag und Zahlungsbetrag.
5. **Gegeben** ich entferne eine Position, **dann** verschwindet sie und die Beträge werden neu berechnet.
