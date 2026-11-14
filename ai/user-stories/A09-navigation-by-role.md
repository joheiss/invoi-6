# A09 Navigation nach Rolle

**Epic:** A · **Rolle:** alle

## User Story
Als Benutzer möchte ich in der Sidebar nur die Bereiche sehen, die für meine Rolle gedacht sind, damit die Navigation übersichtlich bleibt.

## Akzeptanzkriterien
1. **Gegeben** ich habe die Rolle `sales-user` oder `auditor`, **dann** sehe ich „Überblick", „Rechnungsempfänger", „Verträge" und „Rechnungen".
2. **Gegeben** ich habe die Rolle `sys-admin`, **dann** sehe ich zusätzlich „Einstellungen" und „Benutzer".
3. **Gegeben** ich bin nicht angemeldet, **dann** sehe ich nur „Anmelden".
4. **Gegeben** ich wähle einen sichtbaren Eintrag, **dann** öffnet sich die zugehörige Route (siehe `01-features.md`).
