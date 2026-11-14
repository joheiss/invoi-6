# 01 Feature Inventory

Source: routing modules, containers, templates and business services of `web/src` (Angular 11 app). Locale `de-DE`; all UI texts are German.

## Routes and roles

| Route | Screen | Guards / roles | Notes |
|---|---|---|---|
| `/home` | Home | none | Placeholder text "home works!". Default route (`''` and `**` redirect here). |
| `/auth/login` | Login | none | Email + password (`Validators.required`, `Validators.email`). Error messages from `AUTH_MSGS`. |
| `/auth/goodbye` | Logout | none | Menu entry "Abmelden" navigates here; logs out, snackbar `user-logged-out` ("Sie haben sich abgemeldet."). |
| `/auth/users` | User management | Authentication + Authorization + UsersGuard, roles `['sys-admin']` | List, create, edit users, change password, profile image. |
| `/invoicing` | Overview | Authentication + Authorization, roles `['sales-user', 'auditor']` | Open invoices list and revenue list. |
| `/invoicing/receivers` | Receiver list | as above | Cards per receiver with summary counts. |
| `/invoicing/receivers/:id` | Receiver details | `ReceiverExistsGuard`, `UnsavedChangesGuard` (deactivate) | `:id` is an existing id or one of `new`, `copy`, `quick` (the exists guards let these pass; `new`/`copy` set the form task, `quick` is the quick-invoice flow). |
| `/invoicing/contracts` | Contract list | as above | Table: Nr., Datum, Beschreibung, Gültig ab, Gültig bis, Umfang (budget). |
| `/invoicing/contracts/:id` | Contract details | `ContractExistsGuard`, `UnsavedChangesGuard` | |
| `/invoicing/invoices` | Invoice list | as above | Table: Nr., Datum, Leistungszeitraum, Nettobetrag, Zahlungsbetrag, Fällig am. |
| `/invoicing/invoices/:id` | Invoice details | `InvoiceExistsGuard`, `UnsavedChangesGuard` | |
| `/invoicing/confirmations` | Confirmations | none beyond parent | Container exists (`ConfirmationsComponent`); see open points for content. |
| `/invoicing/settings` | Settings home | `SettingsGuard` | Links to countries and VAT. Menu entry visible for `sys-admin` only. |
| `/invoicing/settings/countries` | Country list | `SettingsGuard` | Dialog: add country, add translation, edit. |
| `/invoicing/settings/vats` | VAT list | `SettingsGuard` | Dialog: new tax code, new period, edit. |

Parent route `/invoicing` loads (guards): NumberRanges, Revenues, Settings, Receivers, Contracts, Invoices. Data is loaded into the NgRx store once and kept in sync by Firestore snapshot streams.

Admin settings routes are registered via `AdminModule`, which `InvoicingModule` imports, so they live under `/invoicing/settings/...` (verified in `invoicing.module.ts`).

## Navigation (sidebar `navi-sidebar`)

| Entry | Link | Visible for |
|---|---|---|
| Überblick | `/invoicing/` (exact) | `sales-user`, `auditor` |
| Rechnungsempfänger | `/invoicing/receivers` | `sales-user`, `auditor` |
| Verträge | `/invoicing/contracts` | `sales-user`, `auditor` |
| Rechnungen | `/invoicing/invoices` | `sales-user`, `auditor` |
| Einstellungen | `/invoicing/settings` | `sys-admin` |
| Benutzer | `/auth/users` | `sys-admin` |
| Anmelden / Abmelden | `/auth/login`, `/auth/goodbye` | logged out / logged in |

Visibility uses the structural directive `*joIfAuthorizedAs="[roles]"`.

## Actions per business object

**Receiver** (Rechnungsempfänger): create (next number from range `receivers`), edit, copy, delete (button shown only if `isDeletable` or still new; deletable only when it has no contracts and no invoices), create quick invoice (button "Neue Rechnung", shown when exactly one invoiceable contract exists and the form is valid and not dirty), tabs for related contracts/invoices/documents, document upload.

**Contract**: create (range `contracts`), edit (only if changeable = no invoices yet), copy, delete (changeable only), "Neue Rechnung" (shown when contract term is invoiceable and the form is valid and not dirty), items sub-form with at least one item, documents.

**Invoice**: create (range `invoices`, or `credit-requests` when `billingMethod = 1`), edit (only if status is not `paid`), copy, delete, add/remove items, "PDF erzeugen" (only if `status === 0` and `billingMethod === 0`), "Senden" (email, only if sendable, see 05; **out of scope in the rebuild for now**), documents, status select (In Bearbeitung / versandt / bezahlt), quick invoice from a contract.

**Documents** (`document-link-list` inside the details pages): list links for the business object, upload (file input), download, delete, toggle `attachToEmail`, change document `type`. Storage path `docs/{objectType}/{id}/...`; new uploads default to type `6` (Other).

**Admin**: settings documents (countries, VAT) edited through dialogs.

**Users** (sys-admin): create user (email, name, phone, organization, roles, password + confirm), edit, lock (`isLocked`), change password (dialog), profile image upload/delete. "My profile" dialog with limited fields (organization and roles disabled).

## Cross-cutting behaviors

- Snackbar messages (success/error/info) with texts from `INVOICING_MSGS`, `AUTH_MSGS`, `STORAGE_MSGS` (see 05).
- Confirmation dialogs: delete confirmation (`Soll die Rechnung {id} wirklich gelöscht werden?` and equivalents), unsaved changes dialog (`Sie haben noch ungesicherte Änderungen.` / `Wollen Sie den Dialog trotzdem verlassen?`).
- Spinner during async actions (`StartSpinning`/`StopSpinning`).
- Auth state: after `onAuthStateChanged`, the ID token is stored in `sessionStorage['id_token']`, the user profile document `user-profiles/{uid}` is read, and a locked profile (`isLocked`) is never accepted (`first(profile => !profile.isLocked)`).

## Tests to write

- Each route in the table exists and shows the screen for the roles that should see it.
- Sidebar entries per role.
- Locked profile cannot use the app.
- Each action above has at least one behavior test (see 05 for field-level cases).
