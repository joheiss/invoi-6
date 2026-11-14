# A07 Profilbild hochladen und löschen

**Epic:** A · **Rolle:** `sys-admin` (und eigenes Profil)

## User Story
Als Benutzer möchte ich ein Profilbild hochladen oder löschen, damit ich in der Anwendung erkennbar bin.

## Akzeptanzkriterien
1. **Gegeben** ich bearbeite einen Benutzer, **wenn** ich „Bild hochladen" wähle und eine Bilddatei auswähle, **dann** wird sie unter `images/users/{uid}/` gespeichert.
2. **Gegeben** das Bild wurde gespeichert, **dann** erzeugt das System Miniaturen (32 und 64 px, PNG) und trägt die URL der 32-px-Miniatur als `imageUrl` im Profil ein (siehe I05).
3. **Gegeben** der Benutzer hat ein Bild, **wenn** ich „Bild löschen" wähle, **dann** wird das Bild entfernt und das Profil zeigt kein Bild mehr.
