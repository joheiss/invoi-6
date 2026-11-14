# Screens of the old application (invoi-6)

Screenshots of every reachable screen of the old Angular 11 app, taken on 2026-11-14 with Chromium (1440×900, `de-DE`,
`Europe/Berlin`; the logout/sidebar shots use 700 px width because the sidebar with "Abmelden" opens only on narrow screens).
File names: `<user>-<nn>-<screen>.png`; users: `anon` (not signed in), `sales` (`sales@test.local`), `admin`
(`admin@test.local`), `auditor` (`auditor@test.local`).

## Data and setup (nothing real is shown)

The old app ran against the local Firebase emulators loaded with the **anonymized copy** of production (`emulator-data/`
of `jovisco-invoicing-ai`), not against `invoi-p` or the staging project. The app source was copied to a scratch folder and
patched there; the old repo is untouched:

- `src/environments/environment.ts` (missing in git) with a fake Firebase config for `demo-invoicing`;
- `USE_EMULATOR` providers for Auth (9099) and Firestore (8080) in `app.module.ts`;
- `tsconfig.json` target `es2015` (webpack 4 cannot parse `?.`) and `import {Observable} from 'rxjs'` instead of
  `'rxjs/Observable'` (case-insensitive file system);
- build/serve with Node 22 and `NODE_OPTIONS=--openssl-legacy-provider`, `ng serve` (no proxy, no SSL).

`capture/shots.mjs` and `capture/logout.mjs` (Playwright) produced the images. Cloud Functions were not running: PDF
creation, sending, user creation and image upload were therefore not exercised.

## Observations that matter for the rebuild

- **The emulators ran without security rules**, so the auditor sees everything (`auditor-*`). With the real rules the old
  app shows an auditor nothing (open point A1); the rebuild shows read-only data (decision A1).
- Desktop layout: **no sidebar**; the menu items are in the header (Überblick, Rechnungsempfänger, Verträge, Rechnungen,
  the user menu "Test …", environment label "ENTWICKLUNG"). The sidebar (with "Abmelden") appears on narrow screens.
- Overview: "Offene Rechnungen" table (Nr., Kunde (number), Kunde (name), Datum, Leistungszeitraum, Nettobetrag,
  Zahlungsbetrag, Fällig am) and "Umsätze" table (3 years, 12 months and sum).
- Invoice and contract lists are **cards** (not tables) with "Details", "Kopieren" and "Löschen" (delete only on deletable
  items); the receiver list is cards too. Details pages are tabbed (receiver: Details, Kommunikation, Dokumente, Letzte
  Verträge, Letzte Rechnungen; invoice: Details, Texte, Dokumente) with collapsible sections (Vertragsinformationen,
  Zahlungsbedingungen, Positionen, Summen).
- Confirmation dialogs use "Ja"/"Nein" buttons ("Sie haben noch ungesicherte Änderungen. Wollen Sie den Dialog trotzdem
  verlassen?", "Soll die Rechnung 5231 wirklich gelöscht werden?").
- The user dialog "Benutzer pflegen" shows the user id ("Benutzerkennung"), email read-only, "gesperrt?", "Passwort
  ändern", "Bild hochladen".
- Logout shows the snackbar "Sie haben sich abgemeldet." and the route `/auth/goodbye` renders the text "Sie haben sich
  abgemeldet." at the top left.
- `/invoicing/confirmations` and `/home` render only placeholders (dropped in the rebuild, decision D1).
