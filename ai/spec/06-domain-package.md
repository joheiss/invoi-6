# 06 Domain Package Decision (`jovisco-domain`)

## Findings

- Source: `https://github.com/joheiss/jovisco-domain` (public, default branch head `5199584`, tag `v70` = npm `1.0.70`). Cloned to a scratch folder for this analysis.
- Size: 2297 lines of TypeScript in `lib/` (core, documents, invoicing, reporting, settings, user, utils) and 11 spec files with **71 tests** (`__tests__/`, including mock factories for contracts, invoices, receivers and settings).
- Build: `tsc` to `dist/`, CommonJS (`main: ./dist/index.js`), tests with Jest 26 and ts-jest 26, TypeScript 4.0, Node types 14.
- Runtime dependencies: `lodash` (`isEqual`, `isObject`, `transform`) and `luxon` 1.x. (Moment is only touched through duck-typed `moment.valueOf()` in `DateUtility`; no dependency.)
- Baseline verified on 2026-11-14: `npm ci` and `jest` on a fresh clone give **11 suites, 71 tests, all passing**.
- Consumers: `web` (Angular), `functions`, `batches`. No framework code inside the package.

## Public surface that the rebuild needs

- **Types:** `InvoiceData`, `InvoiceItemData`, `ContractData`, `ContractItemData`, `ReceiverData`, `ReceiverAddressData`, `NumberRangeData`, `SettingData`, `CountryData`, `VatData`, `RevenueData`, `RevenueExtractData`, `RevenuePerYearData`, `OpenInvoiceData`, `DocumentLinkData`, `UserData`, `UserProfileData`, `UserCredentials`, `MessageMap`, `Dictionary`.
- **Enums:** `InvoiceStatus`, `BillingMethod`, `PaymentMethod`, `MasterdataStatus`, `DocumentLinkType`, `ItemChangeMode`.
- **Classes and factories:** `Invoice`, `InvoiceItem`, `InvoiceFactory`, `InvoiceItemFactory`, `Invoicing.createInvoiceFromContract`, `InvoiceChangeActionFactory`, `InvoiceChangeAction` (+ action constants), `InvoiceQuery`, `InvoiceSummary(ies)`, `Contract`, `ContractItem`, `ContractTerm`, `ContractTermFactory`, `ContractFactory`, `ContractQuery`, `ContractSummary(ies)`, `Receiver`, `ReceiverFactory`, `ReceiverQuery`, `ReceiverSummary(ies)`, `Revenue`, `RevenueFactory`, `OpenInvoice(Factory)`, `NumberRange(Factory)`, `Vat`, `DocumentLink(Factory)`, `User(Factory)`, `Messages`, `DateUtility`, `difference`.
- Behavior of the calculations is documented in `02-data-model.md`.

## Quirks to preserve or decide on (see 07)

1. `Transaction.getNextItemId()` sorts ids with the default string sort and returns `gaps[0] - 1` when a gap exists, `max + 1` otherwise (e.g. ids `[1,3]` → gaps `[3]` → returns `2`; ids `[2,3]` → gaps `[2,3]` → returns `1`; ids `[1,2,10]` sorts as `1,10,2`, gap detection misfires → returns `9`). Characterize with tests; the rebuild should use a correct "first free id" implementation and a test that pins the correct values (open point C1).
2. `Transaction.removeItem` filters on `item.id !== id` using the `id` getter (fine) while `getItem` uses `item.data.id`.
3. `Invoice.vatAmount` uses the header VAT percentage, not item VATs (items carry a VAT too, used only in item-level gross values and discount math).
4. `Invoice.vatPercentage` getter returns `header.vatPercentage || 19` (VAT 0 becomes 19; a 0% invoice is impossible). `Vat.findVatPercentage(...)` throws if no period matches.
5. `ReceiverSummary.deletable` and `ContractSummary.changeable` are named inversely to their logic (see 02).
6. `InvoiceFactory.fromContract` reads `contract.items[0]` and throws if the contract has no items; its items miss `quantity` (default 0 via `InvoiceItem`) and `vatPercentage`.
7. `InvoiceChangeActionFactory` logs with `console.log` and maps item changes by array index; behavior for moved/deleted items is intricate (covered by `invoice-test.spec.ts`).
8. `Invoice.defaultValues()` and `Contract.defaultValues()` use `DateUtility.getCurrentDate()` (local midnight) and the contract default term from `ContractTermFactory.nextDefaultTerm(today)` (read the factory when porting).
9. Luxon 1.x APIs (`Interval.fromDateTimes`, `DateTime.fromJSDate`) — behavior with non-Date inputs matters (Timestamp objects, see 04 and 07 B1).

## Decision

**Recommended: re-create the package inside the new repo as `packages/domain`** (npm workspace, name `@jovisco/domain` or similar) and **do not republish to npm**.

Reasons: (1) the source is public and small, with an existing test suite that can be ported as the first characterization tests; (2) it blocks nothing else: all consumers (web, functions, batches) live in the new repo; (3) the old stack (TS 4.0, Jest 26, luxon 1.x, CommonJS) would force ESM/dual-build work if republished; (4) a workspace package can move to luxon 3 and TypeScript 5 with the old tests as the safety net; (5) the signal-based frontend does not need the class-based mutable models (`Invoice.items.push`, setters) to be kept, so the package can keep the **calculations and data types** and replace the mutable classes with pure functions plus immutable value objects, **but only after** all 71 tests are ported and green.

Port steps (Task 3/5 in the plan):
1. Copy `lib/` and `__tests__/` into `packages/domain/`, switch Jest to Vitest, luxon to 3.x (`@types/luxon` 3), TypeScript 5, ESM output. Run the tests: all 71 must pass before any change.
2. Add golden-file tests: run the old package on the anonymized sample documents (Task 2) and store inputs and outputs as JSON fixtures for `netValue`, `vatAmount`, `grossValue`, `paymentAmount`, `cashDiscount*`, `dueDate`, `revenuePeriod`, summaries.
3. Only then refactor (immutable models, pure functions) while keeping those tests green.

## Tests to write

- The 71 existing tests, ported 1:1 (inventory per file: contract-term 13, invoice 30, contract 8, receiver 5, utils 5, summary 3, reporting 2, settings 2, core 1, documents 1, user 1).
- Golden-file tests from real (anonymized) documents.
- Time-dependent tests (`isDue`, `isActive`, `isInvoiceable`) use a fixed clock (inject or fake timers).
- The quirks list above: one test per item, expecting the current behavior unless the owner decides otherwise in 07.
