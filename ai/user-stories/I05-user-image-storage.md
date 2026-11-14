# I05 Profilbild verarbeiten und Benutzerprofil abgleichen

**Epic:** I · **Auslöser:** Upload unter `images/users/`, Änderung von `user-profiles`

## User Story
Als Administrator möchte ich, dass Profilbilder skaliert werden und Profil und Anmeldung abgeglichen bleiben.

## Akzeptanzkriterien
1. **Gegeben** ein Bild wird unter `images/users/{uid}/` hochgeladen, **dann** entstehen zwei PNG-Miniaturen (32 und 64 px) unter `.../thumbs/profile-image_{Größe}_thumb.png`, öffentlich lesbar, und `imageUrl` im Profil zeigt auf die 32-px-Miniatur.
2. **Gegeben** ein Profil wird angelegt oder geändert, **dann** werden Anzeigename, Sperrstatus (`disabled`), Telefon und Bild-URL in Firebase Auth übernommen und die Claims `isAdmin`/`isSales` aus den Rollen gesetzt.
3. **Gegeben** ein Profil wird gelöscht, **dann** werden `isAdmin` und `isSales` auf `false` gesetzt.
