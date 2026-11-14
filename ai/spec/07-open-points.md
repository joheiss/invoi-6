# 07 Open Points

Findings from reading the old code. The owner said no behavior changes are wanted, so by default the rebuild **reproduces current behavior**; items marked **DECIDE** need an owner decision before the related task starts. Items marked **VERIFY** need real data (Task 2) before anyone can say what the old system actually does.

## Owner decisions (2026-11-14)

| Item | Decision |
|---|---|
| A1 | **fix:** `auditor` is read-only. Firestore rules allow `auditor` to read the same collections as `sales-user` (no writes). Follow-up needed: Storage `docs/**` read for auditors requires a claim (new custom claim `isAuditor`, set from role `auditor`); **confirmed by the owner 2026-11-14.** |
| A4 | **fix:** the route authorization guard uses `intersection(...).length > 0`. |
| A5 | **fix:** user-management endpoints require the `isAdmin` claim (a user's own password change keeps working through the client SDK). |
| C1 | **fix:** `getNextItemId` returns the smallest unused positive id. |
| C2 | **fix:** a VAT percentage of 0 is honored (no fallback to 19 when the value is 0; fallback to 19 only when undefined). |
| C6 | **fix:** ids are compared numerically. |
| D1 | **drop** the placeholder screens `/home` content and `/invoicing/confirmations`: `/home` stays as a route target (redirect) but shows no "works!" text, and `/invoicing/confirmations` is removed. |
| All other DECIDE items | `keep` (current behavior) unless changed later. |

These fixes are intended differences from the old app and are excluded from the parity comparison in Task 15.

Legend for the default: `keep` = reproduce as is (with a characterization test), `fix` = proposed correction (needs your OK).

## Findings from real data (2026-11-14, staging copy of `invoi-p`)

Counts: 3 user-profiles, 2 settings (`countries`, `vat`), 4 number-ranges, 12 revenues, 4 open-invoices, 6 receivers, 36 contracts, 123 invoices (121 paid, 2 created; 80 invoice, 43 credit note; 1 organization `GHQ`; max 3 items), 229 document-links. Dates are Firestore Timestamps. Counts and Storage (234 files) match `invoi-p`.

| # | Finding |
|---|---|
| R1 (B1 verified) | **Revenue reporting through triggers did fail in production:** `revenues/NaN_GHQ` exists (month `NaN`, 3 receiver entries). This confirms the Timestamp/luxon issue. Further small drifts between stored revenues and sums recomputed from invoices: 2022 (receiver 1010: 100 in month 7 instead of month 8), 2023 (19360 booked on receiver 1010 instead of 1007), 2024 (2 cells), 2025 (1 cell 12880 vs 12280). 2016 and 2017 revenue docs predate the stored invoices (earliest invoice 2017-12-31), so they cannot be recomputed. |
| R2 (D7 verified) | Settings document ids are `countries` and `vat`. VAT tax codes in use: `DE_full` (16 %, 19 %), `DE_reduced` (5 %, 7 %), `DE_none` (0 %). Countries: `DE` only, names `de` and `en`. |
| R3 | No invoice has VAT 0 % today, but a `DE_none` (0 %) tax code exists, which makes decision C2 (honor 0 %) relevant. |
| R4 | `document-links.path` begins with a slash in 175 of 229 links (`/docs/...`), the others have no slash (`docs/invoices/...`). The rebuild must accept both forms when reading and write `docs/...` without a slash. 3 links lack the field `id`. |
| R5 | Some contracts carry junk fields: a map `texts` and the literal dotted keys `texts.internalText` and `texts.invoiceText` (written by an update with dotted paths). The anonymizer keeps them; the rebuild ignores them. |
| R6 | Some receivers have no `isDeletable` field (2 of 6). The rules and the UI must treat a missing value like the old code does (see 03). |
| R7 | The 5 open-invoice documents (4 stored) show `paymentAmount` as integer or double; amounts are mixed integer/double throughout (use number, not integer, types). |
| R8 | Number ranges: `receivers` 1000–1999 (last 1014), `contracts` 4000–4999 (last 4134), `invoices` 5000–5999 (last 5231), `credit-requests` 6000–6999 (last 6058). |
| R9 | Production profiles: 1 administrator with roles `sys-admin` + `sales-user` (claims `isAdmin` and `isSales`) and **2 users with the role `auditor` only**. Under the deployed rules these auditors can read nothing (A1); the rebuild fixes this (read-only access, claim `isAuditor`). The test administrator has both roles like the real one, because the rules need `sales-user` to read settings. |

## A. Security and authorization

| # | Finding | Default | Needed |
|---|---|---|---|
| A1 | The `auditor` role is allowed on `/invoicing` routes and in the sidebar, but Firestore rules require `sales-user` for every read, and `auditor` gets no Storage claim. An auditor sees nothing or errors. | keep | **DECIDE:** is `auditor` meant to be read-only? If yes, the rules need `auditor` on reads (propose `fix`). |
| A2 | UI "deletable" for invoices = status is not paid; the rule allows delete only for `status == 0`. A billed invoice shows a Delete button that the server then rejects. | keep | **DECIDE** (propose `fix`: align the UI to the rule). |
| A3 | Storage rule for `images/users/{uid}` matches only an object named exactly `{uid}`, so the owner cannot upload their own profile image from `images/users/{uid}/...`; only admins can. | keep | **VERIFY** how the app uploads user images (path and who does it). |
| A3b | **Verified in real data (2026-11-14):** Storage contains `docs/undefined/1014/...` next to `docs/receivers/1014/...`: an upload once wrote the object type `undefined` into the path. | the rebuild always writes `docs/{objectType}/{id}/...`; keep the sample as a test case for the anonymizer | none |
| A4 | `AuthorizationGuard` computes `intersection(...).length >= 0`, which is always true. Route-level role checks do nothing. | keep, characterize | **DECIDE** (propose `fix`: use `> 0`; note that this will also lock auditors out of everything, see A1). |
| A5 | `POST /users/new` and `POST /users/:id` accept any signed-in user. Any signed-in user can create users or reset any user's password. | keep | **DECIDE** (strongly propose `fix`: require `isAdmin` claim; password change for oneself must stay possible via the client SDK). |
| A6 | Firestore rules read roles from the profile document (one extra read per request) while Storage rules use custom claims. A role change takes effect at once in Firestore and only after the next ID token refresh in Storage. | keep | none |
| A7 | `isDeletable` is a client-written field; the rules trust it. | keep | none |
| A8 | `validateFirebaseIdToken` also accepts a `__session` cookie but no cookie parser is installed, so `req.cookies` is undefined (header-only in practice). | keep | none |

## B. Backend behavior

| # | Finding | Default | Needed |
|---|---|---|---|
| B1 | **Fixed in the rebuild (implementation decision, 2026-11-14, owner to confirm):** Timestamps are converted to Dates; see R1. Original finding: triggers pass raw Firestore data to `InvoiceFactory.fromData`. `issuedAt` is a `Timestamp`, not a `Date`; luxon 1.x returns an invalid DateTime for non-Dates, so `revenuePeriod` may be NaN, and `isInvoiceUpdateRelevantForRevenue` compares `issuedAt` by reference (`!==`). Whether revenue reporting actually works in production through triggers is unknown; the batch job has the same pattern. | keep (characterize what really happens) | **VERIFY** on the staging copy: update an invoice and inspect `revenues`. Then **DECIDE**: correct behavior = convert Timestamps to Dates and compare by value. |
| B2 | `reporting-refresh -t true` does not stop writes (`testMode` never checked); `export` reads undefined options and does not await its writes. | keep for `reporting-refresh` semantics, `fix` test flag and export | **DECIDE** (propose `fix`). |
| B3 | `onCreate*` sets `lastUsedId = id` unconditionally; `onDelete*` resets only if the deleted id equals `lastUsedId`. Creating a lower id lowers the counter. | keep | none |
| B4 | Revenue updates are read-modify-write without transactions; concurrent invoice updates can lose changes. | keep, note | **DECIDE** (propose `fix` with a Firestore transaction; behavior for single updates unchanged). |
| B5 | PDF endpoint adds a new `document-links` doc on every call; the finalize trigger never creates links. Repeated PDF creation leaves duplicate links. | keep | **DECIDE** (propose `fix`: upsert by `path`). |
| B6 | Email sending: deferred per owner decision. Behavior documented in 04 (to, cc, from, template id, attachments, status → billed). The `functions.config()` API is removed in current Firebase; a later implementation needs `defineSecret`. | deferred | none now |
| B7 | `handleReceiverCreation` and others do not catch errors, while the contract/invoice handlers catch and only log. | keep | none |
| B8 | User thumbnail generation is fire-and-forget (`sharp.toFile` callbacks not awaited); errors are swallowed. | keep behavior, make awaited | low risk |
| B9 | `projectId.appspot.com` is hard-coded for the thumbnail URL; new Firebase projects use a different default bucket name (`*.firebasestorage.app`). | `fix` (read the bucket from config) | none |
| B10 | The two exports `invoicing` and `users` are the same Express app; the URL prefix decides nothing server-side. | keep both exports | none |

## C. Domain quirks

| # | Finding | Default | Needed |
|---|---|---|---|
| C1 | `getNextItemId` misbehaves for unsorted or non-contiguous ids and uses string sort (see 06). | keep, characterize | **DECIDE** (propose `fix`: smallest unused positive id). |
| C2 | VAT percentage 0 is turned into 19 (`header.vatPercentage || 19`). | keep | **DECIDE** (propose `fix` for 0%, e.g. reverse-charge invoices). |
| C3 | `Vat.findVatPercentage` throws on a missing tax period; the UI maps it to `vat_not_found`. | keep | none |
| C4 | `InvoiceFactory.fromContract` throws on a contract without items. | keep | none |
| C5 | `ReceiverSummary.deletable` / `ContractSummary.changeable` have inverted names (see 02). | rename, keep logic | none |
| C6 | Ids are numeric strings compared lexicographically (`invoiceId > lastInvoiceId`). Works only while all ids have the same length (a switch from 9999 to 10000 breaks "last"). | keep | **DECIDE** (propose `fix`: compare numerically). |
| C7 | The PDF always prints "Seite 1/1" and positions rows by `ceil(len/40)*15`; long invoices overflow the page. | keep | **VERIFY** the longest real invoice. |
| C8 | `revenuePeriod` assigns invoices dated up to the 15th to the previous month. | keep | none |

## D. UI and data

| # | Finding | Default | Needed |
|---|---|---|---|
| D1 | `/invoicing/confirmations` and `/home` are placeholders ("works!"). | keep placeholders | **DECIDE:** drop them or keep? |
| D2 | Payment methods 2-4 (CreditCard, Check, Cash) exist but the forms offer only transfer and direct debit. | keep | none |
| D3 | `Invoice` form field `paymentTerm` (without s) in `listenToChanges` does not match the control `paymentTerms`, so payment-terms edits are applied only on save, not live. | keep | low impact |
| D4 | `ngOnDestroy` calls `unsubscribe` without parentheses, so the debounce subscriptions are never cleaned up. | do not carry over | none |
| D5 | The unsaved-changes guard reads `component.formComponent.form.dirty`; dialogs elsewhere have their own behavior. | keep | none |
| D6 | Languages: UI texts are German only; `i18n` attributes exist but there is a single locale (`de-DE`). Country names are multilingual data. | keep German only | none |
| D7 | Exact settings document ids (countries, VAT) and tax code naming (`{country}_full`, others?) | n/a | **VERIFY** in Task 2 data. |
| D8 | Dates are stored as Firestore Timestamps and edited in local time; end-of-day times use local time (`endOf('day')`). Seeds and tests must pin a timezone (`Europe/Berlin`). | keep | none |

## E. Environment and process

| # | Finding | Default | Needed |
|---|---|---|---|
| E1 | `web/src/environments/*` was deleted from git (secrets commits); the shape of `environment` is inferred from usage: `cloudFunctionsURL` and the Firebase web config. | n/a | **VERIFY:** the exact `environment` keys. |
| E2 | `firebase-old.json`, `web/coverage/`, `web/dist/`, `.firebase/` caches are committed in the old repo. Not relevant for the rebuild. | ignore | none |
| E3 | `batches/` and `functions/` expect `credentials.json` files (not in repo). | rebuild uses ADC or emulator | none |

## Decisions needed before Task 3

If the owner answers nothing, every `DECIDE` item takes its default (`keep`). The following ones are worth answering early because they change what is built:
A1 (auditor access), A4/A5 (authorization), B1 (revenue reporting through triggers), C1/C2/C6 (domain fixes), D1 (placeholder screens).
