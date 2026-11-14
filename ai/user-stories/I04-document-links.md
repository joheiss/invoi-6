# I04 Dokumentverknüpfungen pflegen

**Epic:** I · **Auslöser:** Upload, Löschen von Dateien oder Objekten

## User Story
Als Benutzer möchte ich, dass Dateien und ihre Verknüpfungen (`document-links`) konsistent bleiben.

## Akzeptanzkriterien
1. **Gegeben** eine Datei mit Metadaten (`owner`, `type`, `attachToEmail`) wird hochgeladen, **dann** werden die vorhandenen Verknüpfungen mit diesem Pfad aktualisiert.
2. **Gegeben** eine Datei mit `owner` wird aus dem Storage gelöscht, **dann** werden die Verknüpfungen mit diesem Pfad gelöscht.
3. **Gegeben** eine Verknüpfung wird gelöscht, **dann** wird die Datei im Storage gelöscht.
4. **Gegeben** ein Empfänger, Vertrag oder eine Rechnung wird gelöscht, **dann** werden alle Verknüpfungen mit `owner == {Objekttyp}/{Nr}` gelöscht.
