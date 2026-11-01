<?php
/**
 * Virasat Atlas - 1-Click Database Installer & Migration Script
 * Automatically sets up schema and authentic heritage seed data on InfinityFree.
 */

header('Content-Type: text/html; charset=utf-8');

$host = 'sql308.infinityfree.com';
$port = '3306';
$dbname = 'if0_43194312_hackclt26';
$user = 'if0_43194312';
$pass = 'WWeqIqyQcPCcYy';

$sqlFile = __DIR__ . '/if0_43194312_hackclt26.sql';

$installed = false;
$error = null;
$executedStatements = 0;
$installedTables = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['run_install'])) {
    try {
        if (!file_exists($sqlFile)) {
            throw new Exception("SQL dump file not found: {$sqlFile}");
        }

        $dsn = "mysql:host={$host};port={$port};dbname={$dbname};charset=utf8mb4";
        $pdo = new PDO($dsn, $user, $pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_TIMEOUT => 20
        ]);

        $sqlContent = file_get_contents($sqlFile);

        // Split SQL statements cleanly
        $pdo->exec("SET FOREIGN_KEY_CHECKS = 0;");

        // Execute batch SQL
        $pdo->exec($sqlContent);

        $pdo->exec("SET FOREIGN_KEY_CHECKS = 1;");

        $stmt = $pdo->query("SHOW TABLES");
        $installedTables = $stmt->fetchAll(PDO::FETCH_COLUMN);

        $installed = true;
    } catch (Exception $e) {
        $error = $e->getMessage();
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Virasat Atlas — Database Installer</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #F7F4EE; color: #17191B; padding: 2.5rem 1rem; margin: 0; }
        .container { max-width: 720px; margin: 0 auto; background: #fff; border-radius: 8px; padding: 2.5rem; box-shadow: 0 4px 14px rgba(0,0,0,0.08); border: 1px solid #E2D9CB; }
        .brand { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem; }
        .brand-badge { width: 36px; height: 36px; background: #8A5A32; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #fff; font-family: serif; font-size: 1.3rem; font-weight: bold; }
        h1 { color: #17191B; font-size: 1.6rem; margin: 0; }
        p { color: #6F6A61; line-height: 1.5; }
        .status-box { padding: 1rem 1.25rem; border-radius: 6px; margin: 1.5rem 0; font-size: 0.95rem; }
        .status-ok { background: #E8F5E9; color: #2E7D32; border: 1px solid #C8E6C9; }
        .status-err { background: #FFEBEE; color: #C62828; border: 1px solid #FFCDD2; }
        .btn { display: inline-block; background: #8A5A32; color: #fff; padding: 0.75rem 1.5rem; text-decoration: none; border-radius: 6px; font-weight: 600; border: none; cursor: pointer; font-size: 1rem; }
        .btn:hover { background: #734925; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0; background: #FCFAF7; padding: 1.25rem; border-radius: 6px; border: 1px solid #EEE8DD; font-size: 0.88rem; }
        .info-label { color: #6F6A61; text-transform: uppercase; font-size: 0.75rem; font-weight: 600; }
        .info-val { font-weight: 600; color: #17191B; font-family: monospace; }
        .logins-table { width: 100%; border-collapse: collapse; margin-top: 1rem; font-size: 0.85rem; }
        .logins-table td, .logins-table th { padding: 0.5rem 0.75rem; border-bottom: 1px solid #EEE8DD; text-align: left; }
    </style>
</head>
<body>
<div class="container">
    <div class="brand">
        <div class="brand-badge">V</div>
        <div>
            <h1>Virasat Atlas — Database Installer</h1>
            <div style="font-size: 0.8rem; color: #8A5A32; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">InfinityFree Setup</div>
        </div>
    </div>

    <div class="info-grid">
        <div>
            <div class="info-label">MySQL Host</div>
            <div class="info-val"><?= htmlspecialchars($host) ?></div>
        </div>
        <div>
            <div class="info-label">Database Name</div>
            <div class="info-val"><?= htmlspecialchars($dbname) ?></div>
        </div>
        <div>
            <div class="info-label">Database User</div>
            <div class="info-val"><?= htmlspecialchars($user) ?></div>
        </div>
        <div>
            <div class="info-label">Domain Target</div>
            <div class="info-val">hackcult26.gt.tc</div>
        </div>
    </div>

    <?php if ($installed): ?>
        <div class="status-box status-ok">
            <strong>Installation Completed Successfully!</strong><br>
            All 11 relational tables have been created and populated with authentic Gujarat heritage records (Rani ki Vav, Adalaj Stepwell, Modhera Sun Temple, Patan Patola silk weaving, Lothal maritime inscriptions).
        </div>

        <h3>Installed Schema Tables (<?= count($installedTables) ?>)</h3>
        <p style="font-size: 0.85rem; color: #6F6A61;">
            <?= implode(' &bull; ', array_map('htmlspecialchars', $installedTables)) ?>
        </p>

        <h3>Pre-Configured Demonstration Accounts</h3>
        <table class="logins-table">
            <thead>
                <tr style="background: #F7F4EE;">
                    <th>Role</th>
                    <th>Email</th>
                    <th>Password</th>
                    <th>Permissions</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Researcher</strong></td>
                    <td><code>researcher@virasat.org</code></td>
                    <td><code>password123</code></td>
                    <td>Field notes, contributions, drafts, OCR assistant</td>
                </tr>
                <tr>
                    <td><strong>Reviewer</strong></td>
                    <td><code>reviewer@virasat.org</code></td>
                    <td><code>password123</code></td>
                    <td>Review queue, approvals, return for correction</td>
                </tr>
                <tr>
                    <td><strong>Admin</strong></td>
                    <td><code>admin@virasat.org</code></td>
                    <td><code>password123</code></td>
                    <td>Governance dashboard, audit logs, OAIS exports</td>
                </tr>
                <tr>
                    <td><strong>Visitor</strong></td>
                    <td><code>visitor@virasat.org</code></td>
                    <td><code>password123</code></td>
                    <td>Public exploration, map, collections, bookmarks</td>
                </tr>
            </tbody>
        </table>

        <div style="margin-top: 2rem; display: flex; gap: 1rem; align-items: center;">
            <a href="/" class="btn">🚀 Open Virasat Atlas Platform</a>
            <a href="test-db.php" style="color: #8A5A32; font-size: 0.9rem; text-decoration: underline;">Verify Status (test-db.php)</a>
        </div>

    <?php else: ?>
        <?php if ($error): ?>
            <div class="status-box status-err">
                <strong>Database Error:</strong> <?= htmlspecialchars($error) ?>
            </div>
        <?php endif; ?>

        <p>Click the button below to initialize the database tables, create the full relational schema, and insert sample cultural heritage records.</p>

        <form method="POST">
            <input type="hidden" name="run_install" value="1">
            <button type="submit" class="btn">Initialize Database Now</button>
        </form>

        <div style="margin-top: 1.5rem; font-size: 0.85rem; color: #6F6A61;">
            <em>Note: Alternatively, you can import <code>if0_43194312_hackclt26.sql</code> directly via phpMyAdmin in your cPanel.</em>
        </div>
    <?php endif; ?>
</div>
</body>
</html>
