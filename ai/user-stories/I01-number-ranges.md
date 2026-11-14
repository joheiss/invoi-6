# I01 Nummernvergabe

**Epic:** I Hintergrundverhalten · **Auslöser:** Anlegen/Löschen von Empfängern, Verträgen, Rechnungen

## User Story
Als Anwender möchte ich, dass Nummern automatisch fortlaufend vergeben werden.

## Akzeptanzkriterien
1. **Gegeben** ein Nummernkreis ohne `lastUsedId`, **dann** beginnt die erste Nummer bei `startAtId`.
2. **Gegeben** ein Nummernkreis mit `lastUsedId`, **dann** ist die nächste Nummer `lastUsedId + 1`.
3. **Gegeben** ein Empfänger, Vertrag oder eine Rechnung wird angelegt, **dann** wird `lastUsedId` des passenden Nummernkreises (`receivers`, `contracts`, `invoices`, bei Gutschriftverfahren `credit-requests`) auf die vergebene Nummer gesetzt.
4. **Gegeben** das zuletzt angelegte Objekt wird gelöscht, **dann** wird `lastUsedId` um 1 verringert; beim Löschen eines älteren Objekts bleibt der Zähler unverändert.
