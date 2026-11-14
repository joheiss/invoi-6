# A04 Benutzer anlegen

**Epic:** A · **Rolle:** `sys-admin`

## User Story
Als Administrator möchte ich einen neuen Benutzer mit Rollen und Startpasswort anlegen, damit ein Mitarbeiter Zugang erhält.

## Akzeptanzkriterien
1. **Gegeben** ich bin `sys-admin` in der Benutzerliste, **wenn** ich „Benutzer hinzufügen" wähle, **dann** öffnet sich ein Dialog mit E-Mail, Name, Telefon, Organisation, Rollen, Passwort und Passwortbestätigung.
2. **Gegeben** alle Pflichtfelder (E-Mail, Name, Organisation, Rollen, Passwort, Bestätigung) sind gültig und beide Passwörter stimmen überein, **wenn** ich speichere, **dann** wird in Firebase Auth ein Benutzer angelegt und das Profil `user-profiles/{uid}` geschrieben.
3. **Gegeben** der Benutzer wurde angelegt, **dann** erscheint die Snackbar „Der Benutzer {Name} wurde angelegt." und der Benutzer steht in der Liste.
4. **Gegeben** das Profil wurde geschrieben, **dann** setzt das System die Auth-Claims aus den Rollen (`sys-admin` → `isAdmin`, `sales-user` → `isSales`).
