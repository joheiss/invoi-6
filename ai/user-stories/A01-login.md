# A01 Anmelden

**Epic:** A Authentifizierung und Benutzer · **Rolle:** alle Benutzer · **Route:** `/auth/login`

## User Story
Als Benutzer möchte ich mich mit E-Mail und Passwort anmelden, damit ich die Anwendung mit meinen Rollen nutzen kann.

## Akzeptanzkriterien
1. **Gegeben** ich bin nicht angemeldet, **wenn** ich `/auth/login` öffne, **dann** sehe ich ein Formular mit E-Mail und Passwort.
2. **Gegeben** ich habe eine gültige E-Mail und das richtige Passwort eingegeben, **wenn** ich anmelde, **dann** werde ich angemeldet und mein Benutzerprofil (`user-profiles/{uid}`) wird geladen.
3. **Gegeben** ich bin angemeldet, **wenn** das Profil geladen ist, **dann** zeigt die Sidebar nur die Einträge, die zu meinen Rollen passen (siehe A09).
4. **Gegeben** E-Mail oder Passwort fehlen oder die E-Mail ist ungültig, **wenn** ich das Formular ansehe, **dann** ist die Anmeldeschaltfläche nicht bedienbar (Pflichtfelder, E-Mail-Format).

## Hinweise
Quelle: `ai/spec/01-features.md`, `05-ui-behavior.md` (Users / auth). Nach der Anmeldung wird das ID-Token in `sessionStorage['id_token']` abgelegt.
