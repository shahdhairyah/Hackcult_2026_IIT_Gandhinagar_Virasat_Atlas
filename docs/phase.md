# Delivery Phases and Execution Plan

## Virasat Atlas - Hackathon Build Plan

**Planning window:** 1-4 November 2026  
**Submission deadline from the supplied brief:** 4 November 2026, 6:30 PM IST  
**Execution principle:** finish one end-to-end vertical slice before polishing secondary features.

---

## 1. Delivery strategy

The project has a broad innovation space, but the submission needs a working prototype, a public repository with understandable setup, a 2-3 minute real-feature walkthrough and a pitch PDF of no more than 10 slides. The team should optimise for a coherent working product and defensible engineering decisions rather than a large number of incomplete modules.

## 2. Phase plan

### Phase 0 - Scope and foundation (1 November) - COMPLETED

**Objective:** make the project reproducible and remove architecture ambiguity.

Tasks:
- [x] Create Git repository and branch/commit conventions.
- [x] Scaffold React/Vite frontend and PHP API entry point (`api/`).
- [x] Configure environment variables and local MariaDB/MySQL database.
- [x] Import schema (`database/schema.sql`) and seed cleared authentic Gujarat heritage records (`database/seed.php`).
- [x] Establish API response/error conventions and frontend API client (`api/client.js`).
- [x] Set up shared layout, navigation and design tokens (`SiteHeader`, `SiteFooter`, CSS tokens).

**Exit criteria:** React loads; PHP health endpoint responds; MySQL connects; schema imports from a clean database; README setup is accurate. (PASSED)

### Phase 1 - Archive ingestion and identity (2 November) - COMPLETED

**Objective:** make a researcher able to create a usable archive record.

Tasks:
- [x] Implement login/logout/current-user endpoints and role middleware (`visitor`, `researcher`, `reviewer`, `admin`).
- [x] Build contribution form and server-side validation (`ArchiveItemValidator`).
- [x] Implement secure multipart media upload with `finfo` MIME validation and SHA-256 checksums outside web root.
- [x] Add metadata for place, source, creator, language, period and rights.
- [x] Implement draft and submit-for-review workflow states.

**Exit criteria:** researcher can sign in, create a record, upload a file, save a draft and submit it; server rejects unauthorised actions. (PASSED)

### Phase 2 - Quality control and discovery (3 November) - COMPLETED

**Objective:** connect the archive workflow to public discovery.

Tasks:
- [x] Implement review queue and approve/reject/request-correction actions with mandatory reviewer feedback.
- [x] Implement public catalogue, pagination, MySQL FULLTEXT search and filters.
- [x] Build archive detail page with media, provenance, source attribution, and rights.
- [x] Implement Leaflet map (`MapExplorer.jsx`) with markers from public geotagged records and accessible list fallback.
- [x] Implement collections with ordered archive items and reviewer curation modal.
- [x] Add realistic loading, empty and error states across all routes.

**Exit criteria:** a submitted record can be approved and discovered from search, detail, map and a collection. Drafts/private records remain inaccessible to public endpoints. (PASSED)

### Phase 3 - Paleographic OCR, Related Records, and Pitch Deck (4 November) - COMPLETED

**Objective:** human-in-the-loop OCR transcription, related records engine, and accessible pitch presentation.

Tasks:
- [x] Human-in-the-loop OCR paleographic assistant (FR-14) with strict separation of draft machine extraction and verified transcript.
- [x] MySQL FULLTEXT search indexing restricted strictly to human-verified transcripts.
- [x] Related heritage records recommendation engine based on geographic hydrology, Solanki stone carving styles, and thematic tags (FR-15).
- [x] 10-slide accessible pitch deck with integrated browser PDF export (`/pitch`).

**Exit criteria:** OCR job workflow verifies transcripts; verified words become searchable; pitch deck presents all 10 required architectural slides. (PASSED)

### Phase 4 - Governance, Archival Preservation & Research Bookmarking - COMPLETED

**Objective:** enterprise archival governance, audit logging, OAIS compliance, and personal research collections.

Tasks:
- [x] Platform Governance Dashboard (`/admin`) with storage metrics and role administration.
- [x] System Audit Trail (FR-13) logging immutable actor actions and timestamps for security and preservation compliance.
- [x] ISO 14721 OAIS Archival Export Manifest (`/api/v1/archive-export?format=json|csv`) generating standard archival information packages (AIPs).
- [x] Research Bookmarking & Saved Items (FR-16) allowing researchers to save records and manage personal field citations directly in `My Workspace`.

**Exit criteria:** Admin dashboard renders live metrics and audit logs; OAIS manifest exports conform to ISO 14721; saved items persist in user workspace. (PASSED)

### Phase 5 - 3D Digital Twin Monument Viewer & Multilingual Localization - COMPLETED

**Objective:** interactive 3D monument exploration and regional cultural localization.

Tasks:
- [x] Interactive 3D Digital Twin Monument Viewer (`DigitalTwin3DViewer.jsx`) with orbit controls, subterranean pavilion levels (-1 to -7), and dynamic water table simulation (FR-18).
- [x] Cultural Multilingual Localization (`i18n.jsx`) supporting English, Hindi (हिन्दी), and Gujarati (ગુજરાતી) across header, search, filters, badges, and detail views (FR-17).
- [x] End-to-end regression test suite (`scripts/test-all.sh`) validating all 18 automated checkpoints across Phases 0 through 5.

**Exit criteria:** 3D subterranean viewer allows depth and hydrology inspection; language switcher dynamically updates interface text without reload; all 18 automated tests pass. (PASSED)

---

## 3. Suggested time-boxes on submission day

| Time (IST) | Activity |
|---|---|
| 09:00-11:00 | End-to-end regression and critical fixes |
| 11:00-12:00 | Content, attribution, access-control and mobile checks |
| 12:00-13:00 | Deploy/final configuration verification |
| 13:00-14:00 | Feature freeze; stop adding risky features |
| 14:00-15:00 | Record the 2-3 minute walkthrough |
| 15:00-16:00 | Finalise pitch PDF and README links |
| 16:00-17:00 | Clean clone/setup test and repository audit |
| 17:00-17:45 | Submit and verify submission receipt/status |
| 17:45-18:30 | Contingency buffer only; no major feature work |

---

## 4. Feature prioritisation matrix

| Feature | Priority | Status | Implemented Module |
|---|---:|---|---|
| Auth + role checks | P0 | Done | `AuthMiddleware`, `RoleMiddleware`, `AuthContext.jsx` |
| Create record + upload | P0 | Done | `ArchiveItemController`, `MediaController`, `ContributePage.jsx` |
| Source/rights metadata | P0 | Done | `ArchiveDetailPage.jsx`, `database/schema.sql` |
| Review workflow | P0 | Done | `ReviewController`, `ReviewQueuePage.jsx` |
| Search + filters | P0 | Done | MySQL FULLTEXT, `ArchiveListPage.jsx` |
| Detail page | P0 | Done | `ArchiveDetailPage.jsx` |
| Map exploration | P0 | Done | Leaflet, `MapPage.jsx`, `MapExplorer.jsx` |
| Collections | P0 | Done | `CollectionController`, `CollectionsPage.jsx` |
| OCR assistant | P1 | Done | `OcrController`, `TranscriptEditor.jsx` |
| Audit trail | P1 | Done | `AuditRepository`, `AdminDashboardPage.jsx` |
| Related records | P1 | Done | `ArchiveItemRepository::findRelated`, `ArchiveDetailPage.jsx` |
| Pitch deck (10 slides) | P1 | Done | `PitchDeckPage.jsx` (`/pitch`) |
| Saved items / bookmarks | P2 | Done | `SavedItemController`, `WorkspacePage.jsx` |
| OAIS archival export | P2 | Done | `AdminController::archiveExport` (`/archive-export`) |
| 3D Digital Twin Viewer | P2 | Done | `DigitalTwin3DViewer.jsx` (Subterranean geometry & water table) |
| Multilingual (EN/HI/GU)| P2 | Done | `i18n.jsx` (English, Hindi, Gujarati) |

---

## 5. Acceptance verification

All features across Phases 0 through 5 have been validated using the automated integration test script `scripts/test-all.sh`.
