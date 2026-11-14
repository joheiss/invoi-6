# H06 Gesperrter Benutzer hat keinen Zugriff

**Epic:** H · **Rolle:** gesperrter Benutzer

## User Story
Als Administrator möchte ich, dass ein gesperrter Benutzer die Anwendung nicht nutzen kann.

## Akzeptanzkriterien
1. **Gegeben** das Profil eines Benutzers ist gesperrt (`isLocked`), **wenn** er sich anmeldet, **dann** wird das Profil nicht akzeptiert und er erhält keinen Zugriff auf geschützte Seiten.
2. **Gegeben** der Administrator hebt die Sperre auf, **dann** kann sich der Benutzer wieder anmelden.
