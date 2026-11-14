# Project Description: Invoicing (invoi-6)

## Purpose
A web-based invoicing application by Josef Heiss, JOVISCO GmbH. It manages **receivers** (customers), **contracts**, and **invoices**, produces invoice PDFs, emails them, and maintains revenue / open-invoice reporting. Primary locale is German (`de-DE`).

## Architecture
Firebase-based, three-tier monorepo (no root-level build; each folder has its own `package.json`):

| Folder | Role | Stack |
|---|---|---|
| `web/` | Single-page frontend (PWA) | Angular 11, Angular Material, NgRx 10 (store/effects/entity/router-store), AngularFire 6, RxJS 6, Luxon/Moment |
| `functions/` | Backend (Firebase Cloud Functions, Node 18) | TypeScript, Express, firebase-admin 12, firebase-functions 5, PDFKit, SendGrid, sharp |
| `shared/` | Code shared by functions and batches (Firestore getters/setters for revenues, receivers, etc.) | TypeScript, firebase-admin |
| `batches/` | CLI batch jobs run against Firestore with a service-account key | TypeScript, commander |

The domain model (Invoice, Contract, Receiver, factories, data types) comes from the external npm package `jovisco-domain`.

Hosting and deployment: Firebase Hosting serves `web/dist/invoi-6` with SPA rewrite to `index.html`. Firebase projects: `invoi-p` (prod/default) and `jovisco-invoicing` (dev), set in `.firebaserc`.

## Frontend (`web/src`)
Feature modules, each with its own NgRx store (`actions`, `effects`, `reducers`, `selectors`), business services, and UI services:
- `app/` – shell, routing, home, navigation header/sidebar, UI state.
- `auth/` – login, users management, password change, guards (authentication/authorization), HTTP auth interceptor, validators. Roles include `sys-admin`, `sales-user`, `auditor`.
- `invoicing/` (lazy-loaded; roles `sales-user`, `auditor`) – invoices, contracts, receivers, open invoices, revenue lists, quick-invoice form, document links, confirmations.
- `admin/` – settings, country list, VAT list.
- `storage/` – document upload/download (Firebase Storage).
- `shared/` – Material module, directives, popups, utilities, i18n helpers.

Testing: Jest (`jest-preset-angular`) with coverage output in `web/coverage`; Cypress for e2e; a Sonar test report (`test-report.xml`).

## Backend (`functions/src`)
- **HTTPS API (Express, behind `validateFirebaseIdToken`)**: `POST /new` (create user), `POST /:id` (update user), `POST /invoice-pdf/:id` (generate invoice PDF), `POST /invoice-email/:id` (email invoice). Exported as `invoicing` and `users`.
- **Firestore triggers**: create/delete of receivers, contracts, invoices; update of invoices; create/delete/update of user profiles; delete of document links. These maintain number ranges, revenues, and open invoices, and clean up linked documents.
- **Storage triggers**: document deletion, finalization, metadata update.
- `printforms/` – PDFKit-based invoice layout and data mapping; `utilities/i18n-utilities.ts` sets up German formatting.

## Data and Security
Firestore collections: `user-profiles`, `settings`, `number-ranges`, `revenues`, `open-invoices`, `receivers`, `contracts`, `invoices`, `document-links`. Access rules (`db-rules.txt`, `storage-rules.txt`) are role-based (`sys-admin`, `sales-user`, owner checks).

## Batches (`batches/src`)
- `index.ts` (`reporting-refresh`) – rebuilds revenue/reporting collections from invoices, honoring a locked-down prior year; supports a test mode with no writes.
- `users-list.ts` (`list-users`) – list users.
- `export.ts` (`export`) – data export.
Requires local `credentials.json` service-account files (not committed).

## Common commands (from `web/`)
- `npm start` – dev server (de-DE, proxy, SSL certs); `npm run build` – production build
- `npm test` / `npm run test:coverage` – Jest; `npm run e2e` – Cypress
- `npm run firebase:deploy` / `firebase:deploy-dev` – deploy
- From `functions/`: `npm run build`, `npm run serve`, `npm run deploy`

## Notes
- The root `README.md` is the stock Angular CLI template and does not describe the project.
- `firebase-old.json` is a legacy config.
- Dependencies are dated (Angular 11, Node 18 runtime for functions).
