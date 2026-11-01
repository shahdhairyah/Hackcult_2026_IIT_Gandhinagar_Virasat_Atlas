# Project Memory - Virasat Atlas

This file is the durable project context for the team and any coding assistant. Read it before changing architecture or scope.

## 1. Product identity

- **Project name:** Virasat Atlas
- **Tagline:** Find the story behind the archive - by subject, place, time and source.
- **Challenge:** HC26-CULT01 - Digital Revitalisation of Unstructured Cultural & Architectural Heritage Archives.
- **Event:** Blithchron '27, IIT Gandhinagar.
- **Category:** Software (Open Innovation), Culture & Digital Heritage.
- **Submission deadline from the supplied brief:** 4 November 2026, 6:30 PM IST.

## 2. Problem being solved

Cultural/architectural records are scattered across photos, scanned documents, field notes, travel journals and presentation decks. The product makes records structured, searchable, location-aware and curated. Preserve provenance, rights and review status; this is not just a gallery or map.

## 3. Locked technology constraints

- Frontend: React.js + Vite.
- Backend: PHP 8.2+ REST API.
- Database: MySQL 8+ / InnoDB.
- Database access: PHP PDO with prepared statements.
- Mapping: Leaflet + OpenStreetMap.
- Core solution must not depend on a separate Python or Node backend.
- Optional JS OCR or external OCR adapter may be used, but OCR is an enhancement and must be reviewed by a human.

## 4. MVP product flow

`Researcher login -> create archive item -> upload media -> add metadata/location/source/rights -> submit -> reviewer approves -> public search -> item detail -> map discovery -> curated collection`.

## 5. Scope priorities

### P0 - build first

- Authentication and server-side role checks.
- Archive item create/read/update for allowed roles.
- Secure file upload and media association.
- Metadata, source, rights and attribution.
- Review queue and approve/reject flow.
- Public catalogue, MySQL FULLTEXT search and filters.
- Item detail, map view and curated collections.

### P1 - only after P0 works

- OCR assistance with raw/reviewed transcript separation.
- Audit log UI, related records, thumbnail pipeline.

### P2 - roadmap only

- Vector semantic search, multilingual translation workflow, automatic 3D reconstruction, public crowdsourcing, native app.

## 6. Data and integrity rules

- Public discovery may return only `status='published' AND visibility='public'` records.
- `draft`, `pending_review`, `rejected`, `archived` are not public.
- Store binary files outside the public web root; DB stores storage key and metadata.
- Keep original filename as display metadata only; generate server-side storage names.
- Preserve raw OCR separately from a reviewed transcript.
- Never invent coordinates, dates, source names, historical claims or rights.
- Every meaningful item must show source and rights/attribution status.
- Distinguish capture date from historical period.

## 7. Roles

- `visitor`: read public records.
- `researcher`: create and edit own drafts; submit for review.
- `reviewer`: review submissions and curate collections.
- `admin`: manage users, roles, taxonomy and configuration.

Backend authorization is authoritative. Client route guards are only a UX layer.

## 8. Architecture boundaries

- React uses the API; React never queries MySQL.
- PHP owns validation, business rules, authorization and media handling.
- MySQL owns structured records, relationships, FULLTEXT search and audit metadata.
- Search, map and collections use the same archive item identity.
- Keep controllers thin; use services and PDO repositories.
- API prefix: `/api/v1`.

## 9. Design constraints

- Editorial heritage aesthetic: charcoal, warm paper, sandstone/bronze accents.
- Avoid green/pink as primary brand colours.
- Accessible contrast and keyboard operation are mandatory.
- Documentary images must be authentic and rights-cleared; do not use generated visuals as evidence.
- Use real seed data or clearly labelled demo records; do not invent platform statistics.

## 10. Repository conventions

Suggested layout:

```text
client/                 # React application
api/                    # PHP REST API
  index.php
  router.php
  src/{Config,Middleware,Controllers,Services,Repositories,Validators}
  storage/               # private uploads, excluded from public web root
database/schema.sql
docs/                    # report and supporting documentation
README.md
prd.md architecture.md design.md memory.md phase.md rules.md tasks.md
```

- Use lower-kebab-case filenames for docs; keep the requested filenames exactly as provided.
- Use UTF-8; prefer clear names and small focused modules.
- Never commit `.env`, credentials, private uploads, user data or API secrets.
- Commit schema changes as migrations and update `database/schema.sql` when appropriate.

## 11. Commands and environment (baseline)

Frontend:

```bash
cd client
npm install
npm run dev
npm run build
```

Backend local development (PHP REST API; folder name `api/`):

```bash
cd api
php -S 127.0.0.1:8000 router.php
```

Database: create a local MySQL database, import `database/schema.sql`, and configure server environment variables. Use PHP 8.2+, MySQL 8+, Node 20+.

## 12. Definition of done

A feature is not complete because its screen exists. The core action must work end-to-end, be permission-checked on the server, handle errors, persist correctly, and be testable from the README. Update this file when a locked decision changes; explain why and keep all project documents aligned.
