# A02 Abmelden

**Epic:** A · **Rolle:** angemeldete Benutzer · **Route:** `/auth/goodbye`

## User Story
Als angemeldeter Benutzer möchte ich mich abmelden, damit niemand anderes mit meinem Zugang arbeiten kann.

## Akzeptanzkriterien
1. **Gegeben** ich bin angemeldet, **wenn** ich in der Sidebar „Abmelden" wähle, **dann** werde ich abgemeldet.
2. **Gegeben** die Abmeldung war erfolgreich, **dann** erscheint die Snackbar „Sie haben sich abgemeldet." (`user-logged-out`).
3. **Gegeben** ich bin abgemeldet, **dann** zeigt die Sidebar „Anmelden" statt „Abmelden" und geschützte Seiten sind nicht mehr erreichbar.
