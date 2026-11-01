# Virasat Atlas — InfinityFree Deployment Guide

This guide describes how to deploy the **Virasat Atlas** application to your InfinityFree hosting at **`http://hackcult26.gt.tc`**.

---

## 1. Credentials & Configuration Summary

| Setting | Value |
|---|---|
| **Domain** | `http://hackcult26.gt.tc` |
| **MySQL Host** | `sql308.infinityfree.com` |
| **MySQL Database** | `if0_43194312_hackclt26` |
| **MySQL Username** | `if0_43194312` |
| **MySQL Password** | `WWeqIqyQcPCcYy` |
| **Hosting Web Root** | `/htdocs` (or `/hackcult26.gt.tc/htdocs`) |

All configuration files in this `deploy/` folder have already been pre-configured with these exact credentials.

---

## 2. Uploading to `htdocs`

You can use either **cPanel File Manager** or **FTP (FileZilla)**:

### Option A: Upload via cPanel File Manager (Recommended)
1. Log in to your InfinityFree Client Area and open the **Control Panel (cPanel)**.
2. Click **Online File Manager**.
3. Navigate into the **`htdocs`** folder (if your account has multiple domains, open `hackcult26.gt.tc/htdocs`).
4. Delete default placeholder files (e.g. `DO NOT UPLOAD FILES HERE` or default `index2.html` if present).
5. Upload all files and folders located inside the `deploy/` directory:
   - `index.html`
   - `assets/` (folder)
   - `.htaccess`
   - `api/` (folder)
   - `install.php`
   - `test-db.php`
   - `if0_43194312_hackclt26.sql`

*(Tip: You can also upload `deploy.zip` into `htdocs/` and click **Extract**).*

### Option B: Upload via FTP (FileZilla)
1. In FileZilla, connect using your FTP credentials from the InfinityFree dashboard.
2. Open the remote folder **`/htdocs`**.
3. Drag and drop all files and folders from the local `deploy/` directory into `/htdocs`.

---

## 3. Database Initialization (1-Click)

Once files are uploaded, initialize the database using either method below:

### Method 1: Web Installer (Fastest)
1. Open your browser and visit:  
   👉 **`http://hackcult26.gt.tc/install.php`**
2. Click **"Initialize Database Now"**.
3. The script will automatically connect to `sql308.infinityfree.com`, create all 11 tables, and populate authentic Gujarat heritage records (Rani ki Vav, Adalaj Stepwell, Modhera Sun Temple, Patan Patola silk weaving, etc.).

### Method 2: phpMyAdmin Import
1. In your InfinityFree cPanel, click **phpMyAdmin**.
2. Select database **`if0_43194312_hackclt26`** in the left sidebar.
3. Click the **Import** tab at the top.
4. Choose the file **`if0_43194312_hackclt26.sql`** and click **Go**.

---

## 4. Verification & Testing

1. **Verify Database Connectivity:**  
   Visit `http://hackcult26.gt.tc/test-db.php` — you should see a green badge showing all 11 tables and record counts.
2. **Verify PHP REST API:**  
   Visit `http://hackcult26.gt.tc/api/v1/health` — it should return:
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
3. **Launch the Public Application:**  
   Visit **`http://hackcult26.gt.tc`** to explore the public catalog, interactive Leaflet map, 3D digital twin monument viewer, and pitch presentation!

---

## 5. Demonstration Accounts

The database comes pre-seeded with 4 role-based user accounts:

| Role | Email | Password | Access Capabilities |
|---|---|---|---|
| **Researcher** | `researcher@virasat.org` | `password123` | Ingestion workspace, draft creation, media upload, OCR assistant |
| **Reviewer** | `reviewer@virasat.org` | `password123` | Review queue, approve/reject workflow, collections curation |
| **Admin** | `admin@virasat.org` | `password123` | Platform governance, user roles, system audit log, OAIS manifest export |
| **Visitor** | `visitor@virasat.org` | `password123` | Public catalogue, map view, collections, multilingual toggles |
