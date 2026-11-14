# 03 Security

Source: `db-rules.txt`, `storage-rules.txt` (rules as deployed per the repo), `auth-functions.ts`, `authorization.guard.ts`, `auth.service.ts`.

## Firestore rules

Helper semantics:
- `getUserRoles()` = `get(/user-profiles/{request.auth.uid}).data.roles`; `hasRole(r)` = roles contains `r`. **Roles are read from the profile document, not from custom claims.** A user without a profile document is denied (the `get` fails).
- `isOwner(uid)` = `request.auth.uid == uid`; `isSignedIn()` = authenticated.
- `canDeleteReceiver(id)` = existing `receivers/{id}.isDeletable`; `canDeleteContract(id)` = `contracts/{id}.isDeletable`; `canDeleteInvoice(id)` = `invoices/{id}.status == 0`.

| Collection | read | create | update | delete |
|---|---|---|---|---|
| `user-profiles/{uid}` | `sys-admin` or owner | `sys-admin` | `sys-admin` or owner | `sys-admin` |
| `settings/{id}` | `sales-user` | `sys-admin` | `sys-admin` | `sys-admin` |
| `number-ranges/{id}` | signed in | `sys-admin` | `sales-user` | `sys-admin` |
| `revenues/{id}` | `sales-user` | `sys-admin` | `sys-admin` | `sys-admin` |
| `open-invoices/{id}` | `sales-user` | `sys-admin` | `sys-admin` | `sys-admin` |
| `receivers/{id}` | `sales-user` | `sales-user` | `sales-user` | `sales-user` and `isDeletable` |
| `contracts/{id}` | `sales-user` | `sales-user` | `sales-user` | `sales-user` and `isDeletable` |
| `invoices/{id}` | `sales-user` | `sales-user` | `sales-user` | `sales-user` and `status == 0` |
| `document-links/{id}` | `sales-user` | `sales-user` | `sales-user` | `sales-user` |

Observations:
- A user who has only the role `auditor` can **not** read `receivers`, `contracts`, `invoices`, `settings`, `revenues` (they need `sales-user`). The UI route data allows `['sales-user', 'auditor']`, so auditors see empty/failed screens. (07, question A1.)
- `sys-admin` alone cannot read `settings`, `invoices` and so on unless the profile also has `sales-user`.
- The client toggles `isDeletable` itself (the field is a plain document field written by the client, not computed server-side). The rule only enforces what the document says.
- Server code (Admin SDK) bypasses all rules.
- The UI logic for "deletable" differs from the rules: the invoice screen uses `selectInvoiceChangeable` (status != paid) for both "changeable" and "deletable", the rule allows delete only for `status == 0` (07, A2).

## Storage rules

| Path | read | write |
|---|---|---|
| `assets/**` | signed in | signed in and `token.isAdmin` |
| `docs/**` | signed in and `token.isSales` | signed in and `token.isSales` |
| `images/users/**` | signed in | signed in and `token.isAdmin` |
| `images/users/{uid}` (object named exactly `{uid}`) | signed in | `isAdmin` or owner |

Claims `isAdmin` and `isSales` come from `updateAuth` in `update-functions.ts` (see 04). Note the path `images/users/{uid}/...` (a folder per user, files within) only matches the first `images/users/{allPaths=**}` rule, so **owners cannot upload their own profile image** unless they are admin; the second rule matches only an object named exactly `{uid}`. (07, A3.)

## Application-level authorization

- `AuthenticationGuard` — requires an authenticated Firebase user.
- `AuthorizationGuard` — reads `route.data['roles']` and computes `_.intersection(allowedRoles, auth.roles).length >= 0`. **That expression is always true, so the guard never blocks anyone who is authenticated.** Real enforcement is the sidebar visibility directive plus the Firestore rules. (07, A4; pinned by a test of current behavior and by a decision.)
- `UsersGuard` — loads the users list for `/auth/users`.
- `validateFirebaseIdToken` (Express middleware in functions) — requires `Authorization: Bearer <ID token>` or a `__session` cookie; verifies with Admin SDK; sets `req.user`; otherwise `403 Unauthorized`. **It does not check roles**, so any signed-in user can call `POST /users/new` and `POST /users/:id`, which create or update any Auth user (including passwords). (07, A5; severe.)

## Tests to write (rules)

Use `@firebase/rules-unit-testing` with the emulator; the table above is the oracle. Cases (each is both allow and deny where applicable):
1. For each collection × operation × role in {no auth, no profile, `auditor`, `sales-user`, `sys-admin`, `sys-admin+sales-user`} assert the table.
2. Delete receiver/contract with `isDeletable` true/false; delete invoice with `status` 0/1/2.
3. Profile read/update by owner vs. another user.
4. Storage: each path × claim combination, including `images/users/{uid}/file.png` and `images/users/{uid}`.
5. Document the always-true authorization guard as a characterization test (current behavior), then follow the decision in 07.
