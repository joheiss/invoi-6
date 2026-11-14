# 04 Backend Behavior (Cloud Functions, shared, batches)

Source: `functions/src/*.ts`, `functions/src/printforms/*`, `shared/src/functions/*`, `batches/src/*`. Runtime Node 18, `firebase-functions` v1 API, `firebase-admin` 12, TypeScript 5.4. Timezone and locale: `de-DE`, `Europe/Berlin`.

## HTTP API (`invoicing` and `users` are the same Express app exported twice)

Base URL (client): `environment.cloudFunctionsURL` + `/invoicing/...` or `/users/...`. All routes use `cors({origin: true})` and `validateFirebaseIdToken` (see 03). Routes are registered once on the shared app, so both exports answer all four routes.

| Route | Handler | Input | Behavior | Response |
|---|---|---|---|---|
| `POST /new` (called as `/users/new`) | `handleUserCreation` | body `{ user: UserData, password }` | `buildUserRequest` → `auth.createUser`; then `user-profiles/{uid}.set(payload.user minus uid)` | 200 with `req.body.user`; 500 with the error |
| `POST /:id` (`/users/{uid}`) | `handleUserUpdate` | body `{ user?, uid?, password? }` | `uid = payload.user?.uid ?? payload.uid`; `auth.updateUser(uid, updates)`; if `payload.user`: `user-profiles/{uid}.set(user minus uid)` (**full replace**); password-only requests (`{uid, password}`) skip the profile write | 200 with `req.body.user` (undefined for password-only); 500 |
| `POST /invoice-pdf/:id` | `handleInvoicePdfCreation` | path id | read `invoices/{id}` (issuedAt → Date), read `receivers/{receiverId}`, map to form data, print PDF with PDFKit, save to `/tmp/R{id}.pdf`, upload to `docs/invoices/{id}/R{id}.pdf` with metadata `{owner: 'invoices/{id}', type: 0, attachToEmail: true}`, and create a `document-links` doc `{name: 'R{id}.pdf', path, type: 0, attachToEmail: true, owner: 'invoices/{id}'}` | 200 with the invoice data; 500 |
| `POST /invoice-email/:id` | `handleInvoiceEmailSending` | path id | **Deferred in the rebuild.** Old behavior: SendGrid key from `functions.config().sendgrid.key`; to = receiver email, cc `accounting@jovisco.de`, from `contact@jovisco.de`, subject `Rechnung {id}`, template `fef476e5-cd98-442d-ad05-451a3832886a`, substitution `{{id}}`; attachments = all `document-links` of the invoice with `attachToEmail`, downloaded and base64 encoded; afterwards `invoices/{id}.update({status: 1 (billed)})` | 200 with the update result; 500 |

`buildUserRequest`: sets `email`, `displayName` when present; `disabled = !!isLocked`; `phoneNumber` only when non-empty; `photoURL` only when non-empty; `password` from `payload.password`.

Quirks worth knowing:
- The PDF is created again each call; `bucket.upload` overwrites the file; a **new `document-links` doc is added every time** (duplicates), unless the Storage trigger `onFinalizedDocument` deduplicates via `updateDocumentLink` (it only updates existing links by path, it never creates).
- Errors are rethrown as `new Error(err)` and returned as `res.status(500).json(err)` (an `Error` serializes to `{}`).

## Firestore triggers (`functions.firestore.document(...)`)

| Export | Trigger | Behavior |
|---|---|---|
| `onCreateReceiver` | `receivers/{id}` create | `number-ranges/receivers.update({lastUsedId: id})` (unconditional) |
| `onDeleteReceiver` | delete | `resetNumberRange('receivers')`; delete all `document-links` with `owner == '{objectType}/{id}'` |
| `onCreateContract` | `contracts/{id}` create | `number-ranges/contracts.update({lastUsedId: id})` |
| `onDeleteContract` | delete | `resetNumberRange('contracts')`; delete document links (errors logged, not thrown) |
| `onCreateInvoice` | `invoices/{id}` create | range = `credit-requests` if `billingMethod === 1` else `invoices`; `lastUsedId = id`; then `updateRevenueReporting(new, null)` |
| `onDeleteInvoice` | delete | `resetNumberRange(range)`; delete document links; `updateRevenueReporting(null, old)` |
| `onUpdateInvoice` | update | if `isInvoiceUpdateRelevantForRevenue(new, old)` then `updateRevenueReporting(new, old)` |
| `onCreateUserProfile` | `user-profiles/{id}` create | `updateAuth(uid, profile)` |
| `onUpdateUserProfile` | update | `updateAuth(uid, profile)` |
| `onDeleteUserProfile` | delete | `setCustomUserClaims(uid, {isAdmin: false, isSales: false})` |
| `onDeleteDocumentLink` | `document-links/{id}` delete | delete the Storage file at `path` |

**`resetNumberRange(rangeId)`**: reads the range; **only if `lastUsedId === deleted id`** sets `lastUsedId = String(+id - 1)`; otherwise nothing. Deleting an older document never changes the counter.

**`updateAuth(uid, profile)`**: `auth.updateUser(uid, {displayName, disabled: isLocked, phoneNumber, photoURL: imageUrl-or-null})`; then claims `{isAdmin: roles contains 'sys-admin', isSales: roles contains 'sales-user'}`. **Claims are not touched for `auditor`.**

**`isInvoiceUpdateRelevantForRevenue(new, old)`**: false if deep-equal; true if either is missing; otherwise true if `status`, `issuedAt` (compared with `!==`), `receiverId` or `discountedNetValue` differ. (**`issuedAt` objects are compared by reference; if they are Timestamps or Dates this is true whenever both exist,** so effectively any changed invoice is "relevant" unless some other branch applies. Characterize with real data, see 07, B1.)

**`updateRevenueReporting(newData, oldData)`**:
1. Compute for the new invoice: `{year, month}` from `revenuePeriod` (as strings), `receiverId`, `organization`, `revenue = netValue`; same for the old one.
2. New side: doc id `{year}_{organization}` in `revenues`; create it (`{id: year, organization, months: {month: {receiver: revenue}}}`), or create the month, or the receiver entry, or **add** the revenue to the existing value.
3. Old side: if the doc, month and receiver entry exist, subtract the old revenue (`Math.max(existing - old, 0)`), and write back.
4. Order: the new side is applied first, then the old side is subtracted. Both operations are read-modify-write without a transaction (race conditions are possible).
Data type risk: the functions call `InvoiceFactory.fromData(snap.data())` where `issuedAt` is a Firestore `Timestamp`, not a `Date`; luxon's `DateTime.fromJSDate` returns an invalid date for non-Dates, so `revenuePeriod` can be NaN. Verify against the staging copy (07, B1).

## Storage triggers

| Export | Trigger | Behavior |
|---|---|---|
| `onFinalizedDocument` | object finalize | if path starts with `images/users/` → generate thumbnails (`sharp`, widths 32 and 64, PNG, to `{dir}/thumbs/profile-image_{size}_thumb.png`, made public, then `user-profiles/{uid}.update({imageUrl: https://storage.googleapis.com/{projectId}.appspot.com/{path of the 32px thumb}})`, skipped for non-images and for names containing `_thumb`). Else if metadata has `owner`: `updateDocumentLink({name: basename, path, type: +metadata.type, attachToEmail: metadata.attachToEmail === 'true', owner})` — updates all `document-links` with that `path`; **does nothing if no link exists** |
| `onDeleteDocument` | object delete | skip `images/users/`; if metadata has `owner`: delete all `document-links` with that `path` |
| `onMetadataUpdate` | metadata update | no-op (returns false) |

The user thumbnail code starts the thumbnail work without awaiting `toFile` callbacks (fire-and-forget).

## Batch jobs (`batches/`, run locally with a service-account key `credentials.json`)

| Command | Behavior |
|---|---|
| `reporting-refresh [-t <flag>]` | `lockedDownYear = currentYear - 1`; reads **all** invoices; builds revenue docs for invoices whose `revenuePeriod.year > lockedDownYear` (grouped by year and organization; sums `netValue` per month and receiver) and **overwrites** `revenues/{year}_{organization}` for those years; builds `open-invoices` for all invoices with `isOpen()` (adds `receiverName` from the receiver), deletes **all** existing `open-invoices` and inserts the new ones (batched writes). Note: `testMode` is read from `args.test` but never checked, so the test flag does not prevent writes (07, B2). |
| `list-users` | prints Auth users (see `users-list.ts`) |
| `export` | writes `number-ranges`, `settings`, `contracts`, `receivers`, `invoices`, `revenues` as JSON files under `exports/` (options are broken: reads `args.test` and `args.dirName` which are not defined; the loop is `forEach(async ...)` without awaiting) |

## PDF layout (`printforms`)

`InvoiceFormDataMapper(invoice, receiver, locale='de-DE', currency='EUR')` → `IInvoiceFormData`:
- `address[0..3]`: name, nameAdd, street, `postalCode + ' ' + city`. 
- `invoiceId`, `customerId` (receiver id), `invoiceDate` (Intl date, tz `Europe/Berlin`, fallback UTC with +120 minutes offset), `billingPeriod`, `paymentTerms`, `text` (= `invoiceText`).
- Items: `itemId`, `description`, `quantity` (`Intl.NumberFormat('de-DE')`), `unitPrice` and `netValue` (currency EUR, symbol, e.g. `1.234,50 €`; note `netValue = item.quantity * item.pricePerUnit` directly).
- Totals: `vatPercentage`, `cashDiscountPercentage`, `cashDiscountDueDate` (issuedAt + cashDiscountDays), `totalNetValue`, `totalVatAmount`, `totalGrossAmount`, `cashDiscountBaseAmount`, `cashDiscountAmount`, `payableAmount`.
`InvoiceForm` (PDFKit): title `Rechnung`, author/creator `JOVISCO GmbH`, address block at (70,155), subject at y=255, reference block ("Bitte bei Zahlung angeben:", Kd.Nr., Re.Nr., Datum) at x=395, "Leistungszeitraum {period}" at y=314, page number "Seite 1/1", item table from y=375 (row height `10 + ceil(len/40)*15`), totals, payment terms, invoice text. Read `invoice-form.ts` and `base-form.ts` again in the rebuild for exact coordinates, fonts and colors. Each invoice is printed on one page numbering "1/1" regardless of length.

## Tests to write

1. Number range: create/delete for each of receivers, contracts, invoices, credit requests; delete of non-last document leaves the counter alone (Review Focus 1).
2. Revenue reporting: create, update (status, receiver, issuedAt, amount), delete; month boundaries (day 15/16); the three "new entry" branches; `Math.max(...,0)`.
3. Claims: roles `[]`, `['sales-user']`, `['sys-admin']`, `['sys-admin','sales-user']`, `['auditor']`; profile deletion clears claims; `isLocked` disables the Auth user.
4. HTTP: no token → 403; bad token → 403; `POST /users/new` creates Auth user + profile and strips `uid`; update replaces the profile; password-only update.
5. PDF: stored at the right path with the right metadata; link doc exists; extracted text contains `1.234,50` style amounts and the invoice number; calling twice does not leave duplicate links (decide in 07 whether to keep the duplicate behavior).
6. Storage: finalize with owner metadata updates links; delete removes links; user image creates two thumbnails and sets `imageUrl`.
7. Batch: seeded invoices → expected `revenues` and `open-invoices`; locked-down year untouched; fix the test flag (decision in 07).
