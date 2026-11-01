# Engineering Rules and Contribution Standards

## Virasat Atlas

These rules apply to all contributors and coding assistants. Security, provenance and a working end-to-end flow take priority over code volume.

---

## 1. Non-negotiable technology rules

- Core stack is React.js + PHP 8.2+ + MySQL 8+.
- Do not introduce Python, a Node.js API server or a second database into the MVP.
- React communicates with PHP through `/api/v1`; never connect from the browser directly to MySQL.
- Use PDO for database access and parameterised queries for all user-supplied values.
- Use a versioned SQL schema/migration approach.
- Keep map and OCR libraries as optional frontend capabilities; neither should own canonical data.

## 2. Code organisation

### Frontend

- Use feature-oriented folders (`features/archive`, `features/search`, etc.).
- Components should be reusable and focused; keep page orchestration in route-level components.
- Put HTTP logic in `src/api`; do not scatter raw `fetch()` calls through the UI.
- Keep API response types and normalisation in one place.
- Use controlled forms with clear validation messages.
- Avoid global state for data that can remain local to a feature; centralise authenticated user/session state.

### Backend

- Keep routes/controllers thin.
- Validate input before calling services.
- Put business rules in services and SQL in repositories.
- Use transactions when creating an archive record with related metadata or collection membership.
- Return consistent JSON with appropriate HTTP status codes.
- Do not expose stack traces, SQL errors, filesystem paths or secrets to clients.

## 3. API rules

- Prefix every application endpoint with `/api/v1`.
- Use plural resource names and predictable HTTP verbs.
- Validate pagination and cap `per_page` (recommended maximum 50).
- Allowlist sort fields and directions; never concatenate arbitrary user input into `ORDER BY`.
- Use `401` for unauthenticated requests, `403` for forbidden operations, `404` for unavailable resources and `422` for validation errors where appropriate.
- Public endpoints return only published/public records.
- Return field-level validation details without leaking internal diagnostics.

## 4. Database rules

- Use InnoDB and explicit foreign keys.
- Add indexes for foreign keys, status/visibility filters and frequently filtered fields.
- Use `utf8mb4` and an appropriate collation.
- Store UTC timestamps; format for the user's locale in the UI.
- Store file metadata and storage keys, not large binary files in MySQL.
- Keep raw OCR text and reviewed transcript separate.
- Do not silently cascade-delete source records or audit history.
- Do not use a text field to pack multiple tags or locations; model relationships with tables.

## 5. Security rules

- Hash passwords with `password_hash()` and verify using `password_verify()`.
- Use secure, HttpOnly, SameSite cookies for session auth; require HTTPS in production.
- Protect state-changing cookie-authenticated requests with CSRF tokens.
- Use an explicit CORS allowlist if cross-origin requests are unavoidable.
- Use PDO prepared statements.
- Enforce role and ownership checks on the server for every protected operation.
- Validate upload size, extension, MIME type and file signature where practical; use random storage names.
- Store uploads outside the public web root; deny execution and direct listing.
- Escape output and do not treat user-submitted HTML as trusted.
- Never commit credentials, tokens, private documents or user personal data.

## 6. Heritage data quality and ethics

- Record provenance and source for every public record.
- Record rights/permission status and attribution text.
- When permission is unknown, do not publish the material publicly.
- Distinguish factual source claims, interpretation and hypothesis in descriptions.
- Do not infer missing coordinates, dates, authors or historical periods.
- Mark approximate locations and uncertain dates explicitly.
- Do not publish sensitive site information that could enable damage, theft or unauthorised access; restrict such records.
- Respect community knowledge, attribution preferences and requests for restricted access.
- Machine OCR output is unverified until checked by a person.
- Never present generated images as archival evidence.

## 7. UX and accessibility rules

- All fields have labels; placeholders are not labels.
- All key flows work with keyboard navigation.
- Every image with meaning has useful alt text.
- Map content has an equivalent list view.
- Status indicators include text/icon, not colour alone.
- Provide loading, empty, success and error states.
- Destructive actions require confirmation.
- Preserve user-entered form data after recoverable errors.

## 8. Git and delivery rules

- Use short descriptive commit messages, for example `feat(archive): add draft submission`.
- Commit coherent working changes; do not squash away required hackathon-window commit history if the event requires commits during that window.
- Do not commit `node_modules`, build output, `.env`, logs, private uploads or database dumps containing personal data.
- Keep README setup steps aligned with the actual code.
- Every change to schema must update migrations and the reproducible schema file.
- Test the main user journey after changes to auth, uploads, visibility or review.

## 9. Definition of done

A task is done only when:

1. The expected user journey works end-to-end.
2. Backend validation and permissions are in place.
3. Data persists correctly and relationships are consistent.
4. Error and empty states are understandable.
5. No secrets or private data are committed.
6. Relevant tests/manual checks pass.
7. Documentation is updated when setup, schema or behaviour changes.

## 10. Things not to do

- Do not fake OCR confidence, search relevance or platform statistics.
- Do not claim an item is historically verified solely because it is published.
- Do not add 3D or AI features before the P0 archive flow works.
- Do not rely only on React route guards for permissions.
- Do not allow a user-supplied file path or filename to control storage location.
- Do not expose private media with guessable URLs.
