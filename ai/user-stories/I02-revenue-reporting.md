# I02 Umsatzfortschreibung

**Epic:** I · **Auslöser:** Anlegen, Ändern, Löschen von Rechnungen

## User Story
Als Vertriebsmitarbeiter möchte ich, dass der Umsatz je Jahr, Monat und Empfänger automatisch fortgeschrieben wird.

## Akzeptanzkriterien
1. **Gegeben** eine Rechnung wird angelegt, **dann** wird ihr Nettobetrag im Dokument `revenues/{Jahr}_{Organisation}` im Umsatzmonat und beim Empfänger addiert (fehlt das Dokument, der Monat oder der Empfänger, wird er angelegt).
2. **Gegeben** der Umsatzmonat ist bei Rechnungsdatum bis Tag 15 der Vormonat, ab Tag 16 der gleiche Monat.
3. **Gegeben** eine relevante Änderung (Status, Rechnungsdatum, Empfänger, Betrag), **dann** wird der alte Betrag abgezogen und der neue addiert.
4. **Gegeben** eine Rechnung wird gelöscht, **dann** wird ihr Betrag abgezogen (nie unter 0).
