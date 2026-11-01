# Virasat Atlas — Deployment Guide (InfinityFree)

## Hosting Details
| Key | Value |
|---|---|
| URL | http://hackcult26.gt.tc |
| Web Root | htdocs/ |
| MySQL Host | sql308.infinityfree.com |
| Database | if0_43194312_hackcult26 |
| Username | if0_43194312 |

---

## Step 1 – Upload Files

Upload **all contents** of this `deploy/` folder directly into your **`htdocs/`** folder using the InfinityFree File Manager or FTP.

Your `htdocs/` should look like this after upload:
```
htdocs/
├── .htaccess           ← root routing (SPA + API)
├── index.html          ← React app
├── assets/             ← JS + CSS bundles
├── api/
│   ├── .htaccess       ← API sub-routing (CRITICAL)
│   ├── .env            ← DB credentials
│   ├── index.php       ← PHP API entry point
│   ├── router.php
│   ├── src/            ← PHP source
│   └── storage/
│       └── uploads/
│           └── .htaccess
├── install.php
├── test-db.php
└── if0_43194312_hackcult26.sql
```

> **IMPORTANT**: Make sure hidden files (`.htaccess`, `.env`) are uploaded — they are invisible by default in most FTP clients. In FileZilla: Server → Force showing hidden files.

---

## Step 2 – Import the Database

1. Visit **http://hackcult26.gt.tc/install.php**
2. Click **Run Installation**
3. Verify all ✅ green messages appear
4. Visit **http://hackcult26.gt.tc/test-db.php** to confirm DB + extensions

---

## Step 3 – Test the API

Open in browser or Postman:
- `http://hackcult26.gt.tc/api/v1/health` → should return `{"data":{"status":"ready",...}}`
- `http://hackcult26.gt.tc/api/v1/archive-items` → returns archive items

If you see JSON — it's working. If you see HTML — the `.htaccess` routing isn't being applied (see troubleshooting below).

---

## Step 4 – Cleanup (Security)

After successful deployment, **delete these files** from htdocs:
- `install.php`
- `test-db.php`
- `if0_43194312_hackcult26.sql`

---

## Default Login Credentials

If the database import fails or the DB is unreachable, the app has **offline fallback mode** with these built-in accounts:

| Role | Email | Password |
|---|---|---|
| Admin | admin@virasat.org | password123 |
| Curator | curator@virasat.org | password123 |
| Public | user@virasat.org | password123 |

---

## Troubleshooting

### "Network error: Unable to connect to the Virasat Atlas API"
This means Apache is NOT routing `/api/*` calls to PHP. Check:
1. Both `.htaccess` files uploaded (root AND `api/.htaccess`)
2. InfinityFree File Manager → check `.htaccess` visible with "Show Hidden Files"
3. Visit `http://hackcult26.gt.tc/api/index.php` directly — if you get JSON it's working
4. InfinityFree may take 5–10 min for `.htaccess` changes to propagate

### "A server error occurred"
1. Visit `/test-db.php` — check DB connection result
2. InfinityFree MySQL sometimes has a 500ms connection delay — the API has 3s timeout built in
3. Check that `api/.env` has the correct credentials

### Blank page / 500 on index.html
- InfinityFree may cache aggressively. Clear with Ctrl+Shift+R
- Make sure `assets/` folder was uploaded with contents

### PHP version
InfinityFree runs PHP 8.x. This app requires PHP 7.4+. ✅
