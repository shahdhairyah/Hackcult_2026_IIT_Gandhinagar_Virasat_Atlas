# Delivery Phases and Execution Plan

## Virasat Atlas - Hackathon Build Plan

**Planning window:** 1-4 November 2026  
**Submission deadline from the supplied brief:** 4 November 2026, 6:30 PM IST  
**Execution principle:** finish one end-to-end vertical slice before polishing secondary features.

---

## 1. Delivery strategy

The project has a broad innovation space, but the submission needs a working prototype, a public repository with understandable setup, a 2-3 minute real-feature walkthrough and a pitch PDF of no more than 10 slides. The team should optimise for a coherent working product and defensible engineering decisions rather than a large number of incomplete modules.

## 2. Phase plan

### Phase 0 - Scope and foundation (1 November)

**Objective:** make the project reproducible and remove architecture ambiguity.

Tasks:
- Create Git repository and branch/commit conventions.
- Scaffold React/Vite frontend and PHP API entry point.
- Configure environment variables and local database.
- Import schema and seed a small set of cleared sample records.
- Establish API response/error conventions and frontend API client.
- Set up shared layout, navigation and design tokens.

**Exit criteria:** React loads; PHP health endpoint responds; MySQL connects; schema imports from a clean database; README setup is accurate.

### Phase 1 - Archive ingestion and identity (2 November)

**Objective:** make a researcher able to create a usable archive record.

Tasks:
- Implement login/logout/current-user endpoints and role middleware.
- Build contribution form and server-side validation.
- Implement secure media upload and media-to-item association.
- Add metadata for place, source, creator, language, period and rights.
- Implement draft and submit-for-review states.

**Exit criteria:** researcher can sign in, create a record, upload a file, save a draft and submit it; server rejects unauthorised actions.

### Phase 2 - Quality control and discovery (3 November)

**Objective:** connect the archive workflow to public discovery.

Tasks:
- Implement review queue and approve/reject/request-correction actions.
- Implement public catalogue, pagination, FULLTEXT search and filters.
- Build archive detail page with media, provenance and rights.
- Implement Leaflet map with markers from public geotagged records.
- Implement collections with ordered archive items.
- Add realistic loading, empty and error states.

**Exit criteria:** a submitted record can be approved and discovered from search, detail, map and a collection. Drafts/private records remain inaccessible to public endpoints.

### Phase 3 - Stabilisation and submission (4 November)

**Objective:** produce a reliable demo and complete all submission artefacts.

Tasks:
- Fix critical bugs; verify responsive layout and core permissions.
- Add OCR only if P0 workflow is stable; show raw/unreviewed vs reviewed text.
- Confirm sample content rights and attribution.
- Add architecture diagram, database schema and setup steps to README.
- Deploy a working demo and test it from a clean browser/session.
- Record 2-3 minute walkthrough using the real deployed prototype.
- Prepare accessible pitch PDF with no more than 10 slides.
- Verify public repository includes the required hackathon commits and documentation.
- Submit before 6:30 PM IST; do not schedule first-time deployments at the deadline.

**Exit criteria:** demo is usable without developer intervention; repository is public and complete; video and PDF links open; submission is made before deadline.

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

Adapt the schedule to actual team availability. The important control is an early feature freeze and a submission buffer.

## 4. Feature prioritisation

| Feature | Priority | Reason |
|---|---:|---|
| Auth + role checks | P0 | Required for a credible contribution/review workflow |
| Create record + upload | P0 | Solves the archive ingestion problem |
| Source/rights metadata | P0 | Protects provenance and responsible reuse |
| Review workflow | P0 | Prevents unchecked public content |
| Search + filters | P0 | Directly addresses unstructured/discoverability problem |
| Detail page | P0 | Restores cultural and architectural context |
| Map exploration | P0 | Makes geography a first-class discovery dimension |
| Collections | P0 | Enables guided cultural exploration |
| OCR assistant | P1 | Useful, but accuracy and scripts require testing |
| 3D reconstruction | P2 | Too risky for a short MVP unless an existing model is supplied |
| Semantic vectors | P2 | Adds infrastructure and evaluation complexity |

## 5. Go/no-go checkpoints

- **End of Phase 0:** no development continues until a clean install and DB import work.
- **End of Phase 1:** no extra visual features until a real file can be uploaded and saved securely.
- **End of Phase 2:** no new modules until the public discovery journey is complete and permissions are tested.
- **Feature freeze:** only critical fixes, copy, accessibility and deployment corrections.

## 6. Demo sequence

1. Sign in as researcher.
2. Create one heritage record and upload a real, rights-cleared image/document.
3. Add location, source and rights/attribution details.
4. Submit for review.
5. Switch to reviewer and approve it.
6. Open public Explore and search for the record.
7. Open detail page and show provenance/rights.
8. Show it on the map and inside a curated collection.

If the application is seeded rather than live-created during the demo, explain that clearly; do not stage fake loading or pretend an incomplete action succeeded.

## 7. Risks to schedule

- Cross-origin cookie/CORS issues: keep frontend and API same-origin or proxy API calls if possible.
- File upload limits: configure PHP `upload_max_filesize`, `post_max_size` and web-server request size before demo day.
- Map tiles depend on network: retain a list view fallback.
- OCR language data may be unavailable: keep OCR optional and use reviewed sample text only if genuinely tested.
- Production storage permissions: verify write access for PHP and deny public direct access.
- Deployment secrets: configure outside Git; run a clean clone test.
