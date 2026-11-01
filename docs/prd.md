# Product Requirements Document (PRD)

## Virasat Atlas - Map-First Digital Heritage Archive

**Challenge:** HC26-CULT01 - Digital Revitalisation of Unstructured Cultural & Architectural Heritage Archives  
**Event:** Blithchron '27, IIT Gandhinagar  
**Category:** Software (Open Innovation)  
**Implementation baseline:** React.js + PHP REST API + MySQL 8+  
**Document status:** Build specification for hackathon MVP  
**Submission deadline supplied in the brief:** 4 November 2026, 6:30 PM IST

---

## 1. Product summary

Virasat Atlas converts scattered cultural and architectural heritage material into a structured, searchable and location-aware digital archive. Researchers and archivists can add photographs, scanned documents, field notes and source records; enrich them with reliable metadata; and publish approved items into a public discovery experience. Visitors can search by keyword, filter by heritage type and region, inspect item details, explore a map and follow curated collections or heritage trails.

The product is deliberately designed as a practical archive workflow rather than a generic tourism directory. Every record should retain its provenance, attribution, rights status, location context and review status. OCR is an assistive workflow: extracted text is a draft and must be reviewed before publication.

### Product promise

**Find the story behind the archive - by subject, place, time and source.**

## 2. Problem statement

Cultural exploration programmes generate photographs, regional-language material, architectural observations, oral-history notes and travel journals. These assets are often stored in presentation decks, shared folders and disconnected documents. That fragmentation causes four problems:

1. **Low discoverability:** people cannot search across formats and folders consistently.
2. **Lost context:** a photograph may be separated from its site, date, creator, source or cultural interpretation.
3. **Limited public access:** valuable field material remains difficult for researchers, students and visitors to explore.
4. **Weak preservation workflow:** provenance, permissions, transcription corrections and publication review are not managed in one place.

## 3. Product goals

### Primary goals

- Establish one structured catalogue for photos, documents and field observations.
- Make archive records searchable by title, description, transcript, tags and region.
- Connect records to named heritage locations and geographic coordinates.
- Provide a map-first way to discover published material.
- Give archivists a controlled workflow for upload, metadata enrichment, review and publication.
- Preserve source attribution, rights information and a visible correction trail.
- Work with the specified React + PHP + MySQL stack without requiring a separate Python backend.

### Success criteria for the MVP

- A researcher can create an archive item, attach a file and save metadata.
- An authorised reviewer can approve or reject a submitted item.
- A public visitor can search and filter published items and open a useful detail page.
- A visitor can discover geotagged items on an interactive map.
- A visitor can open a curated collection and navigate its ordered items.
- Every public item displays an attribution/rights statement and available provenance.
- Core flows work on desktop and mobile viewport sizes.

## 4. Non-goals for the hackathon MVP

The following are not required to prove the core value and must not be represented as completed unless actually implemented and tested:

- Automatic reconstruction of photorealistic 3D monuments from arbitrary photographs.
- Production-grade semantic/vector search across all Indian languages.
- Guaranteed high-accuracy OCR for every historical script, handwriting style or regional language.
- Automatic translation without human verification.
- A native mobile application.
- A full institutional digital-preservation repository with redundant archival storage and formal long-term preservation certification.
- A public crowdsourcing workflow without moderation.

These remain roadmap options after the MVP.

## 5. Target users and jobs-to-be-done

| Persona | Primary need | Key actions |
|---|---|---|
| Researcher / Explorer Fellow | Preserve field observations with context | Upload material, add notes, location, date, source and tags |
| Archivist / Reviewer | Maintain quality and rights compliance | Review metadata, correct OCR, approve, reject or archive |
| Cultural researcher | Find credible material for study | Search, filter, inspect provenance and compare related records |
| Heritage visitor / Student | Explore a place's cultural history | Browse map, open site records and follow collections |
| Platform administrator | Operate the archive safely | Manage users, roles, categories, moderation and audit activity |

## 6. Core user journeys

### Journey A - Researcher submits an archive record

1. Sign in using an approved researcher account.
2. Open **Contribute** and create a new record.
3. Enter title, item type, description, region, date, language and source.
4. Upload one or more supported files.
5. Add a named location or latitude/longitude; select a primary image and add alt text.
6. Add tags and rights/attribution information.
7. Save as draft or submit for review.
8. View status and reviewer feedback.

### Journey B - Archivist reviews a record

1. Open the review queue.
2. Inspect the record, original attachment, metadata and provenance.
3. Correct typos or OCR text while preserving the original extracted text.
4. Confirm location, attribution and rights status.
5. Approve, reject with a reason or return for correction.
6. Approved public records become discoverable according to their visibility setting.

### Journey C - Visitor discovers heritage material

1. Open the public Explore page.
2. Search with a keyword or choose a region, category, language or period filter.
3. Switch between card/list and map views.
4. Select a result or map marker.
5. Read the description, view media, inspect location and source, and open related material.
6. Open a curated collection/trail and move through its ordered items.

## 7. Functional requirements

Priority definitions: **P0** = necessary for a credible MVP; **P1** = valuable if time allows; **P2** = post-hackathon.

| ID | Requirement | Priority | Acceptance condition |
|---|---|---:|---|
| FR-01 | User authentication | P0 | Login, logout and current-user endpoint work; passwords are hashed |
| FR-02 | Role-based permissions | P0 | Visitor, researcher, reviewer and admin permissions are enforced server-side |
| FR-03 | Archive item creation/editing | P0 | Authorised researcher can save required metadata and update own draft |
| FR-04 | Media upload | P0 | Allowed file types are validated, stored outside public web root and linked to an item |
| FR-05 | Archive catalogue | P0 | Public catalogue returns published/public items with pagination |
| FR-06 | Keyword search | P0 | Search includes title, summary, description and reviewed transcript text |
| FR-07 | Discovery filters | P0 | Filter by item type, tag, region/location, language and period where available |
| FR-08 | Item detail | P0 | Detail page shows media, description, location, dates, source and rights/attribution |
| FR-09 | Map exploration | P0 | Geotagged public items appear on a map; marker opens item detail |
| FR-10 | Review workflow | P0 | Reviewer can approve, reject or request correction with recorded reason |
| FR-11 | Curated collections | P0 | Admin/reviewer can create a collection and order its items |
| FR-12 | Provenance and attribution | P0 | Required source/creator/rights fields are stored and visible when applicable |
| FR-13 | Audit events | P1 | Important create/update/review actions are recorded with actor and timestamp |
| FR-14 | OCR assistance | P1 | Extracted text can be attached to a record and manually corrected before publication |
| FR-15 | Related items | P1 | Related content is suggested by shared tags, location or collection |
| FR-16 | Saved items | P2 | Signed-in users can bookmark records |
| FR-17 | Multilingual UI/translations | P2 | Interface and reviewed translations support multiple languages |
| FR-18 | 3D digital twin viewer | P2 | A model can be linked to a site and viewed in a 3D component |

## 8. Content and metadata requirements

Every archive item should support the following fields. Required fields are marked **Required** for submission; reviewers may require additional fields for specific item types.

| Field | Requirement | Notes |
|---|---|---|
| Title | Required | Clear, descriptive title; avoid unsupported historical claims |
| Item type | Required | Monument, architecture, craft, document, photograph, field note, oral history, other |
| Summary | Required | One or two sentences for search result cards |
| Description | Recommended | Detailed observation and interpretation, distinguishing fact from hypothesis |
| Region / place | Required | At least a region or named location |
| Coordinates | Optional | Latitude/longitude when known; never fabricate precision |
| Capture / source date | Optional | Distinguish capture date from historical period |
| Language | Recommended | Language of source or transcript, not interface language |
| Creator / contributor | Recommended | Person or institution credited |
| Source / collection | Required | Where the material originated or who supplied it |
| Historical period | Optional | Use an approximate label when exact date is unknown |
| Tags | Recommended | Controlled tags plus optional descriptive tags |
| Rights status | Required | Public domain, CC licence, permission granted, permission pending, restricted, unknown |
| Attribution text | Required when applicable | Reproduce creator/source credit exactly as supplied |
| Alt text | Required for meaningful images | Concise description for screen-reader users |
| Transcript | Optional | OCR/transcription text with review state and language |

## 9. Content states and visibility

**Workflow status:** `draft` -> `pending_review` -> `published` / `rejected` / `archived`. A rejected item may return to draft after correction.  
**Visibility:** `public`, `unlisted`, `private`. Only `published` + `public` records appear in public discovery. The API must enforce this rule even if a client manipulates query parameters.

## 10. Information architecture

- **Explore:** searchable catalogue, filters, map/list toggle.
- **Archive detail:** media gallery, narrative, metadata, provenance, location and related items.
- **Map:** map markers, result list and location summary.
- **Collections:** curated themes, regions, routes or field-study collections.
- **Contribute:** researcher workspace for drafts and submissions.
- **Review queue:** reviewer workspace with quality and rights checks.
- **Admin:** users, roles, taxonomy and platform health.

## 11. Non-functional requirements

| Area | MVP target |
|---|---|
| Performance | Paginated catalogue; indexed search fields; thumbnails rather than full-resolution list images |
| Security | PDO prepared statements, server-side authorization, hashed passwords, validated uploads, CSRF protection for cookie sessions |
| Accessibility | Aim for WCAG 2.2 AA: keyboard access, labelled inputs, visible focus, alt text and sufficient contrast |
| Responsive design | Usable at 360 px mobile width and standard laptop widths |
| Reliability | Validate and report failed uploads; preserve original files; no silent OCR overwrite |
| Maintainability | Versioned SQL schema, API version prefix, reusable React components and documented environment variables |
| Traceability | Source, rights, review status and timestamps associated with every record |

## 12. MVP release definition

A release candidate is ready when the team can demonstrate this continuous end-to-end flow with seeded sample content:

**Researcher login -> create archive record -> upload photo/PDF -> add provenance and map location -> submit -> reviewer approves -> public visitor searches -> opens record -> discovers it on map -> opens a curated collection.**

A smaller working end-to-end path is preferable to many disconnected screens. OCR is an enhancement, not a blocker for the core archive workflow.

## 13. Product risks and assumptions

- Sample content must be cleared for demonstration; do not upload copyrighted or sensitive material without permission.
- Coordinates may be approximate. Show a precision caveat where applicable.
- Historical claims require source attribution and editorial review.
- OCR output may be wrong, especially for degraded scans or scripts without suitable language data.
- Map tiles and third-party services require network access; the archive itself should still load without map tiles.
- The challenge brief is the source of the event-specific context and deadline in this document.
