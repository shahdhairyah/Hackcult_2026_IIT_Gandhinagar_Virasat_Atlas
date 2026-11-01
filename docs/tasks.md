# Implementation Task Backlog

## Virasat Atlas - React + PHP + MySQL

**Priority:** P0 = MVP blocker; P1 = add after the core journey works; P2 = post-hackathon.  
**Status key:** `[ ]` Not started, `[~]` In progress, `[x]` Done. Update this file as work is completed.

---

## Epic 0 - Repository and local environment

- [x] **P0** Create repository structure and conventions.
- [x] **P0** Create `client/` React + Vite app.
- [x] **P0** Create `api/` PHP API with `index.php` and `router.php` entry points.
- [x] **P0** Create MySQL database and import `database/schema.sql`.
- [x] **P0** Add `.env.example` and document required environment variables.
- [x] **P0** Add `/api/v1/health` readiness endpoint without leaking configuration.
- [x] **P0** Add README setup, run and troubleshooting instructions.
- [ ] **P1** Add automated formatting/lint scripts and a basic CI workflow.

## Epic 1 - Database and domain model

- [x] **P0** Create users and roles model.
- [x] **P0** Create locations model with optional coordinates.
- [x] **P0** Create archive items model with status and visibility.
- [x] **P0** Create media assets model and item relationship.
- [x] **P0** Create tags and archive-item-tag mapping.
- [x] **P0** Create collections and ordered collection-item mapping.
- [x] **P0** Add indexes for public catalogue, filters and FULLTEXT search.
- [x] **P1** Create OCR jobs table with raw/reviewed output separation.
- [x] **P1** Create audit log table and service.
- [x] **P0** Seed cleared sample records, locations, tags, users and a collection.

## Epic 2 - Authentication and permissions

- [x] **P0** Implement login endpoint with `password_verify()`.
- [x] **P0** Implement logout and current-user endpoint.
- [x] **P0** Configure secure session cookies and CSRF protection.
- [x] **P0** Implement auth middleware.
- [x] **P0** Implement role middleware for researcher, reviewer and admin.
- [x] **P0** Enforce ownership checks for draft edits and media removal.
- [x] **P0** Test that anonymous users cannot read drafts/private records.
- [ ] **P1** Add login rate limiting and account lockout/backoff strategy.

## Epic 3 - Archive contribution and media

- [x] **P0** Build archive item create endpoint.
- [x] **P0** Build archive item update endpoint with ownership checks.
- [x] **P0** Validate title, type, summary, language, date, place and rights fields.
- [x] **P0** Build multipart media upload endpoint.
- [x] **P0** Configure PHP and web-server upload size limits.
- [x] **P0** Validate MIME, extension, file size and generated storage filename.
- [x] **P0** Store original media outside public web root.
- [x] **P0** Save checksum, original filename, MIME, size and alt text.
- [x] **P0** Build React contribution form with clear sections.
- [x] **P0** Add upload progress, recoverable errors and preview.
- [x] **P0** Implement save draft and submit for review.
- [x] **P1** Generate thumbnails for image/PDF previews.

## Epic 4 - Review and publication

- [x] **P0** Build review queue endpoint and page.
- [x] **P0** Build record review detail screen.
- [x] **P0** Implement approve action.
- [x] **P0** Implement reject/return-for-correction action with required reason.
- [x] **P0** Validate rights and attribution before public approval.
- [x] **P0** Record reviewer, decision and timestamp.
- [x] **P0** Ensure only published/public records appear in anonymous catalogue/search/map.
- [x] **P1** Show reviewer feedback in researcher workspace.

## Epic 5 - Search and archive discovery

- [x] **P0** Build paginated public catalogue endpoint.
- [x] **P0** Add MySQL FULLTEXT search on title, summary, description and reviewed transcript.
- [x] **P0** Add filters for type, tag, region, language and period where available.
- [x] **P0** Add allowlisted sort options and maximum page size.
- [x] **P0** Build Explore page and archive cards.
- [x] **P0** Build archive detail endpoint and page.
- [x] **P0** Show source, creator, rights, attribution and review information.
- [x] **P0** Add empty, loading and API error states.
- [x] **P1** Add related items based on shared location/tags.
- [ ] **P2** Add vector/semantic search after a relevance test set exists.

## Epic 6 - Geospatial discovery

- [x] **P0** Build endpoint for public geotagged records/locations.
- [x] **P0** Integrate Leaflet and OpenStreetMap tile attribution.
- [x] **P0** Show item markers and selected-item preview.
- [x] **P0** Synchronise map marker selection with accessible result list.
- [x] **P0** Add list fallback if map tiles fail.
- [ ] **P1** Add marker clustering if real data density requires it.
- [x] **P1** Add location summary and approximate-coordinate label.

## Epic 7 - Collections

- [x] **P0** Build public collection list/detail endpoints.
- [x] **P0** Build collection page and ordered record list.
- [x] **P0** Allow reviewer/admin to create and edit collection metadata.
- [x] **P0** Allow reviewer/admin to order collection items.
- [ ] **P1** Add route line only when sequence and coordinates are valid.

## Epic 8 - OCR and transcription (only after P0)

- [ ] **P1** Select a supported language and tested OCR engine/data pack.
- [ ] **P1** Add OCR job creation and status handling.
- [ ] **P1** Save raw extraction separately from reviewed transcript.
- [ ] **P1** Build side-by-side source/transcript review UI.
- [ ] **P1** Add explicit unreviewed/reviewed labels.
- [ ] **P1** Index only reviewed transcript by default.
- [ ] **P2** Add translation workflow with human approval.

## Epic 9 - Quality, security and release

- [ ] **P0** Test complete researcher-to-public-discovery journey.
- [ ] **P0** Test all protected endpoints by role and ownership.
- [ ] **P0** Test oversized, unsupported and renamed executable uploads.
- [ ] **P0** Test pagination and empty search results.
- [ ] **P0** Test mobile layout and keyboard navigation.
- [ ] **P0** Check rights and permissions for all demo content.
- [ ] **P0** Confirm production secrets are outside Git.
- [ ] **P0** Test clean-clone setup and DB import.
- [ ] **P0** Deploy and smoke-test the application.
- [ ] **P0** Record 2-3 minute real-feature walkthrough.
- [ ] **P0** Create pitch PDF (maximum 10 slides).
- [ ] **P0** Verify public repository and required commit history.
- [ ] **P0** Submit before 4 November 2026, 6:30 PM IST.
- [ ] **P1** Add backup/restore verification and simple health monitoring.

## MVP acceptance checklist

- [x] A researcher can create and submit a record with a real attachment.
- [x] A reviewer can approve it with rights/attribution present.
- [x] A public visitor can find the published record using search and filters.
- [x] The detail page shows content, location, provenance and rights.
- [x] The record appears on the map if coordinates exist.
- [x] The record appears in an ordered collection.
- [x] A public user cannot retrieve draft/private records via API manipulation.
- [x] Setup instructions work from a clean clone.
