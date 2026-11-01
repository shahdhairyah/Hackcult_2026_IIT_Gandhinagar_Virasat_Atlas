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

---

# Extended Roadmap: Phase 6–12

> **Continuation note:** The project owner reports that Phases 0–5 are complete. The following phases continue from Phase 6 and are written as the next development roadmap. Keep the earlier phases as the project's implementation history; do not mark any new phase complete until its acceptance criteria have been tested.

## 8. Extended roadmap overview

| Phase | Name | Priority | Primary outcome |
|---|---|---:|---|
| 6 | Security, reliability and release hardening | P0 | Protect accounts, records and uploaded media |
| 7 | Heritage data quality and digital preservation | P0 | Make every archive record traceable and preservable |
| 8 | Document digitisation and OCR | P1 | Convert scans into reviewable, searchable text |
| 9 | Advanced search and contextual discovery | P1 | Help users find heritage records using multiple discovery paths |
| 10 | Geospatial storytelling and heritage trails | P1 | Turn map locations into connected cultural experiences |
| 11 | Immersive media and 3D heritage viewer | P2 | Present verified 3D models and rich media interactively |
| 12 | Institutional collaboration, analytics and scale | P2 | Support long-term use by researchers and heritage institutions |

**Stack constraint:** Keep React.js for the frontend, PHP for the REST API and MySQL for the primary database. Use additional tools only where they solve a specific requirement. OCR engines, map tile services and 3D assets are integrations, not replacements for the core stack.

---

## 9. Phase 6 — Security, reliability and release hardening

**Objective:** Make the existing application safe to use with real contributors, reviewers and public visitors.

### Implementation tasks

- Review the complete authentication flow. Use secure server-managed sessions or properly signed, expiring tokens; never trust a user ID taken from an unsigned token.
- Enforce role-based access control on the server for every protected endpoint. Verify record ownership and permissions, not only whether a user is logged in.
- Hash passwords with PHP's `password_hash()` and verify them with `password_verify()`.
- Add CSRF protection when using cookie-based sessions. Configure secure, HttpOnly and SameSite cookie attributes for HTTPS deployments.
- Use PDO prepared statements for all database input. Validate and normalise request data on the server.
- Validate uploads using file size limits, MIME inspection with `finfo`, permitted extensions, randomised server-side filenames and safe storage locations. Do not trust the client-supplied filename or MIME type.
- Prevent direct execution of uploaded files. Store sensitive originals outside the public web root or serve them through an authorised download endpoint.
- Add rate limits to login, password reset and upload endpoints. Avoid returning stack traces or database details to clients.
- Add audit events for login attempts, contribution submission, review decisions, metadata edits and deletion requests.
- Configure production error logging, environment-based secrets, HTTPS and a documented backup schedule.
- Add automated tests for authentication, role permissions, record ownership, upload validation and public/private visibility.

### Deliverables

- Security review checklist and permission matrix.
- Updated authentication and authorisation implementation.
- Upload validation and protected media delivery.
- API regression tests and deployment configuration checklist.
- Database backup and restore instructions.

### Acceptance criteria

- A user cannot access another researcher's draft by changing an ID in a URL or API request.
- A public visitor cannot read drafts, private records or unapproved media.
- Forged, expired or malformed authentication credentials are rejected.
- Executable or disallowed uploads are rejected by the server.
- A database backup can be restored into a clean test database.
- No production secrets, passwords or private keys are committed to Git.

**Exit gate:** Do not start new high-risk features until the permission tests and upload-security checks pass.

---

## 10. Phase 7 — Heritage data quality and digital preservation

**Objective:** Ensure that records are accurate, attributable, reusable within their rights and suitable for long-term preservation.

### Implementation tasks

- Define required and optional metadata for each archive type: monument, site, object, craft, photograph, document, oral history and field note.
- Record title, description, place, period, language, contributor, creator, collection, source citation, capture date, rights status and attribution where applicable.
- Distinguish the original uploaded file from thumbnails, compressed previews, OCR text and other generated derivatives.
- Calculate a SHA-256 checksum for each original file at ingestion and verify it during integrity checks or exports.
- Track record lifecycle states such as draft, submitted, under review, published, correction requested, withdrawn and archived.
- Add duplicate detection using file checksums and a reviewer warning for near-duplicate metadata; do not automatically delete potential duplicates.
- Support approximate locations when exact coordinates are unknown or culturally sensitive. Store location precision and public-display policy explicitly.
- Add a correction and takedown request workflow with reason, requester, decision and audit history.
- Provide structured export for permitted records, including metadata and attribution. Preserve original files and their checksums in the export manifest.
- Add a metadata completeness indicator for researchers and reviewers.

### Deliverables

- Archive metadata dictionary and validation rules.
- File integrity and duplicate-check process.
- Provenance, rights and attribution display on record pages.
- Correction/takedown workflow and archive export format.
- Sample dataset containing rights-cleared, properly attributed records.

### Acceptance criteria

- Every published record displays its source/provenance and rights information or explicitly states that the information is unknown or pending verification.
- Original files remain distinguishable from generated derivatives.
- File checksums can be recalculated and matched.
- Sensitive or uncertain locations can be generalised before public display.
- A user can request a correction or takedown and a reviewer can record the decision.

**Exit gate:** A record is not considered publication-ready merely because its image and title exist; minimum provenance and rights checks must pass.

---

## 11. Phase 8 — Document digitisation and OCR

**Objective:** Convert scanned and photographed historical documents into editable, reviewable text that can be searched alongside archive metadata.

**Implementation approach:** OCR is an optional enhancement, not a dependency for the rest of Virasat Atlas. The project can still function without AI/ML by allowing manual transcription and structured metadata entry.

### Implementation tasks

- Add a document-processing workflow with states: queued, processing, text extracted, needs review, verified, failed and cancelled.
- Integrate a real OCR engine such as Tesseract with the required language data. Run it on the server or through a controlled worker; do not simulate OCR output or hardcode confidence values.
- Support page-by-page processing for multi-page documents and retain page references in extracted text.
- Preserve the original scan. Save OCR output as a separate derived text record.
- Store the OCR engine name, engine version, selected language, processing timestamp and genuine engine confidence data when available.
- Provide a side-by-side review screen showing the source image and extracted text.
- Let an authorised reviewer correct the text and mark it as verified. Keep the raw OCR output and corrected transcription separately.
- Add manual transcription as a fallback where OCR is unavailable or unsuitable, especially for damaged, handwritten or uncommon scripts.
- Add language metadata and a clear label when a translation is machine-generated, human-reviewed or supplied by a contributor.
- Do not automatically translate or overwrite the source-language transcription.

### Deliverables

- Working OCR integration with documented installation and language-data requirements.
- Document processing status and error handling.
- Text correction and verification interface.
- Searchable, page-linked transcription records.
- A small evaluation set of representative, rights-cleared documents.

### Acceptance criteria

- OCR extracts text from actual uploaded images or PDF pages; the result is not generated from the document title or seeded text.
- The original file remains unchanged.
- Users can compare extracted text with the source and correct errors.
- Raw and verified text are distinguishable in storage and UI.
- OCR failure does not prevent the archive record from being saved or searched by metadata.
- Report OCR accuracy using a manually checked sample and character error rate (CER) or word error rate (WER); do not claim perfect recognition.

**Non-AI fallback:** Allow contributors to type or paste a transcription and submit it for verification. Keyword search, tags and map discovery continue to work without OCR.

---

## 12. Phase 9 — Advanced search and contextual discovery

**Objective:** Improve the ability of researchers, tourists and the public to find relevant records across different archive types.

### Implementation tasks

- Improve MySQL FULLTEXT search across approved titles, descriptions and verified transcriptions.
- Add faceted filters for state, district, heritage type, historical period, language, collection, rights status and record format.
- Add sorting by relevance, recently published, historical period and alphabetical title.
- Add autocomplete for known places, archive titles and tags, while protecting private and draft records from suggestions.
- Support spelling-tolerant discovery through curated aliases, alternate spellings and transliteration fields where practical.
- Add related-record links based on shared place, period, contributor-approved tags and collection membership.
- Show why a record matched, such as title, location, tag or transcription, to make search results understandable.
- Record privacy-conscious search analytics such as query counts and zero-result searches; do not collect unnecessary personal information.
- Optionally evaluate semantic search as a separate enhancement using embeddings and a dedicated service. Keep standard SQL search available as the reliable baseline.

### Deliverables

- Search API with pagination, filtering and sorting.
- Search interface with filter chips and clear/reset controls.
- Related heritage records and alternate-name support.
- A small set of representative search test queries and expected results.
- Optional semantic-search proof of concept with a documented fallback.

### Acceptance criteria

- Users can combine at least three filters without losing pagination or search state.
- Search results contain only records the current user is authorised to view.
- Verified OCR/manual transcriptions can be searched when available.
- Empty searches provide useful recovery suggestions rather than a blank screen.
- Search relevance is checked against a documented sample query set.

**Non-AI baseline:** MySQL FULLTEXT, indexed metadata, tags and aliases provide useful discovery without a machine-learning model.

---

## 13. Phase 10 — Geospatial storytelling and heritage trails

**Objective:** Evolve the map from a location display into a guided way to explore the relationship between places, architecture and regional history.

### Implementation tasks

- Add map filters that stay synchronised with the archive catalogue.
- Group dense markers using clustering and provide a list-view fallback.
- Add location detail cards with images, period, heritage type, source and links to full records.
- Create curated trails with ordered stops, descriptions, estimated visit duration and accessibility notes where verified.
- Add a chronological timeline or period filter so users can explore heritage by era.
- Support region-based collections such as a district, river basin, craft cluster or architectural route.
- Distinguish precise coordinates from approximate or intentionally obscured locations.
- Add keyboard-accessible alternatives to map-only interactions and ensure every mapped record is also available in a normal list.
- Cache only appropriate public map data and explain that third-party map tiles may require an internet connection.

### Deliverables

- Filterable heritage map.
- Heritage trail creation and public trail detail page.
- Map/list synchronisation and location detail cards.
- Timeline or historical-period exploration.
- Location-privacy and accessibility checks.

### Acceptance criteria

- Selecting a map marker opens the matching published archive record.
- Map filters and catalogue filters return consistent results.
- A trail displays stops in the intended order and links to the correct records.
- Approximate or sensitive locations are not accidentally exposed as exact coordinates.
- Users can access all map results without relying exclusively on a visual map.

---

## 14. Phase 11 — Immersive media and 3D heritage viewer

**Objective:** Present high-value heritage material through interactive media while keeping the underlying evidence and source records visible.

### Implementation tasks

- Add a media gallery for photographs, document pages, audio and video where rights permit.
- Add a panorama viewer for supplied 360-degree images where available.
- Integrate a Three.js-based viewer for genuine, prepared 3D assets in glTF/GLB format.
- Support basic viewer controls: rotate, zoom, reset view and fullscreen where supported.
- Add optional hotspots or annotations linked to verified archive records and architectural features.
- Display model source, creator, capture method, date, licence and known limitations.
- Optimise models and textures for browser delivery; provide a static image fallback for unsupported devices.
- Keep 3D assets clearly labelled as measured, photogrammetric, artist-created, reconstructed or illustrative. Do not present an illustrative model as a verified digital twin.
- Treat automatic reconstruction from crowdsourced 2D photographs as a separate research prototype, not a guaranteed MVP capability.

### Deliverables

- Reusable media gallery.
- Working viewer for at least one genuine, permitted 3D asset if an asset is available.
- Annotations/hotspots linked to archive records, if supported by the selected asset.
- Performance fallback and media provenance display.

### Acceptance criteria

- The 3D viewer loads a real GLB/glTF asset and remains usable on a supported desktop browser.
- The viewer provides a fallback when WebGL or the asset is unavailable.
- Asset rights and provenance are visible.
- The interface accurately identifies the asset's source and reconstruction status.

**Scope rule:** Do not delay security, searchable archives or the heritage map to build 3D features. This phase is P2 and can be deferred.

---

## 15. Phase 12 — Institutional collaboration, analytics and scale

**Objective:** Prepare Virasat Atlas for sustained use by academic groups, cultural organisations and heritage researchers.

### Implementation tasks

- Add institution or project workspaces with clear ownership and membership roles.
- Support collection-level collaboration, reviewer assignment and contribution attribution.
- Add export/import workflows with validation, duplicate warnings and provenance preservation.
- Provide institution-level dashboards for records contributed, review backlog, metadata completeness and public engagement.
- Add version history for important metadata edits and a way to compare revisions.
- Create public API documentation and version endpoints before exposing third-party integrations.
- Add pagination and database indexes for growing archive collections; review slow queries with realistic sample data.
- Move long-running work such as OCR, thumbnails and large exports into a queue/worker pattern if processing time requires it.
- Add operational monitoring for API errors, storage capacity, failed jobs and backup completion.
- Define retention, account removal, data correction and takedown policies.
- Conduct accessibility checks, responsive testing and a basic performance audit.

### Deliverables

- Institution/workspace permissions.
- Revision history and contributor attribution.
- Import/export documentation and versioned API reference.
- Operational dashboard and monitoring checklist.
- Performance test results and data-governance policy.

### Acceptance criteria

- Users can only access the institution workspaces and collections for which they have permission.
- Import/export preserves record identifiers, attribution, rights information and file checksums where applicable.
- Metadata edits have an attributable history.
- The application has tested backup, restore and recovery procedures.
- API and catalogue performance are measured against a documented test dataset.

---

## 16. Cross-phase engineering standards

Apply these standards to every new phase:

1. **Vertical delivery:** complete database, PHP API, React UI and tests for one feature before starting another.
2. **API contract:** document endpoint method, route, authentication requirement, request fields, response shape and error codes.
3. **Database changes:** use versioned SQL migrations; do not rely on undocumented manual production edits.
4. **Security:** enforce validation and permissions in PHP. Hiding a button in React is not access control.
5. **Traceability:** every public heritage fact should have a source, contributor or an explicit unknown/unverified state.
6. **Accessibility:** support keyboard navigation, readable contrast, meaningful alt text and non-map alternatives.
7. **Testing:** test successful flows, invalid input, unauthorised access, empty results and service failures.
8. **Honest feature claims:** distinguish implemented, tested, simulated, planned and research-only capabilities in the UI, README and pitch deck.
9. **Reproducibility:** a new developer must be able to install the application from the README using documented configuration and seed data.
10. **Release discipline:** deploy from a tagged commit, keep secrets outside the repository and retain a rollback plan.

## 17. Recommended execution order after Phase 5

For the highest practical value, implement the continuation in this order:

| Order | Phase | Recommendation |
|---:|---|---|
| 1 | Phase 6 — Security and reliability | Complete first; blocks unsafe public use |
| 2 | Phase 7 — Data quality and preservation | Complete before scaling the archive |
| 3 | Phase 9 — Advanced search | High user value; can be delivered without AI/ML |
| 4 | Phase 10 — Geospatial storytelling | Strengthens the project's main discovery experience |
| 5 | Phase 8 — OCR | Add when there is a representative document test set and time for human review |
| 6 | Phase 12 — Institutional collaboration and scale | Add when real organisations or multiple research groups need it |
| 7 | Phase 11 — 3D and immersive media | Optional advanced extension; do not let it block core archive quality |

The phase numbers describe the roadmap sequence, while the recommended order places Phase 9 and Phase 10 before OCR where those features provide more immediate value. All phases should be re-prioritised using actual user feedback and available development capacity.

## 18. Definition of done for a phase

A phase is complete only when all of the following are true:

- Its stated user outcome works in the running application.
- Database migrations and API documentation are committed.
- Permission, validation, loading, empty and error states are tested.
- Acceptance criteria are demonstrated with real test data.
- README and setup instructions reflect the current implementation.
- Known limitations and deferred work are documented.
- The feature is committed to Git and can be reproduced from a clean setup.
