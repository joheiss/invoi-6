# Invoicing Rebuild (Reverse Engineering) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a new invoicing application in a separate repo, on the latest Angular (signal-based, zoneless), with the same behavior as the current `invoi-6` project, running against a copy of the Firebase project `invoi-p` for staging and against the Firebase Emulator Suite with seed data for local development and tests.

**Architecture:** The old repo is the executable specification. Phase 1 turns it into written specs and captured data. Phase 2 sets up the new repo and a local data store (emulators seeded from a copy of production data). Phase 3 rebuilds backend and frontend feature by feature, each feature proven against the specs with tests that run on the emulators. The **Firestore schema, Auth custom claims and Storage layout stay unchanged**, so the new app can later be pointed at the real `invoi-p` without a data migration.

**Tech Stack (verified on npm 2026-11-14; re-check when starting):** Angular 22.x (`@angular/core` 22.2.6), Angular Material 22.x, `@ngrx/signals` 22.x (SignalStore), `@angular/fire` 21.x (check Angular 22 peer range) and `firebase` 13.x (modular), RxJS 7.x only where Angular APIs need it, TypeScript as required by Angular 22, Vitest (Angular's default unit-test runner), Playwright (e2e), Node `^22.22.3 || ^24.15.0`, `firebase-functions` 7.x (v2 API) and `firebase-admin` 14.x, `firebase-tools` current (Emulator Suite), PDFKit, SendGrid (or SMTP, see Open Questions).

**Spec:** Produced by Task 1 in the old repo: `ai/spec/*.md` (feature inventory, data model, rules, functions behavior, UI behavior). Existing inputs: `ai/project-description.md`. **User stories with acceptance criteria (happy path, German):** `ai/user-stories/` (index: `ai/user-stories/README.md`). Each feature task lists its story IDs under "Stories"; the acceptance criteria of those stories are the acceptance tests of the task (Vitest component tests and Playwright flows), and Task 15 checks that every story is covered.

## Decisions (already made by the owner)

- New code goes in a **separate new repo**: `https://github.com/joheiss/jovisco-invoicing-ai.git`. The old repo stays untouched as reference until cutover.
- The Firebase CLI user can export from `invoi-p` and a new staging project may be created (confirmed).
- The `jovisco-domain` source repository is available (confirmed; its local path or URL is still needed for Task 1 Step 6).
- **Email sending is out of scope for now.** `POST /invoice-email/:id` and the SendGrid dependency are skipped; the UI keeps the button hidden or disabled.
- No behavior changes are wanted: the new app reproduces the old behavior, **except** for the fixes listed under "Owner decisions on found defects" below.
- The backend (Cloud Functions, shared code, batch jobs) is **rewritten with the same behavior**.
- Frontend: **Angular Material + NgRx SignalStore** (`@ngrx/signals`), no classic NgRx store/effects.
- `jovisco-domain` reuse is **undecided**: Task 1 answers it.

## Owner decisions on found defects (2026-11-14)

Source: `ai/spec/07-open-points.md`. These are intended differences from the old app; they are excluded from the parity comparison in Task 15. All other open points keep the old behavior (pinned by a characterization test).

| ID | Decision | Owning task |
|---|---|---|
| A1 | `auditor` is read-only: Firestore rules let `auditor` read what `sales-user` reads, no writes. **Confirmed 2026-11-14:** Storage `docs/**` is readable by auditors through a new custom claim `isAuditor` (set from role `auditor`, never grants writes). | 4, 5 |
| A4 | The route role guard allows access only when `intersection(userRoles, routeRoles).length > 0` (the old guard was always true). | 6 |
| A5 | User endpoints (`POST /users/new`, `POST /users/:id`) require the `isAdmin` claim. A user's own password change still works through the client SDK. | 5, 13 |
| C1 | `getNextItemId` returns the smallest unused positive id. | 5 (domain), 10 |
| C2 | VAT 0 % is honored (fallback to 19 only when the value is undefined). | 5 (domain), 10 |
| C6 | Ids are compared numerically. | 5 (domain), 8, 9, 10 |
| D1 | `/home` stays only as a redirect target without placeholder text; `/invoicing/confirmations` is removed. | 6, 11 |

## Global Constraints

- Angular code style: standalone components only, `inject()` for DI, `input()`/`output()`/`model()`/`viewChild()`, `computed()`, built-in control flow (`@if`, `@for` with `track`, `@switch`), `ChangeDetectionStrategy.OnPush`, zoneless (`provideZonelessChangeDetection()`), typed reactive forms, functional guards/interceptors/resolvers. No `NgModule`, no `*ngIf`, no `@Input()` decorators.
- Firestore collections and field names stay exactly as today: `user-profiles`, `settings`, `number-ranges`, `revenues`, `open-invoices`, `receivers`, `contracts`, `invoices`, `document-links`. Custom claims stay `isAdmin` and `isSales` (plus `isAuditor`, confirmed for decision A1; it only grants read access to Storage `docs/**`). Storage paths stay `assets/`, `docs/`, `images/users/`, `docs/invoices/{id}/R{id}.pdf`.
- Roles stay `sys-admin`, `sales-user`, `auditor`. Locale `de-DE`.
- Development and tests never touch `invoi-p` or the staging copy: they run on emulators. The code reads the target from environment files; **no secrets, service-account keys or real customer data are committed** (seed data is anonymized, `.gitignore` covers `credentials*.json`, `*.pem`, raw exports).
- Every feature task starts with tests derived from the specs (characterization tests) and ends with a green `npm test`, `npm run lint` and `npm run build`.
- One commit per task step group; the main branch stays green.

## Review Focus

Behaviors the code implies but nobody tested. Each is pinned by a test in the owning task.

1. **Number ranges under creation and deletion.** Creating and deleting invoices, contracts and receivers moves the range counter and restores it on deletion. Credit requests use their own range (`billingMethod === 1`). Pinned in Task 5.
2. **Delete restrictions.** Receivers and contracts are deletable only when `isDeletable`; invoices only when `status == 0`. The security rules enforce this, not just the UI. Pinned in Task 4.
3. **Revenue and open-invoice reporting.** The reporting changes only when an invoice update is relevant, and the previous year is locked in the batch job. Pinned in Tasks 5 and 14.
4. **Roles and claims.** A user-profile write changes the Auth custom claims; deleting a profile clears both claims; a user can only read their own profile unless `sys-admin`. Pinned in Tasks 4 and 5.
5. **Unsaved-changes guard and German formatting.** Leaving a dirty details form asks for confirmation; amounts, dates and phone numbers are formatted per `de-DE` (also in the PDF). Pinned in Tasks 5 and 10.

---

## Phase 1: Capture the specification

### Task 1: Reverse engineer the old project into specs

**Files (in the OLD repo):**
- Create: `ai/spec/01-features.md`, `02-data-model.md`, `03-security.md`, `04-backend-behavior.md`, `05-ui-behavior.md`, `06-domain-package.md`, `07-open-points.md`
- Read: `web/src/**`, `functions/src/**`, `shared/src/**`, `batches/src/**`, `db-rules.txt`, `storage-rules.txt`, `web/cypress/integration/**`, `web/src/**/*.spec.ts`

**Interfaces:**
- Produces: the written spec every later task cites. Each spec section ends with a `Tests to write` list that names the cases the new project must cover.

- [ ] **Step 1: Feature inventory** (`01-features.md`). One row per route/screen: `/home`, `/invoicing` (overview), `receivers`, `receivers/:id`, `contracts`, `contracts/:id`, `invoices`, `invoices/:id`, `confirmations`, admin (settings, countries, VAT), users, login, password change, goodbye, document link lists. For each: purpose, required role, which collections it reads/writes, buttons and actions, dialogs. Derive from `*-routing.module.ts`, container components and their templates.
- [ ] **Step 2: Data model** (`02-data-model.md`). For each collection: fields, types, enums (for example `InvoiceStatus`, `billingMethod`, `type`), id format and number-range usage, derived fields (`isDeletable`, `objectType`), sub-structures (items, texts). Source: the `jovisco-domain` types and factories plus real documents from Task 2's copy (sample 3 per collection, anonymized).
- [ ] **Step 3: Security** (`03-security.md`). Transcribe `db-rules.txt` and `storage-rules.txt` into a role-by-collection-by-operation matrix, including the `canDelete*` conditions.
- [ ] **Step 4: Backend behavior** (`04-backend-behavior.md`). One section per function in `functions/src/index.ts` (4 HTTP routes, 10 Firestore triggers, 3 Storage triggers) and per batch job: trigger, input, side effects, error handling, and quirks worth preserving or fixing (for example `handleReceiverDeletion` swallows errors in some handlers and throws in others).
- [ ] **Step 5: UI behavior** (`05-ui-behavior.md`). Per screen: list columns and sort options, filters, form fields with validators, computed values (item totals, VAT, due dates), status transitions of an invoice, messages (German texts from `*-messages.ts`, `*-error-messages.ts`), dialogs, unsaved-changes handling. Take screenshots of each screen from the running old app against the staging copy (Task 2) into `ai/spec/screens/`.
- [ ] **Step 6: Domain package decision** (`06-domain-package.md`). Run `npm view jovisco-domain`, install it in a scratch folder, read its `.d.ts` and compiled code. Record: exported types, factories (`InvoiceFactory`, …), calculation logic, runtime dependencies (`moment`?), module format, and whether the source repo is available to you. **Decision rule:** the source repo is available, so if its build works with TypeScript 5 and ESM, publish `jovisco-domain@2` and reuse it; otherwise re-create it as an internal package `packages/domain` in the new repo with tests that pin each calculation to values from sample documents.
- [ ] **Step 7: Open points** (`07-open-points.md`). List behaviors that are unclear, look like bugs, or that you suggest to change. The owner decides before the related feature task starts.
- [ ] **Step 8:** Commit in the old repo: `docs: reverse engineered specification`.

### Task 2: Copy of `invoi-p` and a local data store

**Files:**
- Create (new repo): `firebase.json`, `.firebaserc`, `emulator-data/` (anonymized export), `scripts/anonymize.ts`, `scripts/seed.ts`, `docs/environments.md`
- Create (old repo): none

**Interfaces:**
- Produces: (a) a Firebase staging project that is a copy of `invoi-p` (working name `invoicing-staging`); (b) `emulator-data/` loadable with `firebase emulators:start --import ./emulator-data`; (c) `npm run seed` that rebuilds the emulator data from scratch. Users in the seed: `admin@test.local` (`sys-admin`), `sales@test.local` (`sales-user`), `auditor@test.local` (`auditor`), with the matching custom claims.

- [ ] **Step 1 (needs the owner):** Create the staging Firebase project (Blaze plan, same region as `invoi-p`). Owner grants the CLI user `Cloud Datastore Import Export Admin` and Storage access on both projects. Never deploy the new code to `invoi-p` at this stage.
- [ ] **Step 2:** Export production data: `gcloud firestore export gs://<export-bucket>/export-<date> --project invoi-p`. Copy Storage `docs/`, `assets/` and `images/` with `gsutil -m cp -r`. Export Auth users with `firebase auth:export users.json --project invoi-p`. Keep all raw exports **outside both repos**.
- [ ] **Step 3:** Import into the staging project (`gcloud firestore import`, `gsutil cp`, `firebase auth:import`). Confirm document counts per collection match production.
- [ ] **Step 4: Anonymize** (`scripts/anonymize.ts`): replace receiver names, addresses, emails, phone numbers, bank details, invoice texts and document file contents with fake values while keeping ids, numbers, dates, amounts, statuses and structure. Replace Auth users with the three test users. Unit test: running it on a fixture removes every value in a denylist of real strings and keeps the document count.
- [ ] **Step 5:** Start the emulators (Auth, Firestore, Storage, Functions, Hosting; UI on). Import the anonymized data from staging into the emulator, then `firebase emulators:export ./emulator-data`. Commit `emulator-data/` only if it passes the anonymization check from Step 4.
- [ ] **Step 6: Write `scripts/seed.ts`** that builds a small deterministic data set directly via the Admin SDK against the emulator (3 receivers, 3 contracts, 6 invoices in different statuses, number ranges, settings, countries, VAT rates, one document link), for tests that need a known state.
- [ ] **Step 7:** `docs/environments.md` describes the three targets: `local` (emulators), `staging` (the copy), `prod` (`invoi-p`, cutover only). Environment config is read from `src/environments/environment.*.ts` files that are **committed with placeholders** and filled from `environment.local.example.ts`.
- [ ] **Step 8:** Commit: `chore: environments and emulator data`.

## Phase 2: New repo scaffold

### Task 3: Scaffold the new repo

**Done 2026-11-14** (commit `chore: scaffold ...` in the new repo). Deviations from the steps below: (1) **`@angular/fire` is not used**: version 21 supports Angular 21 only (peer `@angular/core ^21.2`, `typescript >=5.8 <6`) and Angular 22 requires TypeScript 6; Firebase goes through the modular `firebase` SDK in `apps/web/src/app/core/firebase` and lint rejects `@angular/fire` imports. (2) Angular 22 is zoneless by default and OnPush is the default change detection, so no explicit zoneless provider is needed. (3) Environment files (`environment.ts` = emulators, `.staging.ts`, `.prod.ts`, `.local.example.ts`) were created here, completing Task 2 Step 7. (4) File naming follows the 2016 style guide (`*.component.ts`) as used in this plan. (5) Initial bundle budget raised to 900 kB/1.5 MB (Firebase SDK).

**Files (new repo):**
- Create: `package.json` (npm workspaces: `apps/web`, `functions`, `packages/domain`, `tools/batches`), `apps/web/` (Angular CLI), `functions/`, `packages/domain/`, `tools/batches/`, `eslint.config.js`, `.editorconfig`, `.gitignore`, `README.md`, `.github/workflows/ci.yml` (or equivalent)

**Interfaces:**
- Produces: `npm run emulators`, `npm run web:start`, `npm test` (all workspaces), `npm run lint`, `npm run e2e`, `npm run build`; all green on an empty app.

- [ ] **Step 1:** `ng new web --directory apps/web --style=scss --routing --ssr=false` with the current CLI; confirm it is zoneless, standalone and uses Vitest and the `application` builder. Add Angular Material (`ng add @angular/material`) with `de-DE` locale registered in `app.config.ts` (`LOCALE_ID`, `registerLocaleData(localeDe)`), plus `@angular/pwa` for the service worker.
- [ ] **Step 2:** Add `angular-eslint`; enforce through lint rules: no `NgModule`, no `*ngIf/*ngFor`, prefer `inject`, prefer signal inputs/outputs/queries, `OnPush` required.
- [ ] **Step 3:** Add Playwright (`apps/web/e2e/`) with a config that starts the emulators and the dev server before the tests, and a single smoke test: the login page renders.
- [ ] **Step 4:** Add `firebase.json` emulator ports and `npm run emulators` (`firebase emulators:start --import ./emulator-data --export-on-exit`). Add `firebase-tools` as a devDependency.
- [ ] **Step 5:** CI workflow: install, lint, unit tests, build, and e2e on emulators.
- [ ] **Step 6:** Commit: `chore: scaffold`.

### Task 4: Security rules and rules tests

**Done 2026-11-14** (new repo: `firestore.rules`, `storage.rules`, `functions/test/rules/*.test.ts`; run `npm run test:rules`, 261 tests on the emulators, also in CI). Rules are the old ones plus decision A1 (auditor reads what sales-user reads in Firestore; claim `isAuditor` reads `docs/**` in Storage; no writes). Tests are table-driven over collection x operation x caller (unauthenticated, no profile, auditor, sales, admin, admin+sales), plus delete restrictions (missing `isDeletable` is denied, finding R6), profile access, roles-from-profile, and the A3 profile-image quirk. A mutation check (removing the A1 and delete rules) makes 11 tests fail. The test administrator now has `sys-admin` + `sales-user` like the real one (R9).

**Files:**
- Create: `firestore.rules`, `storage.rules`, `functions/test/rules/*.test.ts`
- Spec: `ai/spec/03-security.md`
- Stories: `H05` (auditor read-only), `H06` (locked user), `A09` (roles and navigation), `F02` (document read access)

**Interfaces:**
- Produces: rules identical in behavior to `db-rules.txt` and `storage-rules.txt`, verified by `@firebase/rules-unit-testing` against the emulator.

- [ ] **Step 1: Write the failing tests** from the matrix in `03-security.md`. Required cases (Review Focus 2 and 4): a `sales-user` can create/read/update `receivers`, but deleting a receiver with `isDeletable: false` is denied and with `true` is allowed; deleting an invoice with `status: 0` is allowed and with `status: 1` denied; `sys-admin` only can write `settings`, `revenues`, `open-invoices`; a user reads their own `user-profiles/{uid}` but not another one; an unauthenticated request is denied everywhere; Storage: `docs/**` needs the `isSales` claim, `assets/**` write needs `isAdmin`, `images/users/{uid}` write allowed for the owner. **Decision A1:** an `auditor` can read `receivers`, `contracts`, `invoices`, `revenues`, `open-invoices`, `document-links`, `settings` and `number-ranges` but every write is denied Storage: `docs/**` read is allowed for the `isSales` or the `isAuditor` claim; `docs/**` write only for `isSales`.
- [ ] **Step 2:** Run: `npx firebase emulators:exec --only firestore,storage "npm test -w functions -- rules"`. Expected: FAIL (rules files empty).
- [ ] **Step 3:** Port the rules from `db-rules.txt` and `storage-rules.txt` to `firestore.rules` and `storage.rules`, keeping behavior identical **except decision A1** (auditor read access). Do not "improve" them otherwise; list suspected gaps in `ai/spec/07-open-points.md`.
- [ ] **Step 4:** Run the tests again. Expected: PASS. Commit.

### Task 5 (Backend): Domain package and Cloud Functions

**Done 2026-11-14** (new repo). Domain: `packages/domain` (ported `jovisco-domain` 1.0.70: all 71 old tests unchanged on Vitest with luxon 3 and TypeScript 6, plus 18 tests for decisions C1/C2/C6 and golden records of the old package for the 123 anonymized invoices). Functions: `functions/src` on the v2 API with the old export names, bundled with esbuild into `lib/index.js` (lodash and luxon are bundled; a Node ESM import of `lodash` named exports fails in the real runtime, found by the Functions-emulator tests). Tests: `npm test` (unit), `npm run test:backend` (81 tests on Auth/Firestore/Storage emulators), `npm run test:functions` (6 end-to-end tests of the built bundle in the Functions emulator), all in CI. Step 7 (email) skipped as decided: `POST /invoice-email/:id` answers 501.

Implementation decisions (not in the owner decision table, flagged for confirmation):
- **B1 fixed:** the triggers convert Firestore Timestamps to Dates before using the domain; no `revenues/NaN_*` documents can be created. `isInvoiceUpdateRelevantForRevenue` compares the issue date by value (the old reference comparison made every non-identical update relevant; the effect on the reporting was the same).
- **Document link paths** are matched in both spellings (with and without leading slash, finding R4); stored files are addressed without the slash. Finalizing a Storage object still only updates existing links (never creates one), so Step 5's "finalize creates the link" in the list below does not apply.
- **Profile mirror:** an empty phone number or image url is sent as `null` (the old code sent an empty string, which the Auth API rejects), and claims are set in every case. `disabled` is `!!isLocked`.
- **PDF:** dates are formatted in `Europe/Berlin` (the old code always fell back to UTC + 120 minutes); the PDF is built in memory and uploaded with the metadata in one call. Letterhead images: placeholders are committed, the real images (restored from commit `e0b1120` of this repo) are committed in `functions/assets/img/` of the new (private) repo, owner decision 2026-11-14.
- **Thumbnails** are awaited; the image url uses the bucket of the object (B8/B9).
- **HTTP 500** answers `{error: <message>}` instead of `{}`; user endpoints require `isAdmin` (A5); `__session` cookie support was dropped because it never worked.

**Files:**
- Create: `packages/domain/src/**` (or dependency on `jovisco-domain@2` per Task 1 Step 6), `functions/src/index.ts`, `functions/src/http/{users,invoices}.ts`, `functions/src/triggers/{receivers,contracts,invoices,user-profiles,document-links}.ts`, `functions/src/storage/{finalize,delete,metadata}.ts`, `functions/src/printforms/**`, `functions/src/lib/{number-ranges,revenues,auth-claims}.ts`, tests beside each
- Spec: `ai/spec/04-backend-behavior.md`
- Stories: `I01` (number ranges, Step 2), `I02` (revenue reporting, Step 3), `I05` (claims and user images, Step 4), `I04` (document links, Step 5), `E09` (PDF, Step 6), `A04`/`A05`/`A06` (user endpoints, Step 4)

**Interfaces:**
- Produces, exported with the same names as today so Firebase triggers and HTTP URLs are unchanged: `invoicing` and `users` (HTTPS, Express with ID-token validation; routes `POST /new`, `POST /:id`, `POST /invoice-pdf/:id`; `POST /invoice-email/:id` is deferred), `onCreateReceiver`, `onDeleteReceiver`, `onCreateContract`, `onDeleteContract`, `onCreateInvoice`, `onDeleteInvoice`, `onUpdateInvoice`, `onCreateUserProfile`, `onDeleteUserProfile`, `onUpdateUserProfile`, `onDeleteDocumentLink`, `onDeleteDocument`, `onFinalizedDocument`, `onMetadataUpdate`. Implemented with the `firebase-functions` v2 API where a v2 equivalent exists (`onDocumentCreated`, `onDocumentUpdated`, `onDocumentDeleted`, `onRequest`, `onObjectFinalized`, `onObjectDeleted`, `onObjectMetadataUpdated`). Internal helpers: `updateNumberRange(rangeId: string, docId: string): Promise<void>`, `resetNumberRange(rangeId: string, docId: string): Promise<void>`, `updateRevenueReporting(newInvoice: InvoiceData | null, oldInvoice: InvoiceData | null): Promise<void>`, `updateAuthClaims(uid: string, profile: UserProfileData): Promise<void>`.

Split into sub-steps by group. Each group: tests first against the Firestore/Auth/Storage emulators, then implementation.

- [ ] **Step 1 (domain):** Build the domain types, enums, factories and calculations (`InvoiceFactory.fromData(data)`, item and VAT totals, status transitions). Characterization tests use the sample documents from Task 2 and assert the totals the old code computed (take the expected values from running the old `jovisco-domain` on the same documents). **Decisions C1, C2, C6** are pinned by tests that expect the corrected behavior: `getNextItemId([1,3]) === 2`, `[2,3] === 1`, `[1,2,10] === 3`, `[] === 1`; an invoice with `vatPercentage: 0` has `vatAmount === 0` and `vatPercentage: undefined` falls back to 19; ids `'9999'` and `'10000'` compare numerically (`'10000'` is the latest).
- [ ] **Step 2 (number ranges, Review Focus 1):** Test: creating `invoices/{id}` raises the `invoices` range by one; `billingMethod: 1` raises `credit-requests` instead; deleting restores the previous value; same for receivers and contracts. Implement the triggers on top of `lib/number-ranges.ts`.
- [ ] **Step 3 (revenue reporting, Review Focus 3):** Test: creating an invoice adds its amount to `revenues`/`open-invoices`; an update that changes only a text field changes nothing; an update that changes status or amount adjusts reporting by the difference; deleting removes its contribution. Port `isInvoiceUpdateRelevantForRevenue` logic as a pure function with its own unit tests.
- [ ] **Step 4 (users and claims, Review Focus 4):** Test: creating a profile with roles `['sales-user']` sets `{isSales: true, isAdmin: false}`; `['sys-admin']` sets `isAdmin: true`; deleting the profile sets both to `false`; `POST /new` creates an Auth user and profile and is refused (403) for callers without the `isAdmin` claim (decision A5), likewise `POST /:id`; `POST /:id` updates the user for admins; `['auditor']` sets `{isAdmin: false, isSales: false, isAuditor: true}`; roles without `auditor` set `isAuditor: false`; deleting the profile sets all three claims to `false`.
- [ ] **Step 5 (documents):** Test: deleting a `document-links` doc deletes the Storage file; deleting an invoice, contract or receiver deletes the links with `owner == 'invoices/{id}'` (and so on); finalizing a Storage object creates the `document-links` doc; metadata updates are reflected.
- [ ] **Step 6 (PDF, Review Focus 5):** Test: `POST /invoice-pdf/:id` for a seeded invoice returns 200, stores `docs/invoices/{id}/R{id}.pdf` with metadata `owner`, `type: 0`, `attachToEmail: true`, creates the `document-link`, and the PDF text contains the German formatted total (for example `1.234,50`) and the invoice number. Port `InvoiceFormDataMapper`, `InvoiceForm`, `BaseForm` with PDFKit.
- [ ] **Step 7 (email): SKIPPED for now (owner decision).** Do not implement `POST /invoice-email/:id` or add `@sendgrid/mail`. Document the old behavior in `ai/spec/04-backend-behavior.md` so it can be added later behind a `MailSender` interface.
- [ ] **Step 8:** Run `npm test -w functions` on the emulators (`firebase emulators:exec`). Expected: all green. Commit per group.

## Phase 3: Frontend, feature by feature

Every feature task follows the same loop: (1) read the section of `01-features.md` and `05-ui-behavior.md` and the task's user stories in `ai/user-stories/` (each acceptance criterion becomes at least one test; cross-cutting stories `H01`–`H04` apply to every task with forms); (2) write component tests (Vitest, `TestBed`, SignalStore tests) and one Playwright flow against the seeded emulators; (3) implement; (4) compare to the old screen using `ai/spec/screens/`; (5) green build, lint, tests; (6) commit.

### Task 6: Core: Firebase, auth, shell, layout

**Done 2026-11-14** (new repo). Delivered: `AuthStore` (signal store; roles from the profile document, claims from the ID token; locked or missing profile is signed out again), `AuthGateway` (the only Firebase Auth/profile access, faked in unit tests), `UiStore` (spinner counter, sidebar, snackbar by usage with the old durations and styles, yes/no confirmation), `authGuard`, `roleGuard` (decision A4), `homeGuard` (decision D1), `authInterceptor`, message catalog (`AUTH_MSGS` ported, the old missing space after "fehlgeschlagen." in two texts corrected), shell with header (wide screens), sidebar (narrow screens), login, goodbye/logout, password-change dialog and confirmation dialog (Ja/Nein), green header and dark page like the old app. Tests: 76 unit tests, 12 Playwright tests against the emulators with the real security rules (`npm run e2e`), covering stories A01, A02, A06 (dialog; entry point comes with Task 13), A09, H04, H06.

Implementation decisions (flagged for confirmation):
- A locked user is signed out and sees "Der Benutzer ist gesperrt." (the old app waited forever behind the spinner); new message id `user-locked`.
- The domain `Messages` class returned a broken object for unknown ids (the catalog entry was a string); fixed and tested in `packages/domain`.
- `/home` forwards a signed-in user to the landing screen of the role (`/invoicing`, `/invoicing/settings` for an administrator without sales role) as soon as that route exists; until then it stays blank.
- The profile menu has only "Abmelden"; "Meine Daten" and the password change entry come with Task 13.
- The domain package is built into `dist` (esbuild bundle + declarations) because the web build type-checks imported TypeScript with its stricter options; `npm install` and the `pretest`/`prebuild` hooks build it.
- Entries of the menu use the Material icons font self-hosted; sidebar and header share `NAV_ITEMS`.

**Stories:** `A01`, `A02`, `A09`, `H04`, `H06`, `A06` (own password change dialog)

**Files (new repo, `apps/web/src/app/`):**
- Create: `app.config.ts`, `app.routes.ts`, `core/firebase.providers.ts`, `core/auth/auth.store.ts`, `core/auth/auth.guard.ts`, `core/auth/role.guard.ts`, `core/auth/auth.interceptor.ts`, `core/ui/ui.store.ts`, `core/shell/shell.component.ts`, `core/shell/navi-header.component.ts`, `core/shell/navi-sidebar.component.ts`, `features/home/home.component.ts`, `features/auth/login/login.component.ts`, `features/auth/password-change/password-change.component.ts`, `features/auth/goodbye/goodbye.component.ts`, `shared/ui/confirmation-dialog.component.ts`, `shared/ui/layout.scss`

**Interfaces:**
- Produces: `AuthStore` (SignalStore) with state `{ user: AppUser | null, claims, roles: string[], loading: boolean, error: string | null }`, computed `isAuthenticated`, `hasRole`, and methods `login(email, password)`, `logout()`, `changePassword(old, new)`; `authGuard: CanActivateFn`; `roleGuard: CanActivateFn` reading `route.data['roles']`; `authInterceptor: HttpInterceptorFn` adding the ID token to calls to the functions URL; `UiStore` (sidebar open, busy, snack messages). Firebase providers connect to emulators when `environment.useEmulators` is true (Auth `9099`, Firestore `8080`, Storage `9199`, Functions `5001`).

- [ ] **Step 1: Write failing tests (Review Focus 4).** `roleGuard` allows `sales-user` on a route with `roles: ['sales-user','auditor']`, redirects a `sys-admin`-only user to `/home` (decision A4: allowed only if the role intersection is non-empty; a user without roles is denied; `/home` itself shows no placeholder text, decision D1), and redirects an unauthenticated user to the login route; `authInterceptor` adds `Authorization: Bearer <token>` for the functions URL only; `AuthStore.login` against the emulator with `sales@test.local` sets `roles` from the user profile.
- [ ] **Step 2:** Implement per the interfaces. Material theme, responsive shell (flex/grid CSS, no flex-layout library), German texts via `$localize` or a typed message map.
- [ ] **Step 3:** Playwright: log in as each test user and check the visible menu entries per role. Commit.

### Task 7: Admin: settings, countries, VAT

**Done 2026-11-15** (new repo, `apps/web/src/app/features/admin/`). Delivered: `AdminStore` (live `settings` collection, countries and VAT lists, every change writes the whole list back with the old messages `setting-update-success/fail`), `SettingsGateway` (the only Firestore access, faked in unit tests), pure rules in `admin.logic.ts`, `settingsResolver` (waits for the first answer, also on errors), settings page, country list and dialog, VAT list and dialog (Luxon date adapter, German date input), routes `/invoicing/settings[/countries|/vats]` under a new parent route `/invoicing` (signed-in users; each child has its roles, so an administrator without the sales role can open the settings), `routeResolves` for `/home` (forwards to a landing screen only once it resolves), number format and input patterns (`shared/format`, `shared/validators`), the full `INVOICING_MSGS` catalog. Tests: 204 unit tests, 24 Playwright tests (including the settings flows and the role checks) with the real security rules. Stories G01 and G02.

Implementation decisions (flagged for confirmation):
- The ISO code of a new country is required (at least 2 characters). The old form let an empty code through (`Anlegen` was enabled) and then saved a country without code.
- Deleting a country or a VAT entry still happens at once without confirmation (as before); DE cannot be deleted in the UI.
- New defaults and validity: a new tax code or period starts today (UTC start of day) until 31.12.9999 23:59:59.999 UTC, as before; dates typed in the picker are local midnight (as before with Moment).
- Number ranges are not loaded here (the plan mentioned them with the settings): the `NumberRangesStore` comes with Task 8, where it is first needed.
- Login now always goes to `/home`, which forwards to the landing screen of the role as soon as that screen exists.
- Bundle budget raised to 1.6 MB (warning) / 2.2 MB (error) because Material, Luxon and the domain package are in the initial bundle; revisit when the features are lazy.

**Stories:** `G01`, `G02`

**Files:** `features/admin/{settings,country-list,country-details-dialog,vat-list,vat-details-dialog}/*`, `features/admin/admin.store.ts`, `features/admin/admin.routes.ts`

**Interfaces:**
- Produces: `AdminStore` (SignalStore with `entities` for countries and VAT, `settings`, `load()`, `saveSettings(...)`, `saveCountry(...)`, `saveVat(...)`) with `withEntities`. Collections: `settings`, plus the countries/VAT structures found in Task 1 Step 2. The settings and number ranges load before other features need them (replaces the old `SettingsGuard`/`NumberRangesGuard`): expose `AdminStore.ready` signal, and a `settingsResolver: ResolveFn<void>`.

- [ ] **Steps:** tests (store loads and saves through the emulator; only `sys-admin` can open the routes), implement, Playwright flow (edit a VAT rate and see it persisted), commit.

### Task 8: Receivers

**Done 2026-11-15** (new repo). Delivered: `ReceiversStore` (live receivers of the own organization, summaries with counts, drafts for new/copy, create/save/remove with the old messages), pure rules in `receiver.logic.ts` (active, recent, open, last invoice, deletable, quick-invoice qualification), card list, form with the tabs Details, Kommunikation and the related contracts and invoices, details page, `receiverGuard`, `unsavedChangesGuard`, `/invoicing/receivers[/:id]`. Shared groundwork: `DocumentsGateway` and the store feature `withFirestoreCollection` (live collection, organization filter, mapping), `NumberRangesStore`, minimal `ContractsStore` (flat `startDate`/`endDate` mapped to the domain `term`) and `InvoicesStore`, `invoicingDataResolver`, contract and invoice tables, id avatar, `toDates`. Tests: 284 unit tests, 45 Playwright tests (receivers: list, create, edit, copy, delete, related lists, unsaved changes, auditor, direct visits). Stories C01-C06, H01, H02 (receivers), H05 (receivers). C07 (quick invoice) comes with Task 10, the Dokumente tab with Task 12.

Findings and implementation decisions (flagged for confirmation):
- **The old list offered "Löschen" for the wrong receivers** (those that have contracts or invoices; `ReceiverSummary.deletable` means "has documents"). The new card offers it only for a receiver without contracts and invoices.
- **The old copy overwrote the original:** the copy kept the number of the source and "Speichern" then updated that document. The copy now has no number and gets the next one from the range.
- **All business collections are filtered by the organization of the user** on the client (receivers, contracts, invoices, revenues), as the old effects did; contracts are stored with flat `startDate` and `endDate` and mapped to a `term` object.
- **Order and numbers:** the list is sorted by name (the old entity adapter sorted by name, not by number); "recent contracts" and "last invoice" compare numbers numerically (C6).
- **No snackbar after creating a receiver** (as before); after saving an existing receiver the list opens with "wurde geändert"; the new receiver replaces the form in the browser history, so "Zurück" returns to the list.
- **"Löschen" is not shown for a new, unsaved receiver** (the old form offered it and then failed).
- The plan's `query`/`orderBy` signals and filtered list were left out: the old app has no search or filter.
- **Guards run before resolvers in Angular:** a child guard that needs the data has to start the loading itself (`loadInvoicingData`).
- Domain: the `*Query` classes are exported now; `ContractQuery`, `ReceiverQuery`, `InvoiceQuery` were unused by the old app.

**Stories:** `C01`–`C07` (`C07` quick invoice completes with Task 10), `H01`, `H02`, `H03`

**Files:** `features/receivers/{receiver-list,receiver-card,receiver-details,receiver-form}/*`, `receivers.store.ts`, `receivers.routes.ts`, `unsaved-changes.guard.ts` (shared)

**Interfaces:**
- Produces: `ReceiversStore` with entity state, `selectedId` from the route, computed `filtered`/`sorted` lists driven by `query` and `orderBy` signals, methods `load()`, `create(draft)`, `save(receiver)`, `remove(id)` (only when `isDeletable`); `canDeactivate` function guard `unsavedChangesGuard: CanDeactivateFn<{ isDirty(): boolean }>`; `existsGuard` replaced by a `receiverResolver` that redirects on unknown ids.

- [ ] **Steps:** tests (list sorts and filters as in `05-ui-behavior.md`; the new-receiver form validates required fields and phone numbers; dirty form + navigation asks for confirmation, Review Focus 5; delete button disabled when not deletable; new receiver gets the next range number), implement, Playwright flow, commit.

### Task 9: Contracts

**Done 2026-11-15** (new repo, `apps/web/src/app/features/contracts/`). Delivered: `ContractsStore` extended (draft for new/copy, create/save/remove with flat `startDate`/`endDate` storage and the old messages), pure rules in `contract.logic.ts` (summaries sorted by issue date then number, invoices of a contract, changeable, selectable receivers, next item number, drafts, storage mapping), validators (`endDateValidator`, `minOneItemValidator`), card list, form with the tabs Details (partner, dates, payment terms, items) and Texte plus tabs for open and all invoices, details page, `contractGuard`, routes `/invoicing/contracts[/:id]`. Tests: 352 unit tests, 60 Playwright tests (contracts: list, create, validation, items, edit, read-only with invoices, copy, delete, unsaved changes, auditor, direct visits). Stories D01-D05 and H01/H05 for contracts. D06 (new invoice from a contract) comes with Task 10, the Dokumente tab with Task 12.

Findings and implementation decisions (flagged for confirmation):
- **Same two old bugs as for receivers:** the old list offered "Löschen" for contracts that HAVE invoices (`ContractSummary.changeable` means "has invoices"), and a copy kept the number of the source so that "Speichern" overwrote the original. Now "Löschen" is offered only for a contract without invoices, and a copy gets the next number.
- **A contract with invoices is shown read-only** (fields, item buttons, no "Speichern", no "Löschen"; "Neu" and "Kopieren" stay). The old form left the fields editable and only hid "Speichern".
- **"Löschen" is not shown for a new, unsaved contract** (the old form offered it).
- **The receiver of an existing contract stays selectable even when it became inactive** (the old list offered active receivers only, so the field went blank).
- A new contract starts with the payment terms "30 Tage: netto" (owner decision 2026-11-15; the old form had none and required them); the contract list no longer breaks when a receiver is missing (the domain factory threw for the whole list).
- The hidden `documentUrl` of the old form is kept with the contract; the date inputs are German (`1.7.2026`), the term is stored as whole days (start 00:00, end 23:59:59.999).

**Stories:** `D01`–`D06` (`D06` completes with Task 10)

Same structure as Task 8 with `features/contracts/*`, `ContractsStore`, items sub-form (`contract-items-form`, `contract-item-form`), link to receiver (`receiver-card`). Interfaces mirror Task 8, plus `ContractsStore.byReceiver(receiverId): Signal<Contract[]>`.

- [ ] **Steps:** tests (item totals, receiver link, delete rule, number range), implement, Playwright flow, commit.

### Task 10: Invoices

**Done 2026-11-15** (new repo, `apps/web/src/app/features/invoices/`). Delivered: `InvoicesStore` extended (draft for new/copy/quick, create with the next number of the range `invoices` or `credit-requests` by billing method, save, remove with the old question and messages, `createPdf` via `POST /invoicing/invoice-pdf/:id`), pure rules in `invoice.logic.ts` (list order, selectable contracts, quick-invoice qualification, drafts, VAT lookup `{country}_full`, dependent changes, number range), `InvoiceFormComponent` (tabs Details with header, contract, payment terms, items and totals, and Texte; totals only from the domain `Invoice`), `QuickInvoiceFormComponent`, card list, details page, `invoiceGuard` (`new`, `copy`, `quick`, number), routes `/invoicing/invoices[/:id]`, and the buttons "Neue Rechnung" in the receiver form (C07) and the contract form (D06) through `injectQuickInvoice()`. Tests: 428 unit tests, 81 Playwright tests (invoices: list, create with items and totals, credit note range, validation, status change, paid is read-only, copy, delete incl. rules refusal for a billed invoice, quick invoice from receiver and contract, unsaved changes, auditor, direct visits). Stories E01-E08, C07, D06, H01/H05 for invoices. Not covered here: "Senden" by email (deferred), the Dokumente tab (Task 12), the PDF in the browser tests (the Cloud Function is covered by the backend tests; the e2e emulators run without functions), the open-invoice list and revenues (Task 11).

Findings and implementation decisions (flagged for confirmation):
- **Dependent changes are applied in the form itself** instead of through the old diff of `InvoiceChangeActionFactory`: receiver chosen → VAT rate of its country at the issue date; contract chosen → header data from the contract (and, if the receiver changed, the VAT rate); contract item chosen → description, unit, price, discount flag; new item → contract item with the same number, else the next lower one. Same behavior, no `console.log` noise, nothing is stored before "Speichern".
- **Missing VAT rate or contract item:** the old code threw `vat_not_found` / `contract_item_not_found`, which had no message text. They now show `Für das Land des Rechnungsempfängers ist zum Rechnungsdatum kein Umsatzsteuersatz hinterlegt.` and `Zur neuen Position gibt es keine Vertragsposition.`; the rate or item stays as it was. A quick invoice without a VAT rate is not started.
- **Items carry the VAT rate of the invoice** when the form is saved (old: only the header changed, so the payment amount, which sums the item gross values, could differ after a rate change). Existing invoices of the sample data already have equal rates.
- **VAT 0 % is honored** (C2) in the form and in the totals.
- **Contracts to choose from:** all invoiceable contracts plus the own one; after the user picks a receiver only those of that receiver (old: the list was narrowed on a receiver change only).
- **"Löschen" in the list only for status "In Bearbeitung"** (as the old card), on the details page while not paid (as the old form); the rules allow deleting only status 0 (A2), so for a billed invoice the user gets "Die Rechnung … konnte nicht gelöscht werden." (tested).
- **A contract without items cannot be invoiced quickly** (the domain call would throw); "Neue Rechnung" is not offered for it.
- "PDF erzeugen" only for status "In Bearbeitung" and billing method "Rechnung", as before; the credit note title is "Gutschriftsanforderung".
- **Test note:** the e2e tests of invoices use the sample receiver 1014 and contract 4134 (running until 31.12.2026, invoiceable until 15.01.2027) and create no receivers or contracts, because the other specs count them in parallel. After 15.01.2027 the sample data needs new dates (see Task 15).

**Stories:** `E01`–`E10`, `C07`, `D06`

**Files:** `features/invoices/{invoice-list,open-invoice-list,invoice-card,invoice-details,invoice-form,invoice-items-form,invoice-item-form,quick-invoice-form,texts-form}/*`, `invoices.store.ts`, `invoices.routes.ts`, `features/documents/*` (see Task 12)

**Interfaces:**
- Produces: `InvoicesStore` with entities, `byStatus` computed, methods `create`, `createFromContract(contractId)`, `save`, `remove` (only status `0`), `book(id)`/status changes as defined in `01-features.md`, `createPdf(id): Promise<void>` calling `POST /invoice-pdf/:id`. Sending by email is deferred. Totals come from the domain package only, never recomputed in components.

- [ ] **Steps:** tests (item add/remove updates totals and VAT with German formatting; status transitions allowed per spec; delete disabled unless status `0`; quick invoice from a contract prefilled; PDF button creates a document link visible in the list), implement, Playwright flow (create invoice → PDF → appears under documents), commit.

### Task 11: Overview and revenues (confirmations dropped, decision D1)

**Done 2026-11-15** (new repo, `apps/web/src/app/features/overview/`). Delivered: `RevenuesStore` (live `revenues` of the own organization, read only; the document `{year}_{organization}` is numbered by its year; `perYear` = current and two previous years via the domain `Revenue.calculateTotalRevenuesPerYear`), pure rules in `overview.logic.ts` (open invoices with receiver name, due date ascending; revenues of three years; German month abbreviations), `OpenInvoiceListComponent` ("Offene Rechnungen": Nr., Datum, Kunde, Leistungszeitraum, Nettobetrag, Zahlungsbetrag, Fällig am; past due marked), `RevenueListComponent` ("Umsätze": twelve months and the year sum), `OverviewComponent`, `revenuesResolver`, route `/invoicing` (sales users and auditors). Tests: 436 unit tests, 87 Playwright tests (overview: open list against the data, order, link to an invoice, three revenue rows compared with the stored documents, auditor, reload, anonymous). Stories B01, B02, H05 (overview).

Findings and implementation decisions (flagged for confirmation):
- **The landing page after the login is now the overview** for sales users and auditors (as in the old app); `/home` stays the blank target for users without such a role (D1). Two earlier e2e tests expected `/home` and were adapted.
- **The open-invoice list is derived from the live invoices** (as the old app did), not from the `open-invoices` collection that the batch job writes; a missing receiver gives an empty name instead of breaking the list.
- The revenue list shows whole euros (`1.0-0`) as before; the old component mutated its input when adding the year sum, the new one does not.
- The revenues are loaded only for the overview route (not part of `loadInvoicingData`), the open list needs only receivers and invoices.

**Stories:** `B01`, `B02`, `H05` (the confirmations placeholder is dropped, decision D1)

**Files:** `features/overview/*`, `features/revenues/revenue-list/*`, `revenues.store.ts` (no `confirmations` feature and no `/invoicing/confirmations` route)

**Interfaces:**
- Produces: `RevenuesStore` (reads `revenues` and `open-invoices`, read-only for `sales-user` and `auditor`), overview tiles as `computed` values.

- [ ] **Steps:** tests with the seeded data (expected sums per year), implement, Playwright, commit.

### Task 12: Documents and storage

**Done 2026-11-15** (new repo, `apps/web/src/app/features/documents/`, `core/storage/`). Delivered: `StorageGateway` (upload with custom metadata, download URL, delete; faked in unit tests), `DocumentLinksStore` (live `document-links`, `forOwner(owner)`, `upload`, `download`, `remove`, `setType`, `setAttachToEmail` with the old messages), `DocumentLinkListComponent` (tab "Dokumente": select, "Hochladen", "Herunterladen", "Löschen", type select, e-mail checkbox), `DocumentUploadDialogComponent` (file, name, type, "E-Mail Anhang?"), the tab "Dokumente" in the receiver, contract and invoice forms (existing objects only), `DocumentsGateway.add` (generated ids). Tests: 450 unit tests, 94 Playwright tests (documents: upload with file and metadata checked in the Storage emulator, listing as "Sonstiges", download, type and e-mail change, delete of file and link, auditor reads and downloads under the real rules, tab on receivers and contracts, no tab for a new object). Stories F01-F03, H05 (documents).

Findings and implementation decisions (flagged for confirmation):
- **Link first, then file:** upload creates the link document, then the file (the Storage trigger then completes the link from the file metadata, as before). The old code did both at once, so the trigger could run before the link existed; a failed upload now removes the link again.
- **Delete removes the file, then the link** (the old code sent both deletes independently); a file that is already gone does not keep the link, other errors keep both and are reported.
- **Messages name the file** (`Die Datei {Name} wurde …`) for upload, download and delete (the old download message showed the storage path).
- Download opens the file in a new window as before (the browser downloads files of most content types, so the window stays empty).
- **A change of type or e-mail flag is saved in Firestore only** (as before); the Storage metadata keeps the values of the upload. The e-mail sending that reads the links is deferred.
- **All document links are loaded live and filtered by owner in the browser** (the old list queried per owner); the collection has no organization field. Numbers are unique across organizations, but the rules let any signed-in reader see all links (unchanged).
- The Cloud Function trigger is not part of the browser tests (no functions emulator there); the sample invoice 5231 already has two documents of its own, the tests look only at their own file.

**Stories:** `F01`, `F02`, `F03`

**Files:** `features/documents/{document-link-list,document-upload,document-preview}/*`, `documents.store.ts`, `core/storage/storage.service.ts`

**Interfaces:**
- Produces: `DocumentsStore.forOwner(owner: string): Signal<DocumentLink[]>`, methods `upload(owner, file)` (to `docs/...`, with `owner` metadata), `download(link)`, `remove(link)`.

- [ ] **Steps:** tests (upload creates a link through the Storage trigger on the emulator; remove deletes file and link; only `sales-user` sees the list), implement, Playwright, commit.

### Task 13: User management

**Done 2026-11-15** (new repo, `apps/web/src/app/features/users/`). Delivered: `UsersStore` (live `user-profiles`, create and set password through the Cloud Function `/users/new` and `/users/{uid}`, profile save and lock through Firestore, image upload and delete in Storage), `passwordValidator` (and a state matcher that shows the mismatch at the confirmation field), user list (`/auth/users`, administrators only), user dialog (new, edit, my profile), password dialog (own: with old password; other user: set), image upload dialog, `UserDialogs` service, the header entry "Meine Daten", `AuthStore.reloadProfile()`, `StorageGateway.listPaths`. Tests: 484 unit tests, 106 Playwright tests (users: list, access, create incl. password mismatch and function failure, edit, lock, set password, own password against the Auth emulator, image upload and delete against the Storage emulator, my profile). Stories A03-A08, H05 (users).

Findings and implementation decisions (flagged for confirmation):
- **E2E without the functions emulator:** the calls to `/users/...` are answered inside the browser tests and checked for what the application sends; creating a user, setting a password, the claims after a role change and the thumbnails are covered by the backend tests (Task 5). Role changes are saved to the profile and the existing trigger updates Auth and the claims, as before.
- **Roles are a multi-select** (`sys-admin`, `sales-user`, `auditor`) instead of the old comma separated text field (as in the UI spec); at least one is required.
- **Edit saves to Firestore** (as before), so the message is the old `Die Benutzerdaten zu {E-Mail} wurden geändert.` (the user story names `user-update-success`).
- **The lock button in the list works** (it only logged "to be implemented" before): it flips `isLocked` in the profile, the trigger disables or enables the Auth user. No confirmation question.
- **Profile image delete removes all image files of the user** (original and thumbnails) and clears `imageUrl`; the old code deleted only the 32 pixel thumbnail and left the rest. The upload messages `image-upload-success/-fail` and `image-delete-success/-fail` are new (the old app had no texts: "Unbekannte Nachricht").
- **A non-administrator cannot upload an own profile image:** the Storage rules (frozen) allow `images/users/{uid}/...` for administrators only, so the button of "Meine Daten" works only for them, as in the old app.
- **Own password** goes through Firebase Auth (sign in again with the old password, then set the new one), another user's password through the function; a failure keeps the dialog open (the old dialog closed anyway).
- The old dialog showed the user id ("Benutzerkennung") for every task but my profile; now only for editing. A blank profile picture is an icon instead of two image files.
- The sample users `admin@`, `sales@`, `auditor@test.local` are not changed by the tests; temporary profiles and an Auth user are created and removed.

**Stories:** `A03`, `A04`, `A05`, `A06`, `A07`, `A08`

**Files:** `features/users/{user-list,user-details-dialog}/*`, `users.store.ts`, `users.routes.ts`, validators (`password.validator.ts`)

**Interfaces:**
- Produces: `UsersStore` (list, create via `POST /new`, update via `POST /:id`, roles edit), `passwordValidator: ValidatorFn` with the same rules as the old validator (take them from `ai/spec/05-ui-behavior.md`).

- [ ] **Steps:** tests (password rules; only `sys-admin` can create a user; claims update after role change, checked through the emulator), implement, Playwright, commit.

### Task 14: Batch jobs

**Done 2026-11-15** (new repo, `tools/batches/`). Delivered: CLI with `commander` (`reporting-refresh [--test [flag]]`, `list-users`, `export [-o <dir>]`), run with `npm run batch -- <command>`; `lib/firebase.ts` (emulator hosts or `GOOGLE_APPLICATION_CREDENTIALS`, otherwise a clear error; no key in the repo), pure functions `buildRevenues`, `buildOpenInvoices`, `toInvoice` (timestamps to dates), `refreshReporting`, `listUsers`, `exportCollections`. Tests: 12 unit tests and 9 emulator tests (`npm run test:batches`, also in CI): revenues of this year rebuilt from the invoices (month split at day 15/16, sums per receiver, paid invoices count), the year before stays untouched, open invoices replaced with receiver names, test mode writes nothing, 620 open invoices (chunked batches), repeatable, users sorted with status, export of all six collections, the CLI itself (test mode, refusal without credentials). Stories J01, J02, J03, I03.

Findings and implementation decisions (flagged for confirmation):
- **Story J01 contradicts the old code and the task text:** the story says "years up to the year before last stay unchanged", the code (`revenuePeriod.year > currentYear - 1`) and this task rebuild **only the current year** and lock the year before. Implemented as the code and the task text.
- **`--test` really writes nothing** (old defect B2: the flag was read but never checked); `--test`, `--test true` and `-t` are test mode, `--test false` is not. The result of a test run is printed.
- **Export is fixed (old: options broken, `forEach(async)` without waiting, output path hard-coded):** every collection is written and awaited into `-o <dir>` (default `./exports`, git-ignored; the files hold real data and must stay outside of the repository when used against production). Documents are exported as stored (timestamps as `_seconds/_nanoseconds`, as before).
- **Old limits removed:** one write batch for all open invoices (failed above 500 documents) is now chunked by 400; `list-users` prints all pages (old: first 100) with e-mail, name, status (`aktiv`/`gesperrt`) and uid; a receiver that no longer exists gives an empty name instead of aborting the run.
- **Credentials:** the old programs required `credentials.json` / `credentials-prod.json` two folders above the repository; now only `GOOGLE_APPLICATION_CREDENTIALS` or the emulators. The jobs still never ask which project they run against: check the environment before running them against production (Task 16).
- Documents for `open-invoices` and `revenues` keep the old fields (`organization`, `status`, receiver name, amounts, due date; `{year}_{organization}`).

**Stories:** `J01`, `J02`, `J03`, `I03`

**Files:** `tools/batches/src/{reporting-refresh,users-list,export}.ts`, `tools/batches/src/lib/*`

**Interfaces:**
- Produces: CLI commands `reporting-refresh [--test true]`, `list-users`, `export`, using `commander` current, with the Admin SDK and a service-account path from an environment variable (`GOOGLE_APPLICATION_CREDENTIALS`) or the emulator host (`FIRESTORE_EMULATOR_HOST`). No key file inside the repo.

- [ ] **Step 1: Write the failing test (Review Focus 3).** On the seeded emulator: running `reporting-refresh` rebuilds `revenues` and `open-invoices` so that they equal the sums of the seeded invoices; the prior year (`today.getFullYear() - 1`) stays locked and untouched; with `--test true` nothing is written.
- [ ] **Step 2:** Implement, run the tests, commit.

## Phase 4: Parity and cutover

### Task 15: Parity verification

**Done 2026-11-15** (new repo: `docs/parity-checklist.md`, `apps/web/e2e/parity/*.spec.ts`, `scripts/__tests__/parity-checklist.test.ts`). Delivered: the checklist with all 53 stories and the rows of the feature inventory (status `done` or `changed-by-decision`, no `missing`; a test checks completeness and that the named test files exist); parity tests against the values of the OLD domain package for all 123 invoices (list cards, open invoices, form totals of every fifth invoice) and the stored revenues; axe accessibility checks (WCAG 2.1 A/AA) of the main screens and keyboard tests. 485 unit tests, 115 Playwright tests.

Findings (flagged for confirmation):
- **A real difference found and fixed:** the invoice form recalculated with the header VAT rate on every item. Seven invoices of 2020 have 16 % in the header and 19 % on the items; the old package uses the item rate, so the form showed a different payment amount and a save would have changed the items. An item now keeps its own rate; a new item takes the rate of the invoice. **The Task 10 decision "items carry the VAT of the invoice" is withdrawn.**
- **Visual changes for accessibility:** the active navigation entry is bold and underlined instead of amber, the orange and grey id badges are darker, item fields have accessible names.
- **Not done:** the old application was not run side by side in the browser (comparison on data level with the golden values instead); no pixel comparison of PDFs (text content is tested); **Lighthouse was not run** (the session's sandbox allows no local web server for it): run it against staging in Task 16. The old app's two defects in story J01 ("years up to the year before last") stay as decided in Task 14.
- Test data: the parity tests use the sample data as it is; invoices created by other specs in parallel are tolerated.

**Files:** `docs/parity-checklist.md`, `apps/web/e2e/parity/*.spec.ts`

- [ ] **Step 1:** Turn every row of `01-features.md` and every story in `ai/user-stories/` (53 stories) into a checklist row with status (`done`, `changed-by-decision`, `missing`) and the test that covers it. No `missing` rows allowed at the end.
- [ ] **Step 2:** Run the old app and the new app against the **same staging copy** and compare, for the same inputs: list contents and order, invoice totals, generated PDFs (text content), number ranges after create/delete, revenue sums. Record differences; each is either fixed or entered into `ai/spec/07-open-points.md` as an intended change. Differences from the "Owner decisions on found defects" table (A1, A4, A5, C1, C2, C6, D1) are expected and excluded.
- [ ] **Step 3:** Performance and accessibility pass: Lighthouse on the production build, keyboard navigation on forms, Material contrast checks.
- [ ] **Step 4:** Commit.

### Task 16: Staging release and cutover plan

**Files:** `docs/cutover.md`, `.github/workflows/deploy.yml`

- [ ] **Step 1:** Deploy rules, functions and hosting to the staging project only. Run the full e2e suite against staging with the test users.
- [ ] **Step 2:** Write `docs/cutover.md`: freeze window, Firestore and Storage backup of `invoi-p` before the switch, deploy order (rules → functions → hosting), smoke checklist, rollback (`firebase hosting:rollback`, redeploy previous functions from the old repo tag).
- [ ] **Step 3:** **Owner sign-off required before anything touches `invoi-p`.** After sign-off, execute the cutover document.
- [ ] **Step 4:** Update `README.md` and tag `v1.0.0`.

---

## Order

Task 1 and Task 2 can run in parallel (Task 1 Step 2 wants the sample data from Task 2 Step 3). Then Task 3 → 4 → 5 (backend), and Task 6 (core) in parallel with Task 5 once Task 3 is done. Tasks 7–13 follow Task 6; Task 10 needs Task 5 Steps 6–7 and Tasks 8–9; Task 14 needs Task 5. Tasks 15–16 last.

## Risks

| Risk | Mitigation |
|---|---|
| Hidden behavior in the old code and in `jovisco-domain` that nobody remembers | Task 1 specs; characterization tests built from real (anonymized) documents and from running the old code; Task 15 side-by-side comparison |
| Real customer data in repo or logs | Anonymization script with a denylist test; raw exports stay outside the repos; commit only after the check |
| `@angular/fire` lagging behind the newest Angular | Check peer range in Task 3; fall back to the Firebase SDK behind thin `inject()` wrappers |
| Emulator differences from production (Storage triggers, Auth claims propagation, indexes) | Run the integration suite on the staging copy as well (Task 16); copy `firestore.indexes.json` from `invoi-p` (`firebase firestore:indexes`) in Task 2 |
| Schema drift between old and new app during the rebuild | Schema frozen by Global Constraints; any change goes through `ai/spec/07-open-points.md` |
| Email sending deferred | Old behavior documented in the spec; add later behind a `MailSender` interface |

## Self-Review Notes

- Coverage of the request: reverse engineering (Task 1, 15), latest Angular signal-based (Tasks 3, 6–13, Global Constraints), copy of `invoi-p` (Task 2), local data store for development and tests (Task 2, emulators + seeds, used by every test task).
- Information still needed from the owner is listed under "Open Questions".

## Open Questions

Answered by the owner: Firebase export access and staging project (yes), `jovisco-domain` source available (yes), email (skipped), repo URL (`jovisco-invoicing-ai`), changes wanted (none).

`jovisco-domain` source: https://github.com/joheiss/jovisco-domain (public; clone it into its own empty folder outside both repos for Task 1 Step 6). Nothing else is needed to start Task 1.

Still open: staging project details (project ID, logins, export bucket) and the go-ahead for Task 2 (owner: wait for now). Decided: claim `isAuditor` for Storage `docs/**` read (A1).
