# Virasat Atlas — InfinityFree Deployment Guide

This guide explains how to deploy the **Virasat Atlas** application to your InfinityFree hosting at **`http://hackcult26.gt.tc`**.

---

## 1. Credentials & Configuration Summary

| Setting | Value |
|---|---|
| **Website URL** | **`http://hackcult26.gt.tc`** |
| **MySQL Host** | `sql308.infinityfree.com` |
| **MySQL Database** | **`if0_43194312_hackcult26`** |
| **MySQL Username** | `if0_43194312` |
| **MySQL Password** | `WWeqIqyQcPCcYy` |
| **Hosting Web Root** | `/htdocs` (or `/hackcult26.gt.tc/htdocs`) |

---

## 2. Issues Fixed in this Build

1. **Database Name Corrected:**  
   Updated database name to `if0_43194312_hackcult26` (with 'u' in cult).
2. **MySQL `ONLY_FULL_GROUP_BY` (Error 1055) Resolved:**  
   Removed conflicting `GROUP BY` clauses across `ArchiveItemRepository` and `CollectionRepository` that caused the home page query to crash on modern MySQL servers. Session SQL mode is also set to `NO_ENGINE_SUBSTITUTION`.
3. **Automatic Self-Healing Database Initialization:**  
   `Database::getConnection()` automatically checks if the `archive_items` and `users` tables exist. If the database is fresh/empty, it automatically creates all 11 tables and populates authentic seed records on the very first request!
4. **Safe Session & CORS Handling:**  
   Session initiation is wrapped with headers-sent and exception guards so shared hosting configurations never crash during login.
5. **Transparent Diagnostics:**  
   Global exception handling outputs clear error diagnostics if a database connection issue occurs.

---

## 3. Uploading to `htdocs`

You can use either **cPanel File Manager** or **FTP (FileZilla)**:

### Option A: Upload via cPanel File Manager (Recommended)
1. Log in to your InfinityFree Client Area and open the **Control Panel (cPanel)**.
2. Click **Online File Manager**.
3. Navigate into the **`htdocs`** folder (if your account has multiple domains, open `hackcult26.gt.tc/htdocs`).
4. Delete default placeholder files if present (e.g. `DO NOT UPLOAD FILES HERE` or default `index2.html`).
5. **Upload all files and folders located inside the `deploy/` directory** directly into `htdocs/`:
   - `index.html`
   - `assets/` (folder)
   - `.htaccess`
   - `api/` (folder)
   - `install.php`
   - `test-db.php`
   - `if0_43194312_hackcult26.sql`

*(Tip: You can also upload `deploy.zip` into `htdocs/` and click **Extract**).*

### Option B: Upload via FTP (FileZilla)
1. In FileZilla, connect using your FTP credentials from the InfinityFree dashboard.
2. Open the remote folder **`/htdocs`**.
3. Drag and drop all files and folders from the local `deploy/` directory into `/htdocs`.

---

## 4. Database Setup & Verification

Thanks to the self-healing database initialization, when you open the site for the first time, the tables will automatically initialize!

To verify manually:
1. **Verify Database Connectivity:**  
   Visit **`http://hackcult26.gt.tc/test-db.php`** — you should see a green badge showing all 11 tables and record counts for `if0_43194312_hackcult26`.
2. **Optional 1-Click Installer:**  
   Visit **`http://hackcult26.gt.tc/install.php`** if you wish to run a manual migration or re-seed.
3. **Verify API Health:**  
   Visit **`http://hackcult26.gt.tc/api/v1/health`** — it will return:
   ```json
   {
     "data": {
       "status": "ready",
       "checks": {
         "database": { "status": "healthy", "driver": "mysql" },
         "storage": { "status": "healthy" }
       }
     }
   }
   ```
4. **Launch Application:**  
   Open **`http://hackcult26.gt.tc`** to explore the public catalog, Leaflet map, collections, 3D monument viewer, and pitch deck.

---

## 5. Demonstration Accounts

The database comes pre-seeded with 4 role-based user accounts:

| Role | Email | Password | Access Capabilities |
|---|---|---|---|
| **Researcher** | `researcher@virasat.org` | `password123` | Ingestion workspace, draft creation, media upload, OCR assistant |
| **Reviewer** | `reviewer@virasat.org` | `password123` | Review queue, approve/reject workflow, collections curation |
| **Admin** | `admin@virasat.org` | `password123` | Governance dashboard (`/admin`), audit logs, OAIS manifest export |
| **Visitor** | `visitor@virasat.org` | `password123` | Public catalogue, map view, collections, multilingual toggles |
