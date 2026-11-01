# Virasat Atlas — InfinityFree Deployment Guide

This guide explains how to deploy the **Virasat Atlas** application to your InfinityFree hosting at **`http://hackcult26.gt.tc`**.

---

## 1. Hosting & Database Information

| Parameter | Value |
|---|---|
| **Website URL** | **`http://hackcult26.gt.tc`** |
| **MySQL Hostname** | **`sql308.infinityfree.com`** |
| **MySQL Database** | **`if0_43194312_hackcult26`** |
| **MySQL Username** | **`if0_43194312`** |
| **MySQL Password** | `WWeqIqyQcPCcYy` |
| **Hosting Web Root** | `/htdocs` (or `/hackcult26.gt.tc/htdocs`) |

---

## 2. Key Architecture Fixes Included in this Build

1. **Zero-Crash Resilient Architecture**:
   - Built-in graceful offline fallback mode: If the remote MySQL connection is not yet configured, is delayed, or during maintenance, the website **never crashes with a 500 error**. It seamlessly serves the authentic Gujarat heritage dataset and allows logging in.
   - When the MySQL database is imported or reachable, the application automatically switches to live MySQL mode with full database reads, writes, contributions, and reviews.
2. **Correct Database Configuration**:
   - Fully configured for `if0_43194312_hackcult26` on `sql308.infinityfree.com`.
3. **Apache 2.4 & InfinityFree Friendly Routing**:
   - Modern `.htaccess` rules prevent infinite rewrite loops and handle client-side SPA routing (`index.html`) alongside API routing (`api/index.php`).
4. **Diagnostic & Setup Tools**:
   - `test-db.php`: Visual real-time verification of database connectivity and table counts.
   - `install.php`: 1-click automatic schema creator and data seeder.
   - `if0_43194312_hackcult26.sql`: Standalone MariaDB/MySQL dump ready for phpMyAdmin import.

---

## 3. How to Deploy (Step-by-Step)

### Option A: 1-Click Upload via cPanel File Manager (Recommended)
1. In your local project root, locate **`deploy.zip`** (220 KB).
2. Log into the [InfinityFree Control Panel](https://cpanel.epizy.com/).
3. Open the **Online File Manager**.
4. Navigate into your website's **`htdocs`** folder (if you see multiple domain folders, navigate to `hackcult26.gt.tc/htdocs/`).
5. Delete any old files or previous test files in that folder.
6. Click **Upload** and upload **`deploy.zip`**.
7. Right-click **`deploy.zip`** in the file list and choose **Extract**.
8. Confirm that the extracted files are directly in `htdocs/`:
   - `index.html`
   - `.htaccess`
   - `assets/`
   - `api/`
   - `install.php`
   - `test-db.php`
   - `if0_43194312_hackcult26.sql`

---

## 4. Verifying & Initializing Your Database

1. Open your browser and visit:
   ```text
   http://hackcult26.gt.tc/test-db.php
   ```
   - If connected and tables exist: You will see a green **"Connected to MySQL successfully!"** badge with the table list.
   - If the database is empty: Click the **"Run 1-Click Installer"** button (or visit `http://hackcult26.gt.tc/install.php`) to create and seed all 11 tables in 1 click.
   - *Alternative*: You can also import `if0_43194312_hackcult26.sql` directly into phpMyAdmin inside your InfinityFree cPanel.

2. Verify API Health:
   ```text
   http://hackcult26.gt.tc/api/v1/health
   ```

---

## 5. Demo Login Credentials

The following pre-configured credentials are ready for testing on `http://hackcult26.gt.tc/login`:

| Role | Email | Password | Access Capabilities |
|---|---|---|---|
| **Researcher** | `researcher@virasat.org` | `password123` | Workspace, contribution forms, media uploads |
| **Reviewer** | `reviewer@virasat.org` | `password123` | Editorial review queue, approve/reject items, OCR editor |
| **Administrator** | `admin@virasat.org` | `password123` | Governance dashboard, user management, audit logs, OAIS export |
| **Visitor** | `visitor@virasat.org` | `password123` | Public catalogue discovery, 3D monument viewer, research bookmarks |
