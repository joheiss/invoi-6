# 05 UI Behavior

Source: components, templates, validators, business services and selectors in `web/src` (Angular 11, Material). Screenshots of every screen (51 images, taken 2026-11-14 from the old app running against the anonymized emulator data) are in `ai/spec/screens/`; see `ai/spec/screens/README.md` for setup and observations.

## Shared form mechanics (`DetailsFormComponent`, used by receiver, contract, invoice, quick-invoice forms)

- The form is built once and then patched with the object whenever the input changes.
- Field handlers listen to `valueChanges` with **`debounceTime(500)` and `distinctUntilChanged()`**, and apply the change to the working object only when the control is **valid**; the object is then emitted as `changed`, and totals are shown from the domain calculation (`patchForm` writes the formatted totals back).
- Save (`onSave`): builds the changed object from the form, emits `update` if the object has an `id`, otherwise `create`, then marks the form pristine.
- Buttons (per form): **Zurück** (form pristine) / **Abbrechen** (form dirty) → navigate back; **Neu**; **Kopieren**; **Löschen** (shown when changeable/deletable or object has no id yet); **Speichern** (primary; shown when changeable).
- Navigating away from a dirty form asks: title `Sie haben noch ungesicherte Änderungen.`, text `Wollen Sie den Dialog trotzdem verlassen?` (`UnsavedChangesGuard`, uses `component.formComponent.form.dirty`).
- Tabs: first tab is the form; tab index < 2 controls whether the action buttons show; other tabs hold related lists and documents.
- Delete asks for confirmation through `OpenConfirmationDialog` with titles: `Soll die Rechnung {id} wirklich gelöscht werden?` (analogous texts for contracts and receivers; read exact strings in the business services).
- Copy: takes the object's data, overlays the default values (new date, status etc.), sets `organization` from the user, and opens `/…/copy`. New: opens `/…/new` with the template defaults.
- Create: `id` from the number range (`getNextId`), `organization = auth.organization`, `isDeletable = true`.

## Number and date input

- Amounts are entered in German format. `fromLocalAmount`: empty → 0; strings have thousand separators removed and `,` replaced by `.`; non-strings pass through. `toLocalAmount` formats with `1.2-2` (always 2 decimals); `toLocalPercent` formats with `1.1-3`; `fromLocalPercent` = `fromLocalAmount`.
- Amount pattern (`REGEXP_AMOUNT`): `(?=.)^\$?(([1-9][0-9]{0,2}(\.[0-9]{3})*)|[0-9]+)?(,[0-9]{1,2})?$` (digits with optional `.` thousands, optional `,` and one or two decimals). Digits pattern: `\d+`.
- Dates come from Material datepickers with the Moment adapter; start dates are normalized to 00:00 of the day, end dates to 23:59:59.999 (local time) via `DateUtility`.

## Receiver

List (`receiver` cards): per receiver a card with name/number and the summary counts: Aktive Verträge, Abgelaufene Verträge, Letzter Vertrag, Fällige Rechnungen, Offene Rechnungen, plus last invoice. Ordered by id ascending. Button to create a receiver.

Form fields: `id` (disabled), `status` (aktiv/inaktiv), `name` (required), `nameAdd`, `country`, `street`, `postalCode` (required), `city` (required), `email` (pattern), `phone` and `fax` (phone pattern), `webSite` and `logoUrl` (URL pattern). Group error banners for the address and communication sections. Related: active contracts, open invoices (shown in edit mode when present), documents. "Neue Rechnung" appears only if `isQualForQuickInvoice && form.valid && !form.dirty` where qualification = exactly one invoiceable contract for the receiver. Delete shown if `isDeletable || new`; deletable when the receiver has no contracts and no invoices.

Quick invoice (`/invoicing/invoices/quick`): form with `issuedAt` (required), `billingPeriod` (required), `quantity` (required, amount pattern), `description` (required); invoice is built from the single invoiceable contract (`InvoiceFactory.fromContract`), VAT percentage looked up from settings by `{country}_full` and the issue date, applied to the invoice and its items; totals shown live. Saving creates an invoice with one item.

## Contract

List columns: `id` (Nr.), `issuedAt` (Datum), `description` (Beschreibung), `startDate` (Gültig ab), `endDate` (Gültig bis), `budget` (Umfang); newest first (issuedAt desc, then id desc); button "Vertrag anlegen".

Form fields: `id` (disabled), `issuedAt` (required), `description` (required), `customerId` (required, digits), `startDate` (required), `endDate` (required; group validator `endDateValidator`: error `dateSequence` when start is after end; equal dates are allowed), `currency` (required), `budget` (amount pattern), `billingMethod` (Rechnung / Gutschriftverfahren, required), `paymentTerms` (required), `paymentMethod` (Überweisung / Bankeinzug, required), `cashDiscountDays` (digits), `cashDiscountPercentage` (amount), `dueDays` (required, digits), `documentUrl` (URL pattern), `items` (FormArray, validator `minOneItemValidator` → error `minItems`). Item fields: description, price per unit, price unit, cash discount allowed. Contract is changeable only while it has no invoices. "Neue Rechnung" appears if the term is invoiceable and the form is valid and not dirty. Related invoices (all / open) shown in edit mode.

## Invoice

List columns: `id` (Nr.), `issuedAt` (Datum), `billingPeriod` (Leistungszeitraum/Zeitraum), `netValue` (Nettobetrag), `paymentAmount` (Zahlungsbetrag), `dueDate` (Fällig am); newest first.
Open invoice list on the overview: columns Nr., Datum, Kunde, Leistungszeitraum, Nettobetrag, Zahlungsbetrag, Fällig am (due date ascending), title "Offene Rechnungen".

Form fields: `id` (disabled), `status` (In Bearbeitung/versandt/bezahlt; required), `issuedAt` (required), `receiverId` (required; active receivers sorted), `billingPeriod` (required), `contractId` (required; selectable contracts = contracts that are invoiceable, plus the invoice's own contract), `billingMethod` (required), `currency` (required), `vatPercentage` (amount pattern), `paymentTerms` (required), `paymentMethod` (required), `cashDiscountDays` (digits), `cashDiscountPercentage` (amount), `dueInDays` (required, digits), texts group (`invoiceText`, `internalText`), `documentUrl`, `items` (FormArray, at least one item). Item fields: `contractItemId` (Vertragsposition), `description` (required), `quantity` (required, amount pattern), `quantityUnit` (Einheit, required), `pricePerUnit` (Einzelpreis, required, amount pattern), calculated "Gesamtpreis", `cashDiscountAllowed` ("Skonto erlaubt?").

Totals shown (formatted): net value, VAT amount, gross value, cash-discount base amount, cash-discount amount, payment amount.

Dependent changes (processed in `InvoicesBusinessService.processChanges` after each change; uses `InvoiceChangeActionFactory`, a diff between the previous data and the edited invoice):
- `receiverId` changed → VAT percentage is looked up again for the receiver's country (`{country}_full`) at the invoice date and applied to the header (**error `vat_not_found` if no period matches**).
- `contractId` changed → header fields copied from the contract (`customerId→receiverId`, billingMethod, paymentMethod, paymentTerms, cashDiscountPercentage, cashDiscountDays, `dueDays→dueInDays`, invoiceText).
- Item `contractItemId` changed → the item's description, unit, price and discount flag are taken from that contract item.
- Item added (`INVOICE_ITEM_ID_ADDED`) → the new item takes the contract item with the same id; if none exists, the lookup decrements the contract item id down to 1 (`retryWhen`), then fails with `contract_item_not_found`.
- `issuedAt` changed → handled as a plain header change (VAT is **not** re-looked up).
Item operations: `addItem` appends an item with `getNextItemId()` and invoice defaults (`quantity 0`, `pricePerUnit 0`, `cashDiscountAllowed false`, item VAT = invoice VAT); `removeItem` filters by id.
Changeable = status is not `paid` (`selectInvoiceChangeable`); Löschen visible when changeable or new; PDF button visible if `status === 0 && billingMethod === 0`; "Senden" visible if `isSendable` = `status === created` and at least one document link of the invoice has `attachToEmail` and `type === Invoice` (email itself deferred).
Snackbars: `invoice-pdf-created` ("Das PDF für die Rechnung wurde erstellt und gespeichert."), `invoice-pdf-failed` etc.

## Overview (`/invoicing`)

Two lists: open invoices (above) and revenue list (`RevenueList`, three years: current and two previous; per year 12 monthly sums plus the year total, via `Revenue.calculateTotalRevenuesPerYear`; sums over all receivers).

## Documents (`document-link-list`)

Lists document links for the business object (`owner` equals `{objectType}/{id}`). Upload path `docs/{objectType}/{id}`; new links default to type `6` (Other), `attachToEmail false`. Per link: download, delete (deletes the Storage file; the link is removed by the Storage trigger), toggle email attachment, change type. Messages `file-upload-success`, `file-delete-success`, `file-download-success` and the fail variants with `$%` placeholders for the file name.

## Admin

- Settings page with entries **Länder** and **Umsatzsteuer**.
- Countries dialog: `isoCode` (disabled except when adding a new country; saved only if ≥ 2 characters), translations (language code + name; error `translationExists` if a language is already present); tasks `edit`, `new`, `translate`.
- VAT dialog: `taxCode` (enabled only for a new tax code), `validFrom` (required), `validTo`, `percentage`; tasks `edit`, `new`, `period` (new validity period for an existing tax code). Tax codes in use follow `{country}_full` (and presumably `{country}_reduced`; verify in data).

## Users / auth

- Login: email and password required, email validated; failure shows `auth/wrong-password`, `auth/user-not-found` or `auth/login-fail` messages ("Anmeldung ist fehlgeschlagen. Bitte überprüfen Sie ihre Eingaben.").
- User list (sys-admin): shows users, "Benutzer hinzufügen", edit dialog fields: email (required, Angular email validator; editable only for a new user), `displayName` (required), `phoneNumber` (phone pattern), `organization` (required), `roles` (required; multi-select), `isLocked` ("gesperrt?"), image URL (URL pattern), image upload ("Bild hochladen") and delete ("Bild löschen"), password and confirm for a new user (both required; group validator `passwordValidator` sets `passwordMatch` on `confirm`).
- Password change dialog: `oldPassword` (required only for task `change`, i.e. changing your own password), `password` and `confirm` (required, must match).
- My profile dialog: same fields, `organization` and `roles` disabled.
- Messages: `user-create-success` ("Der Benutzer $% wurde angelegt."), `user-update-success`, `password-update-success` ("Das Passwort wurde geändert."), `user-logged-out`, and the fail variants (see `auth-error-messages.ts`).

## Message catalog

Ported 1:1 from `INVOICING_MSGS`, `AUTH_MSGS`, `STORAGE_MSGS`, plus `Messages` class rules: `$%` placeholders are replaced in order by params; an unknown id yields `Unbekannte Nachricht: {id}`. `usage` is `success`, `error` or `info` (snackbar style).

## Tests to write

1. Debounce and validity gating (use fake timers): a change is applied after 500 ms only when the control is valid.
2. Each field validator (valid and invalid examples), `endDateValidator` (before, equal, after), `minOneItemValidator`, `passwordValidator`, amount/digit/URL/email/phone patterns with the strings from `shared/validators`.
3. Totals shown equal the domain calculation for sample invoices (including cash discount).
4. Dependent changes: receiver, contract, contract item, added item, with a missing VAT period and a missing contract item.
5. Visibility rules of buttons (delete, save, PDF, send, quick invoice) per state.
6. Unsaved-changes dialog on navigation; dirty form + back = "Abbrechen".
7. Lists: sort orders, columns, the open-invoices list (due date ascending), revenue table for three years.
8. Documents: upload, delete, toggle attachment, change type.
9. Admin dialogs and user dialogs, including disabled fields per task.
