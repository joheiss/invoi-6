# A06 Passwort ändern

**Epic:** A · **Rolle:** angemeldeter Benutzer (eigenes Passwort), `sys-admin` (fremde Passwörter)

## User Story
Als Benutzer möchte ich ein neues Passwort setzen, damit mein Zugang sicher bleibt.

## Akzeptanzkriterien
1. **Gegeben** ich ändere mein eigenes Passwort, **wenn** ich den Dialog öffne, **dann** muss ich altes Passwort, neues Passwort und Bestätigung angeben.
2. **Gegeben** ein Administrator setzt das Passwort eines anderen Benutzers, **dann** sind nur neues Passwort und Bestätigung nötig.
3. **Gegeben** neues Passwort und Bestätigung stimmen überein, **wenn** ich speichere, **dann** wird das Passwort in Firebase Auth geändert, und es erscheint „Das Passwort wurde geändert.".
4. **Gegeben** nur das Passwort wurde geändert, **dann** bleibt das Benutzerprofil unverändert.
