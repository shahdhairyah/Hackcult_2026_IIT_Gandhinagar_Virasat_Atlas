# Product Design Specification

## Virasat Atlas - Cultural Archive Discovery Experience

**Design direction:** editorial heritage archive with contemporary research-tool usability.  
**Experience goal:** make the archive feel like a living atlas, not a folder manager or a generic travel listing.

---

## 1. Design principles

1. **Context before decoration:** each photograph should carry its place, source, period and cultural context.
2. **Discover from multiple directions:** search, filters, map and collections must lead to the same canonical archive record.
3. **Trust is visible:** show attribution, rights, source and review status where relevant.
4. **Research workflow remains efficient:** metadata entry and review should be structured and predictable.
5. **Human correction is normal:** OCR and imported metadata are suggestions, never unquestioned truth.
6. **Accessible by default:** keyboard navigation, semantic headings, labelled forms, readable contrast and image alt text.

## 2. Visual identity

### Colour system

Use a warm archival palette with a deep charcoal interface and restrained sandstone/bronze accents. Avoid using colour alone to communicate status.

| Token | Suggested value | Usage |
|---|---|---|
| `ink-950` | `#17191B` | Main dark surfaces / footer |
| `ink-800` | `#282C2F` | Sidebar, navigation, high-contrast panels |
| `paper-50` | `#F7F4EE` | Primary light canvas |
| `paper-100` | `#EEE8DD` | Secondary canvas and separators |
| `stone-600` | `#6F6A61` | Secondary text on light canvas |
| `bronze-600` | `#8A5A32` | Primary accent / active links |
| `sand-300` | `#D9C4A2` | Subtle highlight and chart accent |
| `blue-700` | `#315B73` | Information state / focus treatment |
| `red-700` | `#9A3D35` | Error / destructive state |
| `amber-700` | `#875B19` | Warning / needs review |

Check text/background combinations for WCAG contrast before implementation. Use neutral borders and visible focus rings. Do not rely on bronze or amber alone to indicate workflow state; pair colour with text and icons.

### Typography

- Headings: a restrained serif such as `Georgia` or a licensed editorial serif available in the deployment environment.
- UI/body: `Inter`, `system-ui`, or another neutral sans-serif.
- Metadata: same sans-serif with consistent label/value hierarchy.
- Use a compact type scale: 12 px helper, 14 px metadata, 16 px body, 20 px section heading, 28-36 px page heading.

### Imagery

- Prioritise authentic field photographs and archival scans with explicit permission/attribution.
- Use a consistent 4:3 or 3:2 thumbnail crop; retain a full-screen/original view on detail pages.
- Never fabricate historical images or use generated imagery as documentary evidence.
- Show a neutral placeholder when an item has no media.

## 3. Information architecture and navigation

### Public navigation

`Explore | Map | Collections | About the Archive`

### Authenticated navigation

`My Workspace | Contribute | Review Queue` (role-dependent) and account menu.

### Primary page hierarchy

```text
Explore
  -> Search results / filters
  -> Archive item detail
  -> Location detail
  -> Collection / heritage trail
Workspace
  -> My drafts
  -> New contribution / edit record
  -> Submission status
Review
  -> Pending queue
  -> Record review
Admin
  -> Users and roles
  -> Tags / categories
```

## 4. Key screens

### 4.1 Landing / Explore page

**Purpose:** communicate what the archive contains and make discovery immediate.

Recommended layout:

- Top navigation with logo, Explore, Map, Collections and sign-in.
- Hero section: headline such as **“Explore India's cultural memory, one place at a time.”** with search field and a short explanatory sentence.
- Search controls: keyword, region, item type and language; filters open in a responsive drawer on small screens.
- Featured collections row using documentary images and clear labels.
- Latest/featured archive cards with image, title, location, period label and item type.
- Footer with archive principles, attribution and contact route.

Avoid fake counters or unsupported claims such as “10,000+ records” unless populated from real data.

### 4.2 Search results

- Query remains visible in the search field.
- Show active filters as removable chips and a clear-all action.
- Show result count and sort control.
- Provide list/grid and map toggle.
- Cards use title, short summary, place, type and date/period when known.
- Include empty state with suggestions to change terms or filters.
- Paginate on the server; preserve filters when opening a record and returning to results.

### 4.3 Archive item detail

Recommended order:

1. Breadcrumb and record title.
2. Primary media viewer/gallery with caption and alt text.
3. Short summary and long description.
4. Metadata panel: place, coordinates (if appropriate), capture/source date, period, language, creator and item type.
5. Provenance and rights panel: source, contributor, licence/permission and attribution.
6. Transcript section with clear “machine-extracted - reviewed/unreviewed” label.
7. Related records and collections.

Do not conflate a modern photograph's capture date with the monument's historical period.

### 4.4 Map exploration

- Use Leaflet with OpenStreetMap tiles and visible tile attribution.
- Provide list/map toggle so map access is not the only navigation method.
- Cluster markers at lower zoom levels if density requires it.
- Marker preview includes title, thumbnail and location label.
- Support keyboard-accessible result list synchronized with map selection.
- Show a location precision note when coordinates are approximate.
- If tiles fail to load, keep the result list usable.

### 4.5 Collections and heritage trails

A collection may represent a theme (stepwells), a region, an architectural style or a documented field route. Each collection contains:

- Title, summary, cover image, curator/source and publication status.
- Ordered archive items.
- Optional route/map presentation when locations are available.
- Context notes explaining why the items are grouped.

Never imply a navigable public route if sequence, access or safety information is unknown.

### 4.6 Researcher contribution form

Use a clear multi-section form rather than one very long unstructured page:

- **Record:** title, item type, summary and description.
- **Place and time:** place, coordinates, capture date and period label.
- **Sources:** creator, institution, field note/source reference and language.
- **Media:** upload files, set primary image, add captions and alt text.
- **Rights:** permission/licence and attribution.
- **Tags and transcript:** add tags; paste or review OCR text.
- **Submit:** save draft or submit for review.

Show upload progress and file constraints before upload. Preserve entered data after an upload failure.

### 4.7 Review queue and reviewer workspace

- Filter by pending status, submitter and item type.
- Show a compact side-by-side source and metadata review.
- Clearly label OCR as raw extraction or reviewed transcript.
- Require a reason when rejecting or returning an item.
- Display missing required rights/attribution fields before approval.
- Confirm before publishing publicly.

## 5. Reusable component inventory

| Component | Responsibilities |
|---|---|
| `SiteHeader` | Navigation, account menu and responsive layout |
| `SearchBar` | Query input and submit behaviour |
| `FilterPanel` | Region, type, language, period and tags |
| `ArchiveCard` | Documentary thumbnail and key metadata |
| `MediaViewer` | Image/document preview and captions |
| `MetadataList` | Consistent label/value rendering |
| `RightsNotice` | Licence, permission and attribution display |
| `MapExplorer` | Leaflet map, markers and selected item preview |
| `CollectionCard` | Curated collection preview |
| `StatusBadge` | Text + icon + colour for workflow state |
| `UploadDropzone` | File picker, validation summary and progress |
| `TranscriptEditor` | Raw and reviewed transcript comparison |
| `EmptyState` | Actionable no-results or no-content state |
| `ErrorState` | Safe error message and retry option |

## 6. Interaction and content rules

- Search supports Enter and a visible submit button.
- Filters should update results only after an explicit Apply action on mobile; desktop may update immediately if performance is acceptable.
- Every form field has a persistent label; placeholders are examples, not labels.
- Destructive actions require confirmation and must be logged.
- Upload failures must explain whether the file was rejected, too large or temporarily unavailable.
- Preserve original OCR output; reviewed text is stored separately.
- Distinguish “unknown” from blank, “approximate” from exact and “not verified” from “verified”.
- Do not fabricate dates, creators, coordinates, historical narratives or counts to make the UI look complete.

## 7. Responsive behaviour

| Viewport | Layout behaviour |
|---|---|
| Small mobile (360-430 px) | Single column; filters in drawer; map/list switch; tap-friendly controls |
| Tablet | Two-column cards where useful; map and list can share space |
| Desktop | Wider catalogue grid; persistent filters; split map/list layout |
| Large desktop | Constrained reading width for detail content; map can use wider canvas |

## 8. Accessibility checklist

- Semantic landmarks (`header`, `nav`, `main`, `footer`).
- Logical heading order and skip-to-content link.
- Full keyboard operation for menus, dialogs, forms and result navigation.
- Visible focus indicators and no keyboard traps.
- Text labels and associated error messages for every input.
- Alt text for meaningful images; decorative images use empty alt text.
- Map interaction has an equivalent accessible list.
- Status states use text, not colour alone.
- Respect reduced-motion preferences.
- Check contrast for text, controls and focus rings.

## 9. Usability test script

Ask a first-time user to complete these tasks without coaching:

1. Find a record about a stepwell in a named region.
2. Open the record and identify who supplied the photograph and what usage rights are listed.
3. Locate the same item on the map.
4. Open a collection that contains the item.
5. As a researcher, upload a photo and save it as a draft.

Record completion, time, confusion points and any accessibility blockers. Fix broken primary flows before adding visual effects.
