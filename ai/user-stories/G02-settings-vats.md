# G02 Umsatzsteuer verwalten

**Epic:** G · **Rolle:** `sys-admin` · **Route:** `/invoicing/settings/vats`

## User Story
Als Administrator möchte ich Steuercodes und Gültigkeitszeiträume pflegen, damit Rechnungen den richtigen MwSt-Satz erhalten.

## Akzeptanzkriterien
1. **Gegeben** ich öffne „Umsatzsteuer", **dann** sehe ich die Steuercodes mit Zeiträumen und Prozentsätzen.
2. **Gegeben** ich lege einen neuen Steuercode (z. B. `DE_full`) mit Gültig ab und Prozentsatz an, **dann** wird er gespeichert.
3. **Gegeben** ein Steuercode existiert, **wenn** ich einen neuen Zeitraum hinzufüge, **dann** wird er gespeichert.
4. **Gegeben** ein Zeitraum existiert, **wenn** ich ihn bearbeite, **dann** wird die Änderung gespeichert.
5. **Gegeben** ein Steuersatz ist für das Rechnungsdatum hinterlegt, **dann** wird er in neuen Rechnungen verwendet (siehe E02).
