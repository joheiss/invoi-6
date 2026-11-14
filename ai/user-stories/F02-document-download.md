# F02 Dokument herunterladen

**Epic:** F · **Rolle:** `sales-user`, `auditor`*

## User Story
Als Benutzer möchte ich ein abgelegtes Dokument herunterladen.

## Akzeptanzkriterien
1. **Gegeben** ein Dokument steht in der Liste, **wenn** ich „Herunterladen" wähle, **dann** wird die Datei geladen.
2. **Gegeben** der Download war erfolgreich, **dann** erscheint die Meldung `file-download-success`.

*Hinweis:* Lesezugriff für `auditor` auf Storage `docs/**` hängt an der offenen Entscheidung zum Claim `isAuditor` (siehe `ai/spec/07-open-points.md`, A1).
