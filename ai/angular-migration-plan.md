# Angular Migration (11 → latest, signal-based) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move `web/` from Angular 11 (NgRx 10, RxJS 6, Firebase 8) to the current Angular major, written in signal style (signal inputs/outputs, `inject()`, standalone components, built-in control flow, signal-based state), and bring the dependencies in `functions/`, `shared/` and `batches/` to compatible, supported versions.

**Architecture:** Upgrade in place and incrementally. `ng update` only supports one major at a time, so go 11→12→…→latest with a green build and green tests at every hop. After the framework is current, convert to signal style with Angular's official schematics, one feature module at a time. Backend packages are migrated separately and do not block the frontend.

**Tech Stack (target, verified on npm 2026-11-14 — re-check at execution time):** Angular 22.x (`@angular/core` 22.2.6), Angular Material/CDK 22.x, NgRx 22.x (`@ngrx/store` 22.0.1), `@angular/fire` 21.x (verify Angular 22 peer range first), Firebase JS SDK 13.x (modular API), RxJS 7.x, TypeScript as required by Angular 22 peer deps, Node `^22.22.3 || ^24.15.0` (Angular 22 engines), Jest 30.x or Angular's built-in unit-test builder, `firebase-functions` 7.x, `firebase-admin` 14.x.

**Spec:** No separate spec. The request is: "migrate to the latest Angular, signal-based, and migrate all dependencies to compatible versions." Baseline facts are in `ai/project-description.md`.

## Global Constraints

- Use `ng update` for every framework hop. Hand-edit versions in `package.json` only for packages `ng update` doesn't cover.
- One Angular major per commit or PR. Never skip a major.
- Each hop must pass `ng build --configuration=production` and the full Jest suite (134 spec files today) before moving on.
- No new feature work during the migration. Behavior and UI must stay identical, including the `de-DE` locale.
- Keep the NgRx store working during framework hops. Move to signal state only after the framework is current.
- Don't commit `credentials*.json`, `localhost.key` or `localhost.pem`.
- Work on a branch (`migration/angular-latest`) and tag the last Angular 11 state as `pre-migration`.

## Review Focus

Behaviors the code base implies but tests are unlikely to cover. Each has a pinning check in the owning task.

1. **Auth guards and role routing** (`sales-user`, `auditor`, `sys-admin`) must still block navigation: unauthenticated and wrong-role users are redirected. Pinned in Task 6.
2. **Firestore triggers** still maintain number ranges, revenues and open invoices after the Functions upgrade. Check against the emulator in Task 12.
3. **Invoice PDF and email endpoints** still return a valid PDF with correct German number and date formatting under newer Node and ICU. Pinned in Task 12.
4. **Date handling** (Moment, Luxon, Firestore `Timestamp`) stays identical across the Firebase modular API change. Pinned in Task 7.
5. **Service worker / PWA update** still activates on the first deploy after the upgrade, so users aren't stuck on a cached old bundle. Check in Task 13.

## Baseline Facts (from the repo)

| Item | Today |
|---|---|
| Angular / Material / CDK | 11.0.x |
| NgRx | 10.x |
| RxJS | 6.6 (+ `rxjs-compat`) |
| TypeScript | 4.0 |
| Firebase / AngularFire | 8.1 / 6.1 (compat-style API) |
| `zone.js` | 0.10.3 |
| Modules | 12 `NgModule`s, 54 components, 48 templates, 186 `*ngIf`/`*ngFor`/`ngSwitch` usages |
| State | 27 NgRx effects files, 9 entity-adapter stores |
| `@Input`/`@Output`/`@ViewChild` | 23 files |
| Layout | `@angular/flex-layout` in 12 templates (now deprecated, last release is beta) |
| Lint / test / e2e | TSLint, Jest 26 + `jest-preset-angular` 8, Cypress 5, Protractor (e2e folder) |
| Routing | one lazy route using string `loadChildren: '../invoicing/invoicing.module#InvoicingModule'` (removed in Angular 13+) |
| Other legacy | `import 'hammerjs'` in `main.ts`, `@angular/platform-server` + `server/server.ts` + `main.server.ts` (Universal), `ngx` style `app.server.module` |
| Domain package | `jovisco-domain` 1.0.70 (own package, shared by web/functions/batches) |
| Backend | Node 18, `firebase-functions` 5, `firebase-admin` 12, `pdfkit` 0.11, `sharp` 0.33, `@sendgrid/mail` 7, TypeScript 5.4 |
| `shared` / `batches` | `firebase-admin` 9, `firebase` 7 (batches), TypeScript 4.0 |

## File Structure (what changes where)

- `web/package.json`, `web/angular.json`, `web/tsconfig*.json`: tooling and builder migrations (browser builder → `application` builder, TSLint → ESLint, Protractor removed).
- `web/src/main.ts`: switch from `platformBrowserDynamic().bootstrapModule` to `bootstrapApplication` with `provideRouter`, `provideHttpClient`, `provideStore` and the Firebase providers.
- `web/src/app`, `auth`, `invoicing`, `admin`, `storage`, `shared`: each loses its `NgModule` and gains standalone components and a `*.routes.ts` file.
- `web/src/**/store/**`: reducers, effects and selectors stay NgRx at first. Selectors gain `selectSignal` usage in components. Optionally, leaf feature stores later become `signalStore`.
- `web/jest.config.js`, `web/src/setupJest.ts`: Jest 30 config, or replace with the Angular unit-test builder.
- `functions/`, `shared/`, `batches/`: independent `package.json` upgrades and API adaptions.
- Delete: `web/server/`, `main.server.ts`, `app.server.module.ts`, `tsconfig.server.json`, `web/e2e/` (Protractor), `firebase-old.json`, committed `web/coverage/` and `web/dist/` artifacts (add to `.gitignore`).

---

### Task 0: Baseline, safety net and environment

**Files:**
- Modify: `.gitignore` (add `web/coverage/`, `web/dist/`, `*.cache`)
- Create: `ai/migration-log.md` (one line per hop: version, date, test count, issues)

**Interfaces:**
- Produces: a recorded green baseline (build + test counts) that every later task compares against.

- [ ] **Step 1:** Create branch `migration/angular-latest` and tag current HEAD `pre-migration`.
- [ ] **Step 2:** In `web/`, run `npm ci && npm run build && npx jest`. Record pass/fail counts in `ai/migration-log.md`. Expected: build succeeds. Record any failing specs as known failures, because they must not be mistaken for migration regressions.
- [ ] **Step 3:** Install a Node version manager entry for each Node version used by hops (see the version table in Task 1) and add `.nvmrc` to `web/`.
- [ ] **Step 4:** Add a smoke checklist to `ai/migration-log.md`: login, invoice list, open an invoice, create a draft invoice, generate PDF, upload a document, admin VAT list. Run it manually against the **dev** Firebase project (`jovisco-invoicing`) and record the result as the behavioral baseline.
- [ ] **Step 5:** Commit: `chore: record migration baseline`.

### Task 1: Framework hops 11 → 15 (module-based, NgRx and Material in lock-step)

**Files:**
- Modify: `web/package.json`, `web/angular.json`, `web/tsconfig.json`, `web/src/app/app-routing.module.ts`, `web/src/main.ts`, plus whatever each schematic rewrites.

**Interfaces:**
- Produces: a building, tested app on Angular 15 and NgRx 15, with RxJS 7 and TS 4.8+, and no `rxjs-compat`.

For each hop N in 12, 13, 14, 15, repeat the cycle below. Use the Angular update guide (`https://angular.dev/update-guide`) for the exact Node/TS/RxJS floors at each hop, and switch Node accordingly.

- [ ] **Step 1:** `cd web && git status` must be clean. Run `npx ng update @angular/core@N @angular/cli@N`, then `npx ng update @angular/material@N`, then `npx ng update @ngrx/store@N @ngrx/effects@N @ngrx/entity@N @ngrx/router-store@N @ngrx/store-devtools@N`. Commit each update separately so a bad schematic can be reverted alone.
- [ ] **Step 2:** Run `npm run build` and `npx jest`. Fix breakages. The expected recurring ones are listed below.
- [ ] **Step 3:** Append the hop result to `ai/migration-log.md`, then commit `chore: angular N`.

Hop-specific work (do it in the hop where it first breaks):

- **→12:** Strict template check issues; migrate to `inlineStyleLanguage`; stop using `entryComponents`.
- **→13:** Ivy-only. **Replace the string `loadChildren` in `app-routing.module.ts` with `loadChildren: () => import('../invoicing/invoicing.module').then(m => m.InvoicingModule)`** (the commented-out line already exists). Remove `rxjs-compat` and fix all `rxjs/Observable`-style imports. Drop IE11 from `browserslist`.
- **→14:** Move `HttpClient` interceptors and guards that use class-based `CanActivate`/`CanLoad` fine for now; note them for Task 6. Typed reactive forms migration: run the schematic (`ng update` inserts `Untyped*` types); leave them for Task 5.
- **→15:** `relativeLinkResolution` option removed from `RouterModule.forRoot`. Remove it in `app-routing.module.ts`. Update `zone.js` to the version the hop requires.
- Also during these hops: bump `typescript`, `rxjs` (→7.8), `zone.js`, `tslib` as demanded by the peer ranges, never beyond them.

- [ ] **Final step:** Run the smoke checklist from Task 0. Expected: identical to baseline.

### Task 2: Framework hops 16 → latest, with the builder, lint and test-runner migrations

**Files:**
- Modify: `web/package.json`, `web/angular.json`, `web/tsconfig*.json`, `web/jest.config.js`, `web/src/setupJest.ts`, `web/src/main.ts`
- Create: `web/eslint.config.js` (flat config via `ng add angular-eslint`)
- Delete: `web/e2e/`, `web/tslint.json`, `web/src/tsconfig.server.json`, `web/src/main.server.ts`, `web/src/app/app.server.module.ts` (+ spec), `web/server/`

**Interfaces:**
- Consumes: Angular 15 app from Task 1.
- Produces: app on latest Angular, built with the `application` (esbuild/Vite) builder, ESLint, and a working unit-test setup.

- [ ] **Step 1:** Repeat the Task 1 cycle for hops 16, 17, 18, 19, 20, 21 and 22 (`ng update` core, cli, material, ngrx). Node floors rise along the way; the final hop needs the Node range in the Tech Stack line above.
- [ ] **Step 2 (→16):** Remove `hammerjs` (`import 'hammerjs'` in `main.ts`, the package, and any `HammerModule` use) unless a touch gesture really depends on it. Check the Material components used for gesture needs first.
- [ ] **Step 3 (→17):** Run the `use-application-builder` migration (`ng update @angular/cli --name use-application-builder`). **Decision:** the existing `@angular/platform-server` / Universal setup (`main.server.ts`, `server/server.ts`) is unused in hosting (`firebase.json` serves static `web/dist/invoi-6`), so delete it rather than migrate it. If SSR is wanted later, add it with `ng add @angular/ssr`.
- [ ] **Step 4 (→17/18):** Replace TSLint with ESLint: `ng add angular-eslint`, delete `tslint.json` files in `web/`, convert the few custom rules, and make `ng lint` pass.
- [ ] **Step 5 (→18):** Remove Protractor (`web/e2e/`, `e2e` architect target, devDependency). Keep Cypress and upgrade it to current (`cypress` 15.x or newer); fix `cypress.json` → `cypress.config.ts`.
- [ ] **Step 6 (→18/19):** Replace `@angular-builders/jest` and `jest-preset-angular` with the current compatible pair: Jest 30 + `jest-preset-angular` 15.x with `setup-jest`, or switch to Angular's built-in unit-test builder (Vitest). **Recommendation:** keep Jest to avoid rewriting 134 specs; revisit Vitest afterwards. Update `jest.config.js` (remove the deprecated `globals['ts-jest']` block and the `__TRANSFORM_HTML__` flag) and `jest-sonar-reporter` if still used.
- [ ] **Step 7 (→19+):** Run the schematics that Angular offers for removing deprecated APIs and keep the build warning-free (`ng build` output with 0 deprecation warnings).
- [ ] **Step 8 (→20/21):** Evaluate zoneless. **Decision gate:** keep `zone.js` for now. Zoneless is adopted in Task 8 once components are signal-based, and only if all third-party code (AngularFire, Material) is OK without it.
- [ ] **Step 9:** Run `npm run build`, `npm run lint`, `npx jest`, and the smoke checklist. Record the results; compare the Jest pass count to Task 0. Commit `chore: angular latest`.

### Task 3: Frontend dependencies (non-Angular)

**Files:**
- Modify: `web/package.json`

**Interfaces:**
- Produces: a `package.json` with no unused or deprecated packages and no `npm audit` high/critical findings.

- [ ] **Step 1:** Remove: `@angular/flex-layout` (replaced in Task 5), `rxjs-compat`, `hammerjs`, `core-js` (not needed with modern browserslist), `@bahmutov/add-typescript-to-cypress`, `protractor`, `codelyzer`, `rxjs-tslint`, `ngrx-store-freeze` (use `runtimeChecks` in `provideStore`), `ts-node`/`nodemon` (only used by the deleted server), `jasmine-*` and `jasmine-marbles` if specs run on Jest only.
- [ ] **Step 2:** Move `luxon` to 3.x and its types to the matching `@types/luxon`. Decide about `moment` + `@angular/material-moment-adapter`: **recommendation** is to move to `@angular/material-luxon-adapter` and drop `moment` in the web app (9 source files touch Moment or Luxon). Pin dates behavior with specs first (Task 7, Step 1).
- [ ] **Step 3:** Update `lodash`/`@types/lodash`, `tslib`, `@types/node` (to the Node major used), `@types/jest` (to 30).
- [ ] **Step 4:** `npm outdated` and `npm audit` must show no remaining major-behind packages other than the ones intentionally deferred. List deferrals in `ai/migration-log.md`.
- [ ] **Step 5:** Build, lint, test, commit `chore: update frontend dependencies`.

### Task 4: Standalone conversion

**Files:**
- Modify: all 12 `*.module.ts` and every component, directive and pipe in `web/src`
- Create: `web/src/app/app.config.ts`, `web/src/app/app.routes.ts`, and `invoicing.routes.ts`, `auth.routes.ts`, `admin.routes.ts`, `storage.routes.ts` in the matching folders
- Delete: each `*.module.ts` and `*-routing.module.ts` (with their specs) as its feature is converted

**Interfaces:**
- Produces: `export const appConfig: ApplicationConfig` in `web/src/app/app.config.ts` (providers: router, `provideHttpClient(withInterceptors([...]))`, `provideStore`, `provideEffects`, `provideRouterStore`, `provideStoreDevtools`, `provideServiceWorker`, Firebase providers, `LOCALE_ID` `de-DE`). Feature route files export `export const INVOICING_ROUTES: Routes` and so on, with feature state registered via `provideState(...)` and `provideEffects(...)` on the route's `providers`.

- [ ] **Step 1:** Run the three Angular schematics in order, committing after each: `ng generate @angular/core:standalone` with mode `convert-to-standalone`, then `prune-ng-modules`, then `standalone-bootstrap`. Run one feature folder at a time (`--path src/shared`, then `src/auth`, `src/admin`, `src/storage`, `src/invoicing`, `src/app`) and build between each.
- [ ] **Step 2:** `shared/` first: it is imported by every feature. Replace `MaterialModule` with a plain exported array of Material imports (`export const MATERIAL_IMPORTS = [...] as const`), used in each component's `imports`. No NgModule remains.
- [ ] **Step 3:** Convert the lazy route to `loadChildren: () => import('../invoicing/invoicing.routes').then(m => m.INVOICING_ROUTES)`, keeping `data: { roles: ['sales-user', 'auditor'] }`.
- [ ] **Step 4:** Rewrite `main.ts` to `bootstrapApplication(AppComponent, appConfig)`.
- [ ] **Step 5:** Fix the specs: replace `declarations: [...]` with `imports: [...]` in `TestBed` configs. Delete the spec files of removed modules (`*.module.spec.ts`, `*-routing.module.spec.ts`) after confirming they only asserted module creation.
- [ ] **Step 6:** `npm run build`, `npx jest`, smoke checklist. Expected: same Jest pass count minus the deleted module specs. Commit per feature folder.

### Task 5: Signal-style components and modern template syntax

**Files:**
- Modify: 23 files using `@Input`/`@Output`/`@ViewChild`; 48 templates; the 12 templates using flex-layout; constructor-injected classes everywhere.

**Interfaces:**
- Produces: components that use `input()`, `input.required()`, `model()`, `output()`, `viewChild()`, `viewChildren()`, `inject()`, `computed()`, `effect()` and `ChangeDetectionStrategy.OnPush`. Templates use `@if`, `@for (x of xs; track x.id)`, `@switch`, `@defer`.

Use Angular's official migrations, then fix by hand. Each is one commit with a green build.

- [ ] **Step 1:** `ng generate @angular/core:control-flow` (replaces the 186 structural-directive usages). Review every `@for`: **each needs a meaningful `track` expression**, using the entity `id` rather than `$index` wherever lists are editable (invoice items, document links).
- [ ] **Step 2:** `ng generate @angular/core:inject` to move constructor injection to `inject()`.
- [ ] **Step 3:** `ng generate @angular/core:signal-input-migration`, then `:output-migration`, then `:signal-queries-migration`. Accept only the safe conversions the tool offers. List the skipped ones in `ai/migration-log.md` and convert them manually. Typical skips are inputs written from TypeScript, or abstract classes in `invoicing/abstracts/` (`master-list`, `details-form`, `details-items-form`, which rely on inheritance).
- [ ] **Step 4:** Rework the abstract base components in `web/src/invoicing/abstracts/` so shared behavior lives in composable functions or services (`injectDetailsForm(...)`) rather than inheritance, if the signal migration can't convert them. Keep their public template contract unchanged.
- [ ] **Step 5:** Replace `@angular/flex-layout` directives (`fxLayout`, `fxFlex`, `fxLayoutGap`, `fxHide`) in the 12 templates with CSS flexbox classes defined in `web/src/styles.scss`/`sass/`. Compare screenshots at three widths (mobile, tablet, desktop) before and after. Remove the package.
- [ ] **Step 6:** Convert reactive forms from the `Untyped*` types the Task 1 schematic left to typed `FormGroup<...>`/`FormControl<...>`. Do this form by form, starting with the simplest (`texts-form`, `receiver-form`) and ending with `invoice-form`.
- [ ] **Step 7:** Add `changeDetection: ChangeDetectionStrategy.OnPush` to every component. Fix any template that relied on mutation. Use `async` pipe replacements with `toSignal()` where a component still subscribes to observables.
- [ ] **Step 8:** `npm run build`, `npm run lint`, `npx jest`, smoke checklist. Commit per step.

### Task 6: Functional guards and interceptors, and signal-based state

**Files:**
- Modify: `web/src/auth/guards/*.ts` (authentication, authorization, users, plus the invoicing and admin guards: 33 files match "guard"), `web/src/auth/interceptors/auth.interceptor.ts`, components that use `store.select(...)`.
- Test: `web/src/auth/guards/*.spec.ts`

**Interfaces:**
- Produces: functional guards `export const authenticationGuard: CanActivateFn`, `export const authorizationGuard: CanActivateFn` (reads `route.data['roles']`), and `export const authInterceptor: HttpInterceptorFn` (adds the Firebase ID token). Components read state via `this.store.selectSignal(selector)`.

- [ ] **Step 1: Write failing tests (Review Focus 1).** For `authorizationGuard`: a user with role `sales-user` is allowed on a route with `roles: ['sales-user', 'auditor']`; a user with only role `sys-admin` is redirected to `/home`; an unauthenticated user is redirected to the login route. Run them against the *current* class guards first to capture today's behavior.
- [ ] **Step 2:** Convert class-based `CanActivate`/`CanLoad`/`Resolve` guards to functional guards using `inject()`. Keep the guard tests green throughout.
- [ ] **Step 3:** Convert `AuthInterceptor` to `HttpInterceptorFn`, registered with `provideHttpClient(withInterceptors([authInterceptor]))` in `app.config.ts`. Test: the Authorization header has `Bearer <token>` for calls to `/invoicing/...` and is not added to third-party URLs.
- [ ] **Step 4:** Add `selectSignal` use in components in place of `store.select(...)` + `async` pipe, feature by feature, starting with `app/` and `auth/`. NgRx stays the source of truth.
- [ ] **Step 5 (optional, separate PR):** For small leaf stores (UI state in `app/store`), evaluate replacing reducer/action/effect boilerplate with `signalStore` from `@ngrx/signals`. **Decision gate:** only if the gain is clear. Do not rewrite the 27 effect files in this migration.
- [ ] **Step 6:** Build, lint, test, smoke checklist. Commit.

### Task 7: Firebase client migration (Firebase 8 → modular, AngularFire 6 → current)

**Files:**
- Modify: `web/src/auth/services/auth.service.ts`, `users.service.ts`, `web/src/invoicing/services/*.ts`, `web/src/storage/services/*.ts`, `web/src/admin/services/*.ts`, `app.config.ts`, `web/src/environments/*` (see note), and the matching specs.

**Interfaces:**
- Consumes: `app.config.ts` from Task 4.
- Produces: services built on `inject(Firestore)`, `inject(Auth)`, `inject(Storage)` with the modular functions (`collectionData`, `docData`, `setDoc`, `onAuthStateChanged`, `ref`, `uploadBytesResumable`), exposed through the same public method names and return types as today, so the NgRx effects don't change.

AngularFire 6 + Firebase 8 are one major apart from modular AngularFire 7+. Do this in two moves, verifying each one.

- [ ] **Step 1: Write the pinning tests first (Review Focus 4).** For each service, a spec asserting the date and `Timestamp` mapping: a document with a Firestore `Timestamp` field maps to a `Date`/domain value, and the reverse for writes. Today's behavior is the expectation.
- [ ] **Step 2:** Intermediate: if the app is still on Firebase 8 after Task 2, upgrade `firebase` to 9.x using the `compat` imports (`firebase/compat/app`) and `@angular/fire/compat`. Build and test. This isolates SDK breakage from API rewriting.
- [ ] **Step 3:** Rewrite services to the modular API one service at a time, with `provideFirebaseApp(() => initializeApp(environment.firebase))`, `provideAuth(() => getAuth())`, `provideFirestore(() => getFirestore())`, `provideStorage(() => getStorage())` in `app.config.ts`. Remove `compat`.
- [ ] **Step 4:** Update the package pair to current: `firebase` 13.x and `@angular/fire` 21.x (or the newest version whose peer range includes the installed Angular; **if none supports Angular 22 yet, stop and decide:** hold Angular on 21 or call the Firebase SDK directly with a thin `inject()`-based wrapper).
- [ ] **Step 5:** Verify against the Firestore/Auth/Storage emulators (`firebase emulators:start`), then the dev project, using the smoke checklist plus an upload and download of a document.
- [ ] **Step 6:** Note on environments: the `environment*.ts` files were deleted from git ("secrets" commits). Document in `README.md` how to recreate them (`web/src/environments/environment.ts` exporting `environment.firebase` and `production`) and make `angular.json` `fileReplacements` consistent with that.
- [ ] **Step 7:** Commit per service group.

### Task 8: Zoneless change detection (optional, decision gate)

**Files:**
- Modify: `web/src/app/app.config.ts`, `web/angular.json` (`polyfills`), `web/src/setupJest.ts`

**Interfaces:**
- Consumes: OnPush, signal-based components from Tasks 5–6 and modular Firebase from Task 7.

- [ ] **Step 1:** Add `provideZonelessChangeDetection()` and remove `zone.js` from `polyfills` in a throwaway branch. Run the app and smoke checklist.
- [ ] **Step 2:** Fix any screen that stops updating: it still mutates state outside a signal or `markForCheck`. Use `signal` for the state or `ChangeDetectorRef.markForCheck()` (via `toSignal`/`async` pipe) as appropriate.
- [ ] **Step 3:** Update `setupJest.ts` to the zoneless test setup (`provideZonelessChangeDetection()` in `TestBed` defaults) and run the full suite.
- [ ] **Step 4:** If any third-party library blocks zoneless, abandon this task and keep `zone.js`. Record that in `ai/migration-log.md`. Otherwise commit.

### Task 9: Internationalization and PWA check

**Files:**
- Modify: `web/angular.json` (i18n, `serviceWorker`), `web/ngsw-config.json`, `web/src/manifest.json`

- [ ] **Step 1:** `ng build --localize` (or the configured `de-DE`) must still produce a German build. Fix `$localize` polyfill imports (`@angular/localize/init`) after the standalone migration.
- [ ] **Step 2:** Verify that `provideServiceWorker('ngsw-worker.js', { enabled: !isDevMode(), registrationStrategy: 'registerWhenStable:30000' })` replaces the module registration, and that `ngsw-config.json` still lists the correct asset groups for the application builder output (`browser/` folder).
- [ ] **Step 3:** Update `firebase.json` hosting `public` to the new output path (application builder writes to `dist/<project>/browser`), and confirm the SPA rewrite still works.
- [ ] **Step 4:** Check Review Focus 5 on the dev hosting site: deploy the old build, load it, deploy the new build, reload twice, confirm the new version loads and the update prompt (if any) fires.
- [ ] **Step 5:** Commit.

### Task 10: Shared package and batches

**Files:**
- Modify: `shared/package.json`, `shared/tsconfig.json`, `shared/src/functions/*.ts`, `batches/package.json`, `batches/tsconfig.json`, `batches/src/*.ts`

**Interfaces:**
- Produces: `shared` compiled with TypeScript 5.x against `firebase-admin` 14.x, importable from `functions` and `batches` using the existing exports (`getRevenues`, `setRevenues`, `getReceiver`, …) with unchanged signatures.

- [ ] **Step 1:** Align `firebase-admin` to the same major in `shared`, `functions` and `batches` (14.x). Run `npm install` in each.
- [ ] **Step 2:** Remove the client `firebase` 7 dependency from `batches` if it is unused (the code uses `firebase-admin` only); if it is used, replace with admin calls.
- [ ] **Step 3:** Upgrade `typescript` to 5.x, `@types/node` to the target Node major, `commander` to the current major (its `args.parse().opts()` pattern changed after v6: replace direct property reads like `args.test` with `args.opts().test`).
- [ ] **Step 4:** Add a dry-run check: `node dist/batches/src/index.js -t true` against the dev project, which must write nothing and print the locked-down year.
- [ ] **Step 5:** Commit.

### Task 11: `jovisco-domain` compatibility

**Files:**
- Modify: `web/package.json`, `functions/package.json`, `batches/package.json`; the `jovisco-domain` repository itself (separate repo)

- [ ] **Step 1:** Check `jovisco-domain`'s `package.json` for its TypeScript target, module format (CJS vs ESM), and Node/TS peer ranges. The npm latest is 1.0.70, the same version already used.
- [ ] **Step 2:** Confirm it imports cleanly in the new application builder (esbuild handles ESM; a CJS-only package may print "CommonJS dependency" warnings: add it to `allowedCommonJsDependencies` or publish a dual build).
- [ ] **Step 3:** If it needs changes (TS 5, dual ESM/CJS, `moment` → `luxon`), release it as 1.1.0 from its own repo, then bump it in all three consumers in one commit.
- [ ] **Step 4:** Build and test all consumers. Commit.

### Task 12: Cloud Functions upgrade

**Files:**
- Modify: `functions/package.json`, `functions/tsconfig.json`, `functions/src/*.ts`, `functions/src/printforms/*.ts`, `firebase.json` (runtime), `functions/src/utilities/i18n-utilities.ts`

**Interfaces:**
- Produces: functions on a currently supported Node runtime (22 or newer, per the Firebase runtime list; check `firebase-tools` support), exporting the same names: `invoicing`, `users`, `onCreateReceiver`, `onDeleteReceiver`, `onCreateContract`, `onDeleteContract`, `onCreateInvoice`, `onDeleteInvoice`, `onUpdateInvoice`, `onCreateUserProfile`, `onDeleteUserProfile`, `onUpdateUserProfile`, `onDeleteDocumentLink`, `onDeleteDocument`, `onFinalizedDocument`, `onMetadataUpdate`.

Node 18 is end-of-life, so this task is time-sensitive and independent of the Angular work. It can run in parallel.

- [ ] **Step 1: Write emulator-based tests (Review Focus 2 and 3).** Using the Firestore emulator and `firebase-functions-test` (add as devDependency): creating an `invoices/{id}` document increments the `invoices` number range; deleting it resets it; updating an invoice with a changed status updates `revenues`/`open-invoices`. A request to `POST /invoice-pdf/:id` with a valid token for a seeded invoice returns `200` with `content-type: application/pdf` and a body that starts with `%PDF`; the formatted amount for `1234.5` is `1.234,50` (German formatting).
- [ ] **Step 2:** Run the new tests on the *current* code and fix the tests until they pass. They define today's behavior.
- [ ] **Step 3:** Upgrade: `firebase-functions` 5 → 7, `firebase-admin` 12 → 14, `typescript` → 5.x, `@types/node` → 22, `pdfkit` → current (check the 0.11→0.1x changes in font loading and `Buffer` handling), `sharp` → current, `@sendgrid/mail` → current, `express` 4 → 5 (the `app.route('/:id')` path pattern syntax changed in Express 5; re-verify routes, or stay on 4.x if not needed), `cors`, `lodash`, `moment`, `full-icu`/`intl`/`intl-locales-supported` (Node 22 ships full ICU, so `setupI18n` can probably be reduced to nothing; verify the German test from Step 1).
- [ ] **Step 4:** `firebase-functions` v7 keeps the v1 API under `firebase-functions/v1`. Change imports in `functions/src/index.ts`, `update-functions.ts`, `storage-functions.ts` accordingly (`import * as functions from 'firebase-functions/v1'`; `import { DocumentSnapshot } from 'firebase-functions/v1/firestore'` already used). Do **not** rewrite triggers to v2 in this migration.
- [ ] **Step 5:** Set `"runtime": "nodejs22"` in `firebase.json` and `"engines": { "node": "22" }` in `functions/package.json`. Remove the `../../shared/src` TS path hack if `shared` is now built and consumed as a package (otherwise leave as is).
- [ ] **Step 6:** Run the emulator tests again. Deploy to the dev project (`firebase deploy --only functions -P dev`) and run the smoke checklist including PDF and email.
- [ ] **Step 7:** Commit.

### Task 13: Hosting, CI and final verification

**Files:**
- Modify: `firebase.json`, `README.md`, `ai/project-description.md`
- Delete: `firebase-old.json`

- [ ] **Step 1:** Replace the stock Angular CLI `README.md` with real setup, build, test and deploy instructions for the new versions (Node version, `npm ci`, emulator usage, environment files, deploy commands).
- [ ] **Step 2:** `npm run build && npm run lint && npx jest` in `web/`, and `npm run build` in `functions/`, `shared/`, `batches/`. Everything must pass.
- [ ] **Step 3:** `npm outdated` in all four packages. Expected: only deliberately deferred items remain, and each one is listed with a reason.
- [ ] **Step 4:** `npm audit --omit=dev` in all four packages. Expected: no high or critical vulnerabilities.
- [ ] **Step 5:** Run the full smoke checklist on the dev project, then on prod after sign-off. Deploy prod hosting and functions separately so that either can be rolled back alone (`firebase hosting:rollback`).
- [ ] **Step 6:** Update `ai/project-description.md` to the new versions, and commit `docs: update after migration`.

---

## Order and Parallelism

1. Task 0 → Task 1 → Task 2 → Task 3 (strictly sequential, framework hops).
2. Task 4 → Task 5 → Task 6 → Task 7 (sequential; each depends on the previous one's structure).
3. Task 8 and 9 follow Task 7.
4. Tasks 10, 11 and 12 are independent of the web work; Task 12 should start first because Node 18 is out of support. Run Task 11 before the consumers bump the package.
5. Task 13 last.

## Risks and Decision Points

| Risk | Mitigation |
|---|---|
| 11 consecutive major hops (11→22) | One hop per commit, log results, tag known-good commits (`ng-12-ok`, …) |
| `@angular/fire` lagging behind Angular | Check peer ranges before Task 2's last hop; decide hold-or-wrap at Task 7 Step 4 |
| Abstract component inheritance (`invoicing/abstracts`) resists signal migration | Task 5 Step 4 refactor; keep template contract unchanged |
| Jest ecosystem lag | Keep Jest first; Vitest builder is the fallback |
| `jovisco-domain` is an external package that gates all consumers | Task 11 early check; release a compatible version first |
| No existing e2e safety net beyond Cypress 5 specs | Smoke checklist from Task 0 is run after every task; rewrite or retire the Cypress specs in Task 2 Step 5 |
| Node 18 functions runtime out of support | Task 12 first, independent of the Angular work |
| Pinned versions drift while the migration runs | Re-run the `npm view` checks at the start of Task 2 and Task 12, and update the Tech Stack line |

## Self-Review Notes

- Spec coverage: latest Angular (Tasks 1–2), signal-based (Tasks 4–6, 8), all dependencies (Tasks 3, 7, 10–12), plan stored in `ai/`.
- Open facts to confirm when executing: exact TypeScript version required by Angular 22; whether `@angular/fire` 21.x supports Angular 22; Express 5 route syntax impact; whether the `jovisco-domain` source repo is available to edit.
