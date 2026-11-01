# Implementation Task Backlog

## Virasat Atlas - React + PHP + MySQL

**Priority:** P0 = MVP blocker; P1 = add after the core journey works; P2 = advanced innovation / hackathon showcase.  
**Status key:** `[ ]` Not started, `[~]` In progress, `[x]` Done.

---

## Epic 0 - Repository and local environment (Phase 0)

- [x] **P0** Create repository structure and conventions.
- [x] **P0** Create `client/` React + Vite app.
- [x] **P0** Create `api/` PHP API with `index.php` and `router.php` entry points.
- [x] **P0** Create MySQL database and import `database/schema.sql`.
- [x] **P0** Add `.env.example` and document required environment variables.
- [x] **P0** Add `/api/v1/health` readiness endpoint without leaking configuration.
- [x] **P0** Add README setup, run and troubleshooting instructions.
- [x] **P1** Add automated formatting/lint scripts and end-to-end integration test runner (`scripts/test-all.sh`).

## Epic 1 - Database and domain model (Phase 0)

- [x] **P0** Create users and roles model (`visitor`, `researcher`, `reviewer`, `admin`).
- [x] **P0** Create locations model with optional coordinates.
- [x] **P0** Create archive items model with status and visibility.
- [x] **P0** Create media assets model and item relationship.
- [x] **P0** Create tags and archive-item-tag mapping.
- [x] **P0** Create collections and ordered collection-item mapping.
- [x] **P0** Add indexes for public catalogue, filters and FULLTEXT search.
- [x] **P1** Create OCR jobs table with raw/reviewed output separation.
- [x] **P1** Create audit log table and service.
- [x] **P2** Create saved items / bookmarks table for researcher library.
- [x] **P0** Seed cleared sample records, locations, tags, users and collections (`database/seed.php`).

## Epic 2 - Authentication and permissions (Phase 1)

- [x] **P0** Implement login endpoint with `password_verify()`.
- [x] **P0** Implement logout and current-user endpoint.
- [x] **P0** Configure secure session cookies and Bearer token fallback.
- [x] **P0** Implement auth middleware (`AuthMiddleware`).
- [x] **P0** Implement role middleware for researcher, reviewer and admin (`RoleMiddleware`).
- [x] **P0** Enforce ownership checks for draft edits and media removal.
- [x] **P0** Test that anonymous users cannot read drafts/private records.

## Epic 3 - Archive contribution and media (Phase 1)

- [x] **P0** Build archive item create endpoint (`POST /archive-items`).
- [x] **P0** Build archive item update endpoint with ownership checks (`PATCH /archive-items/{id}`).
- [x] **P0** Validate title, type, summary, language, date, place and rights fields (`ArchiveItemValidator`).
- [x] **P0** Build multipart media upload endpoint (`POST /archive-items/{id}/media`).
- [x] **P0** Configure PHP and web-server upload size limits.
- [x] **P0** Validate MIME with `finfo`, extension, file size and generated storage filename.
- [x] **P0** Store original media outside public web root (`api/storage/uploads/`).
- [x] **P0** Save checksum (SHA-256), original filename, MIME, size and alt text.
- [x] **P0** Build React contribution form with clear sections (`ContributePage.jsx`).
- [x] **P0** Add upload progress, recoverable errors and preview.
- [x] **P0** Implement save draft and submit for review.

## Epic 4 - Review and publication (Phase 2)

- [x] **P0** Build review queue endpoint and page (`ReviewQueuePage.jsx`).
- [x] **P0** Build record review detail screen and modal.
- [x] **P0** Implement approve action (`POST /archive-items/{id}/review`).
- [x] **P0** Implement reject/return-for-correction action with required reason.
- [x] **P0** Validate rights and attribution before public approval.
- [x] **P0** Record reviewer, decision and timestamp in `reviewed_by` and audit log.
- [x] **P0** Ensure only published/public records appear in anonymous catalogue/search/map.
- [x] **P1** Show reviewer feedback in researcher workspace (`WorkspacePage.jsx`).

## Epic 5 - Search and archive discovery (Phase 2)

- [x] **P0** Build paginated public catalogue endpoint (`GET /archive-items`).
- [x] **P0** Add MySQL FULLTEXT search on title, summary, description and reviewed transcript.
- [x] **P0** Add filters for type, tag, region, language and period where available.
- [x] **P0** Add allowlisted sort options and maximum page size.
- [x] **P0** Build Explore page and archive cards (`ArchiveListPage.jsx`).
- [x] **P0** Build archive detail endpoint and page (`ArchiveDetailPage.jsx`).
- [x] **P0** Show source, creator, rights, attribution and review information.
- [x] **P0** Add empty, loading and API error states (`EmptyState`, `ErrorState`).
- [x] **P1** Add related items recommendation based on shared location/tags (`findRelated`).

## Epic 6 - Geospatial discovery (Phase 2)

- [x] **P0** Build endpoint for public geotagged records/locations (`GET /locations`).
- [x] **P0** Integrate Leaflet and OpenStreetMap tile attribution (`MapExplorer.jsx`).
- [x] **P0** Show item markers and selected-item preview card.
- [x] **P0** Synchronise map marker selection with accessible result list.
- [x] **P0** Add list fallback if map tiles fail to load.
- [x] **P1** Add location summary and approximate-coordinate label.

## Epic 7 - Collections (Phase 2)

- [x] **P0** Build public collection list/detail endpoints (`GET /collections`, `GET /collections/{id}`).
- [x] **P0** Build collection page and ordered record list (`CollectionsPage.jsx`).
- [x] **P0** Allow reviewer/admin to create and edit collection metadata (`POST /collections`).
- [x] **P0** Allow reviewer/admin to curate ordered collection items.

## Epic 8 - OCR and transcription (Phase 3)

- [x] **P1** Select a supported language and tested OCR paleographic workflow.
- [x] **P1** Add OCR job creation and status handling (`POST /archive-items/{id}/ocr-jobs`).
- [x] **P1** Save raw extraction separately from reviewed transcript.
- [x] **P1** Build side-by-side source/transcript review UI (`TranscriptEditor.jsx`).
- [x] **P1** Add explicit unreviewed/reviewed labels.
- [x] **P1** Index strictly human-reviewed transcript in MySQL FULLTEXT search.

## Epic 9 - Platform governance and archival preservation (Phase 4)

- [x] **P1** Build Platform Governance & Administration Dashboard (`/admin`, `AdminDashboardPage.jsx`).
- [x] **P1** System Audit Trail (FR-13) logging immutable actor actions, entities, and timestamps.
- [x] **P2** ISO 14721 OAIS Archival Export Manifest (`/api/v1/archive-export?format=json|csv`).
- [x] **P2** User role administration (visitor, researcher, reviewer, admin) (`PATCH /admin/users/{id}/role`).
- [x] **P2** Research Bookmarking & Saved Items (FR-16) with personal notes (`POST/DELETE /saved-items/{id}`).
- [x] **P2** Integrated saved items management tab within `WorkspacePage.jsx`.

## Epic 10 - Advanced visual exploration and localization (Phase 5)

- [x] **P2** Interactive 3D Digital Twin Monument Viewer (`DigitalTwin3DViewer.jsx`) with subterranean pavilion geometry (levels -1 to -7), orbit controls, and seasonal water table simulation (FR-18).
- [x] **P2** Cultural Multilingual Localization (`i18n.jsx`) supporting English, Hindi (हिन्दी), and Gujarati (ગુજરાતી) (FR-17).
- [x] **P2** 10-slide accessible pitch deck presentation with PDF print export (`/pitch`, `PitchDeckPage.jsx`).

## Epic 11 - Quality, security and release (All Phases)

- [x] **P0** Test complete researcher-to-public-discovery journey.
- [x] **P0** Test all protected endpoints by role and ownership.
- [x] **P0** Test oversized, unsupported and renamed executable uploads.
- [x] **P0** Test pagination and empty search results.
- [x] **P0** Test mobile layout and keyboard navigation.
- [x] **P0** Check rights and permissions for all demo content.
- [x] **P0** Confirm production secrets are outside Git.
- [x] **P0** Test clean-clone setup and DB import.
- [x] **P0** Deploy and smoke-test the application.
- [x] **P0** Create pitch presentation (maximum 10 slides).
- [x] **P0** Automated test suite with 18 verification checkpoints passing (`scripts/test-all.sh`).
