# 02 Data Model

Source: `jovisco-domain` v1.0.70 (`https://github.com/joheiss/jovisco-domain`, cloned; 2297 lines in `lib/`, 71 tests), plus how `web/`, `functions/` and `batches/` read and write Firestore. **Verify field types against real documents in Task 2 (anonymized sample, 3 per collection).**

## Conventions

- Document id equals the business id as a string (`invoices/{id}`, `receivers/{id}`, `contracts/{id}`), taken from the number range at creation by the **client** (`getNextId`), e.g. `'1001'`. Ids are numeric strings; comparisons use `localeCompare` or string comparison (`>`), so they only sort correctly with equal length.
- `objectType` is the collection name (`'invoices'`, `'contracts'`, `'receivers'`). `ownerKey` = `${objectType}/${id}` and is used in `document-links.owner`.
- `organization`: set from the logged-in user's profile on create (`auth.organization`). Part of revenue document ids.
- Dates are JS `Date` in the domain model and Firestore `Timestamp` in storage. (**Open point:** whether the Cloud Functions convert them, see 07.)
- Enums are stored as numbers.

## Enums

| Enum | Values |
|---|---|
| `InvoiceStatus` | `0 created` (In Bearbeitung), `1 billed` (versandt), `2 paid` (bezahlt) |
| `BillingMethod` | `0 Invoice` (Rechnung), `1 CreditNote` (Gutschriftverfahren) |
| `PaymentMethod` | `0 BankTransfer` (Überweisung), `1 DirectDebit` (Bankeinzug), `2 CreditCard`, `3 Check`, `4 Cash` (UI offers the first two) |
| `MasterdataStatus` | `0 active`, `1 inactive` |
| `DocumentLinkType` | `0 Invoice`, `1 CreditRequest`, `2 ProjectContract`, `3 MasterContract`, `4 TravelExpenses`, `5 ServiceConfirmation`, `6 Other` |
| `ItemChangeMode` | `'' unknown`, `added`, `changed`, `deleted`, `moved` (client logic only) |

## Collections

### `receivers/{id}` (`ReceiverData`)
`id, objectType='receivers', organization, isDeletable (default true), status (0 default), name (required), nameAdd?, logoUrl?, address{country (default 'DE'), postalCode, city, street, email?, phone?, fax?, webSite?}`.
Form rules: name, postalCode, city required; email `^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$`; phone/fax `^\+?[\d -]+$`; website/logo URL regexp `https?://...` (see 05).

### `contracts/{id}` (`ContractData`)
`id, objectType='contracts', organization, isDeletable (true), issuedAt (default today 00:00), description, customerId (receiver id), term{startDate, endDate} (default `ContractTermFactory.nextDefaultTerm(today)`), paymentTerms, paymentMethod (0), billingMethod (0), cashDiscountDays (0), cashDiscountPercentage (0), dueDays (30), currency ('EUR'), budget (0), invoiceText?, internalText?, items[]`.
Item: `{id: number, description, pricePerUnit (0), priceUnit, cashDiscountAllowed (false)}`.
Term rules (`ContractTerm`): valid = start < end; `isActive` = start <= now <= end; `isExpired`; `isFuture`; `isInvoiceable` = start <= now <= end + 15 days; start date normalized to start of day and end date to end of day (`DateUtility.getStartDate/getEndDate`).

### `invoices/{id}` (`InvoiceData`)
`id, objectType='invoices', organization, isDeletable (true), issuedAt (today), status (0), receiverId, contractId?, billingMethod (0), billingPeriod?, currency ('EUR'), paymentTerms ('30 Tage: netto'), paymentMethod (0), cashDiscountDays (0), cashDiscountPercentage (0), dueInDays (30), vatPercentage (19.0), invoiceText?, internalText?, items[]`.
Item: `{id, contractItemId?, description?, quantity (0), quantityUnit?, pricePerUnit (0), cashDiscountAllowed (false), vatPercentage?}`.

Calculations (all in the domain, to be ported 1:1; see `ai/spec/06-domain-package.md` and the test list there):
- Item: `netValue = quantity*pricePerUnit` (0 if either is falsy); `vatValue = netValue*vat%/100`; `grossValue = net+vat`; `discountableValue = cashDiscountAllowed ? grossValue : 0`; `getCashDiscountValue(p) = allowed ? gross*p/100 : 0`; `getDiscountedValue(p) = gross - cashDiscountValue`; `getDiscountedNetValue(p) = allowed && p>0 ? discounted*100/(100+vat) : net`.
- Invoice: `netValue = Σ item.netValue`; `vatPercentage = header.vatPercentage || 19`; `vatAmount = netValue*vatPercentage/100` (**uses the header VAT, not the item VAT**); `grossValue = net+vat`; `cashDiscountAmount`, `cashDiscountBaseAmount`, `paymentAmount = Σ item.getDiscountedValue(cashDiscount%)`, `discountedNetValue`; `dueDate = issuedAt + dueInDays`; `cashDiscountDate = issuedAt + cashDiscountDays`; `isOpen = status != paid`; `isDue = status != paid && dueDate <= today 00:00`; `isBilled`, `isPaid`.
- `revenuePeriod`: if `issuedAt.day > 15` → same month, else previous month (`{year, month}`).
- `getNextItemId()`: 1 if empty; otherwise the first gap or max+1 (**note the implementation sorts ids as strings via `.sort()` and returns `gaps[0] - 1`; characterize with tests before porting, see 06**).

### `number-ranges/{id}` (`NumberRangeData`)
Ids in use: `receivers`, `contracts`, `invoices`, `credit-requests`. Fields: `startAtId?, endAtId?, lastUsedId?`. `nextId` = `startAtId` if no `lastUsedId`; else `lastUsedId+1` when `lastUsedId >= startAtId`, else `startAtId`. `endAtId` is not enforced in code.

### `settings/{id}` (`SettingData`)
`{id, values: any}`. Known documents: countries (`values: CountryData[]` with `{isoCode, names: {[langCode]: name}}`) and VAT (`values: VatData[]` with `{taxCode, validFrom, validTo, percentage}`). The client looks up VAT with tax code `${receiver.address.country}_full` and the invoice `issuedAt` (`Vat.findVatPercentage`; **throws if no period matches**). Exact document ids: read from real data (Task 2).

### `revenues/{year}_{organization}` (`RevenueData`)
`{id: year (string), organization, months: {[month 1..12 as string]: {[receiverId]: netValue}}}`. Maintained by the invoice triggers and rebuilt by the batch job.

### `open-invoices/{id}`
`{id, organization, issuedAt, status, receiverId, receiverName, billingPeriod, netValue, paymentAmount, dueDate}`. Written only by the batch job (`reporting-refresh`); the web app computes its own open-invoice list from invoices (`selectAllOpenInvoicesWithReceiver`, sorted by `dueDate` ascending).

### `document-links/{auto-id}` (`DocumentLinkData`)
`{name, path, type, attachToEmail, owner}`; `owner` = `{objectType}/{id}`; `path` = Storage path (`docs/invoices/{id}/R{id}.pdf`). Created by the client or the PDF endpoint; updated/deleted by Storage triggers.

### `user-profiles/{uid}` (`UserProfileData`)
`{email, roles: string[], organization, displayName, phoneNumber, imageUrl, isLocked (false)}`. `uid` is the document id; it is removed from the payload before writing. Roles in use: `sys-admin`, `sales-user`, `auditor`.

### Firebase Auth
Users with email/password. Custom claims `{isAdmin, isSales}` are set from the profile roles (`sys-admin` → `isAdmin`, `sales-user` → `isSales`; **`auditor` sets neither claim**, so auditors cannot read Storage `docs/`). Auth `disabled` mirrors `isLocked`; `displayName`, `phoneNumber`, `photoURL` mirror the profile.

### Storage layout
`docs/{objectType}/{id}/{file}` (document uploads; metadata `owner`, `type`, `attachToEmail`), `docs/invoices/{id}/R{id}.pdf` (generated), `images/users/{uid}/...` and `images/users/{uid}/thumbs/profile-image_{32|64}_thumb.png` (generated thumbnails, made public), `assets/**`.

## Read models (derived in the client, never stored)

- `ReceiverSummary`: active contract count (term active or future), expired contract count, last contract id, due and open invoice counts, last invoice id; `deletable` is `lastContractId.length + lastInvoiceId.length > 0` (**inverted naming: the getter returns true when the receiver is NOT deletable; check usage in 05**).
- `ContractSummary`: `revenue = Σ netValue of its invoices`, `lastInvoiceId`, `changeable = lastInvoiceId.length > 0` (**again inverted**: used as "has invoices").
- `InvoiceSummary`: `receiverName`, `changeable`.
- Sort orders: invoice and contract summaries by `issuedAt` desc then id desc (`localeCompare`); receivers by id asc; Firestore query orders: receivers `id asc`, invoices `issuedAt desc`.
- `selectRecentContractsForReceiver`: 5 newest by id; `selectLastInvoicesForReceiver`: the single highest id.

## Tests to write

- Round trip `Data → domain → Data` for each collection with sample documents.
- Every calculation above, using values taken from running the old domain package on the same documents (golden files).
- Number range: `nextId` with no last id, last below start, last at/above start.
- Term rules around the boundaries (start, end, end+15 days).
- `revenuePeriod` on day 15 and day 16.
- Open point checks flagged in bold above (naming inversions, `getNextItemId`).
