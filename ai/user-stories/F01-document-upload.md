# F01 Dokument hochladen

**Epic:** F Dokumente · **Rolle:** `sales-user`

## User Story
Als Vertriebsmitarbeiter möchte ich an Empfänger, Verträgen und Rechnungen Dokumente ablegen.

## Akzeptanzkriterien
1. **Gegeben** ich öffne ein Objekt, **wenn** ich im Dokumentenbereich eine Datei auswähle, **dann** wird sie unter `docs/{Objekttyp}/{Nr}/` hochgeladen.
2. **Gegeben** der Upload ist beendet, **dann** erscheint ein Eintrag in der Dokumentliste mit Typ „Sonstiges" und „an E-Mail anhängen" aus.
3. **Gegeben** der Upload war erfolgreich, **dann** erscheint eine Erfolgsmeldung mit dem Dateinamen (`file-upload-success`).
