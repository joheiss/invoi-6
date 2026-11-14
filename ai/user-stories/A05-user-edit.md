# A05 Benutzer bearbeiten und sperren

**Epic:** A · **Rolle:** `sys-admin`

## User Story
Als Administrator möchte ich Name, Telefon, Organisation, Rollen und Sperrstatus eines Benutzers ändern, damit Zugänge aktuell bleiben.

## Akzeptanzkriterien
1. **Gegeben** ich öffne einen bestehenden Benutzer, **dann** ist das Feld E-Mail nicht änderbar und Passwortfelder fehlen.
2. **Gegeben** ich ändere gültige Werte (z. B. Rollen), **wenn** ich speichere, **dann** wird das Profil gespeichert und die Snackbar bestätigt die Änderung (`user-update-success`).
3. **Gegeben** ich habe die Rollen geändert, **dann** werden die Auth-Claims entsprechend neu gesetzt.
4. **Gegeben** ich setze „gesperrt?" und speichere, **dann** wird der Auth-Benutzer deaktiviert, und der Benutzer kann sich nicht mehr anmelden.
