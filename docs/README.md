# Virasat Atlas

**Map-first digital heritage archive**  
Challenge: **HC26-CULT01 - Digital Revitalisation of Unstructured Cultural & Architectural Heritage Archives**  
Event: **Blithchron '27, IIT Gandhinagar**  
Core stack: **React.js + PHP REST API + MySQL 8+**

> Virasat Atlas turns scattered photographs, documents and field observations into structured cultural records that people can search, understand, locate and explore through curated collections.

---

## 1. What the project does

Virasat Atlas is a digital archive and discovery platform for cultural and architectural heritage. It gives researchers a structured way to contribute records and gives the public a map-first experience for exploring approved material.

**Starter-kit status:** this package includes a runnable React landing-page scaffold, a PHP/MySQL health endpoint, a database schema and the full implementation specifications. The contribution, moderation, catalogue, map and collections modules are specified in the documents and task backlog; they still need to be implemented before the prototype can be described as feature-complete.

### MVP capabilities

- Researcher sign-in and role-based workspaces.
- Archive record creation, editing and media upload.
- Structured metadata for place, period, language, contributor, source and rights.
- Review queue with approve/reject/request-correction workflow.
- Public catalogue with keyword search, filters and pagination.
- Archive detail pages with media, provenance and attribution.
- Leaflet map for geotagged public records.
- Curated collections / heritage trails.
- OCR-ready transcription workflow; OCR output remains unverified until human review.

### Deliberate MVP boundaries

Automatic 3D reconstruction, production-grade multilingual semantic search and automatic translation are roadmap items, not assumptions about the current prototype. Build the contribution-to-discovery journey first.

## Architecture at a glance

![Virasat Atlas system architecture](docs/assets/architecture.png)

The core archive data model is documented here:

![Virasat Atlas entity relationship diagram](docs/assets/erd.png)

## 2. Technology stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Vite, React Router |
| Styling | CSS Modules or Tailwind CSS (choose one for the codebase) |
| Backend | PHP 8.2+ REST API |
| Database | MySQL 8+ / InnoDB / `utf8mb4` |
| DB access | PDO prepared statements |
| Map | Leaflet + OpenStreetMap |
| Search | MySQL FULLTEXT + relational filters |
| Media | Private filesystem storage for MVP; object storage later |
| OCR | Optional browser-side Tesseract.js or a replaceable OCR adapter |

## 3. Repository layout

```text
virasat-atlas/
├── client/                    # React + Vite application
│   └── src/
│       ├── app/
│       ├── api/
│       ├── components/
│       ├── features/
│       │   ├── auth/
│       │   ├── archive/
│       │   ├── search/
│       │   ├── map/
│       │   ├── collections/
│       │   ├── workspace/
│       │   └── review/
│       └── styles/
├── api/                       # PHP REST API
│   ├── index.php
│   ├── router.php
│   ├── src/
│   │   ├── Config/
│   │   ├── Middleware/
│   │   ├── Controllers/
│   │   ├── Services/
│   │   ├── Repositories/
│   │   └── Validators/
│   └── storage/               # private uploads; not public web root
├── database/
│   └── schema.sql
├── docs/
│   └── assets/                # architecture and ER diagrams
├── prd.md
├── architecture.md
├── design.md
├── memory.md
├── phase.md
├── rules.md
├── tasks.md
└── README.md
```

## 4. Prerequisites

- Node.js 20+ and npm.
- PHP 8.2+ with PDO MySQL enabled.
- MySQL 8+.
- Git.
- A web server/reverse proxy for deployment (Apache or Nginx recommended).

## 5. Local setup

### Step 1 - Clone and configure

```bash
git clone <YOUR_PUBLIC_REPOSITORY_URL>
cd virasat-atlas
```

Create the frontend and backend environment configuration. Do not commit secrets.

```bash
cp client/.env.example client/.env
cp api/.env.example api/.env
```

Example frontend environment (`client/.env`):

```dotenv
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

Example backend environment (`api/.env`; the starter PHP bootstrap loads this file locally):

```dotenv
APP_ENV=local
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000
APP_ALLOWED_ORIGIN=http://localhost:5173
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=virasat_atlas
DB_USERNAME=root
DB_PASSWORD=change_me
SESSION_SECURE_COOKIE=false
MEDIA_STORAGE_PATH=/absolute/path/to/private-storage
MAX_UPLOAD_MB=20
```

Never use the example credentials in a deployed environment.

### Step 2 - Create the database

```sql
CREATE DATABASE virasat_atlas
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;
```

Import the schema:

```bash
mysql -u root -p virasat_atlas < database/schema.sql
```

Create a first administrator using a one-time setup script or a secure CLI command that hashes the password with PHP `password_hash()`. Do not insert a plaintext password into SQL.

### Step 3 - Start the PHP API

Configure the PHP runtime to read the environment values above. Ensure the media storage directory exists and is writable by PHP, but is not inside the public web root.

```bash
cd api
php -S 127.0.0.1:8000 router.php
```

The API entry point should expose `/api/v1/health` and application routes through the front controller. For production, use PHP-FPM with Nginx/Apache rather than the built-in development server.

### Step 4 - Start React

```bash
cd client
npm install
npm run dev
```

Open the Vite URL printed in the terminal (normally `http://localhost:5173`).

### Step 5 - Production build

```bash
cd client
npm run build
```

Serve the generated `dist/` directory as static frontend assets and route `/api/v1` to PHP. Prefer same-origin deployment to simplify secure session cookies and CSRF protection.

## 6. API conventions

Base URL: `/api/v1`

Successful response:

```json
{
  "data": {},
  "meta": { "page": 1, "per_page": 20, "total": 0 },
  "error": null
}
```

Validation error:

```json
{
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please correct the highlighted fields.",
    "fields": { "title": "Title is required." }
  }
}
```

### Core endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/login` | Login |
| POST | `/auth/logout` | Logout |
| GET | `/auth/me` | Current user |
| GET | `/archive-items` | Public catalogue/search/filter |
| POST | `/archive-items` | Create draft (researcher+) |
| GET | `/archive-items/{id}` | View accessible record |
| PATCH | `/archive-items/{id}` | Update allowed metadata |
| POST | `/archive-items/{id}/media` | Upload attachment |
| GET | `/locations` | Public map data |
| GET | `/collections` | Public collections |
| POST | `/collections` | Create collection (reviewer/admin) |
| GET | `/review-queue` | Pending submissions |
| POST | `/archive-items/{id}/review` | Approve/reject/return |

See `architecture.md` for the full API baseline and access rules.

## 7. Roles and visibility

- `visitor`: public published content only.
- `researcher`: create/edit own drafts and submit for review.
- `reviewer`: review submissions and curate collections.
- `admin`: manage users, roles, taxonomy and configuration.

Public endpoints must return only records with `status='published'` and `visibility='public'`. This rule is enforced in PHP/SQL, not only in React.

## 8. Data model

The baseline schema is in `database/schema.sql`. It includes users, locations, archive items, media assets, tags, collections, OCR jobs and audit logs. Files are stored separately from MySQL; the database records their storage keys and metadata.

## 9. Security checklist

- [ ] Passwords use `password_hash()` / `password_verify()`.
- [ ] PDO prepared statements used for all dynamic SQL.
- [ ] Role and ownership checks run on the server.
- [ ] Session cookies are HttpOnly, Secure in HTTPS and SameSite-configured.
- [ ] CSRF protection is enabled for cookie-authenticated write requests.
- [ ] CORS uses an exact origin allowlist if cross-origin is required.
- [ ] Upload size, MIME, extension and generated filename are validated.
- [ ] Uploads are outside the public web root and cannot execute.
- [ ] Private/draft records are not returned by public endpoints.
- [ ] No `.env`, private media or credentials in Git.
- [ ] Demo material has documented source and rights/permission.

## 10. Demo content and ethical use

Use a small, coherent set of authentic, rights-cleared records: for example, a few architectural sites, a craft record and a field note. Provide attribution and licence/permission information. Mark uncertain dates or approximate coordinates clearly. Do not publish restricted site details or community knowledge without permission. Machine-generated OCR should be labelled unreviewed until a person checks it.

## 11. Submission checklist

- [ ] Public GitHub/GitLab repository includes the code and commits made during the hackathon window.
- [ ] README includes architecture diagrams, setup steps and reproducible configuration.
- [ ] Working prototype is deployed and tested.
- [ ] A 2-3 minute unlisted YouTube/Loom walkthrough demonstrates actual working features.
- [ ] Pitch deck is an accessible PDF with at most 10 slides.
- [ ] Deck covers problem, solution, architecture, database schema, stack, scalability, limitations and roadmap.
- [ ] Submission is completed before **4 November 2026, 6:30 PM IST**.

## 12. Documentation index

- `prd.md` - product requirements and acceptance criteria.
- `architectre.md` - system design, API, data flow and security (requested filename; `architecture.md` is the correctly spelled duplicate).
- `desgin.md` - UI/UX system and screen specifications (requested filename; `design.md` is the correctly spelled duplicate).
- `memory.md` - durable project context and locked decisions.
- `phase.md` - delivery phases and deadline plan.
- `rules.md` - engineering, security and data ethics rules.
- `tasks.md` - implementation backlog and acceptance checklist.
- `report.md` and `Virasat_Atlas_Full_Report.pdf/.docx` - full project report.
- `database/schema.sql` - implementation-ready MySQL schema baseline.
