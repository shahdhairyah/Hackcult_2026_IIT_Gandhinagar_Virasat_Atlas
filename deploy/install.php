<?php
/**
 * Virasat Atlas - 1-Click Database Installer & Migration Script
 * Automatically sets up schema and authentic heritage seed data on InfinityFree.
 */

header('Content-Type: text/html; charset=utf-8');

$host = 'sql308.infinityfree.com';
$port = '3306';
$dbname = 'if0_43194312_hackcult26';
$user = 'if0_43194312';
$pass = 'WWeqIqyQcPCcYy';

$sqlFile = __DIR__ . '/if0_43194312_hackcult26.sql';

$installed = false;
$error = null;
$installedTables = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['run_install'])) {
    try {
        if (!file_exists($sqlFile)) {
            throw new Exception("SQL dump file not found: {$sqlFile}");
        }

        $dsns = [
            "mysql:host={$host};dbname={$dbname};charset=utf8mb4",
            "mysql:host={$host};port={$port};dbname={$dbname};charset=utf8mb4",
            "mysql:host={$host};dbname={$dbname}"
        ];

        $pdo = null;
        $lastErr = null;
        foreach ($dsns as $dsn) {
            try {
                $pdo = new PDO($dsn, $user, $pass, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_TIMEOUT => 20
                ]);
                break;
            } catch (Exception $e) {
                $lastErr = $e->getMessage();
            }
        }

        if ($pdo === null) {
            throw new Exception("Could not connect to MySQL: {$lastErr}");
        }

        $pdo->exec("SET SESSION sql_mode = 'NO_ENGINE_SUBSTITUTION'");
        $pdo->exec("SET FOREIGN_KEY_CHECKS = 0");

        // Read and parse SQL statements
        $sql = file_get_contents($sqlFile);
        
        // Remove comments
        $lines = explode("\n", $sql);
        $cleanSql = '';
        foreach ($lines as $line) {
            $trimmed = trim($line);
            if (str_starts_with($trimmed, '--') || str_starts_with($trimmed, '/*') || $trimmed === '') {
                continue;
            }
            $cleanSql .= $line . "\n";
        }

        $statements = array_filter(array_map('trim', explode(";\n", $cleanSql)));
        
        foreach ($statements as $stmt) {
            if (!empty($stmt)) {
                try {
                    $pdo->exec($stmt);
                } catch (Exception $se) {
                    // ignore non-fatal duplicate errors
                }
            }
        }

        $pdo->exec("SET FOREIGN_KEY_CHECKS = 1");

        // Fetch installed tables
        $tablesStmt = $pdo->query("SHOW TABLES");
        $installedTables = $tablesStmt->fetchAll(PDO::FETCH_COLUMN);
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
    <title>1-Click Database Installer — Virasat Atlas</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #F7F4EE; color: #17191B; padding: 2rem; margin: 0; }
        .card { max-width: 680px; margin: 0 auto; background: #fff; border-radius: 8px; padding: 2rem; box-shadow: 0 4px 12px rgba(0,0,0,0.08); border: 1px solid #E2D9CB; }
        h1 { color: #8A5A32; font-size: 1.5rem; margin-top: 0; }
        .status-ok { background: #E8F5E9; color: #2E7D32; padding: 1rem; border-radius: 6px; font-weight: 600; margin-bottom: 1.5rem; border: 1px solid #C8E6C9; }
        .status-err { background: #FFEBEE; color: #C62828; padding: 1rem; border-radius: 6px; font-weight: 600; margin-bottom: 1.5rem; border: 1px solid #FFCDD2; }
        .btn { display: inline-block; background: #8A5A32; color: #fff; padding: 0.75rem 1.5rem; text-decoration: none; border-radius: 6px; font-weight: 600; border: none; cursor: pointer; font-size: 1rem; }
        .btn:hover { background: #714725; }
        .btn-sec { background: #315B73; margin-left: 0.5rem; }
        table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
        td, th { padding: 0.5rem 0.75rem; border-bottom: 1px solid #EEE8DD; text-align: left; font-size: 0.9rem; }
        code { background: #EEE8DD; padding: 2px 6px; border-radius: 4px; font-size: 0.85rem; }
        .info-box { background: #F7F4EE; border: 1px solid #E2D9CB; border-radius: 6px; padding: 1rem; margin-bottom: 1.5rem; }
        .info-grid { display: grid; grid-template-columns: 140px 1fr; gap: 0.5rem; font-size: 0.9rem; }
        .info-label { color: #6E685E; font-weight: 500; }
        .info-val { font-family: monospace; font-weight: 600; color: #17191B; }
    </style>
</head>
<body>
<div class="card">
    <h1>Virasat Atlas — Database Migration & Setup</h1>
    <p>This utility sets up all required database tables and seeds authentic Gujarat cultural heritage data for <strong>Virasat Atlas</strong>.</p>

    <div class="info-box">
        <div class="info-grid">
            <div class="info-label">Host:</div>
            <div class="info-val"><?= htmlspecialchars($host) ?></div>
            <div class="info-label">Database:</div>
            <div class="info-val"><?= htmlspecialchars($dbname) ?></div>
            <div class="info-label">User:</div>
            <div class="info-val"><?= htmlspecialchars($user) ?></div>
            <div class="info-label">Domain:</div>
            <div class="info-val">hackcult26.gt.tc</div>
        </div>
    </div>

    <?php if ($installed): ?>
        <div class="status-ok">
            ✓ Database installation completed successfully!
        </div>
        <h3>Configured Tables (<?= count($installedTables) ?>):</h3>
        <table>
            <thead>
                <tr style="background: #F7F4EE;">
                    <th>Table Name</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($installedTables as $tbl): ?>
                    <tr>
                        <td><code><?= htmlspecialchars($tbl) ?></code></td>
                        <td><span style="color: #2E7D32; font-weight: 600;">Active</span></td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>

        <div style="margin-top: 2rem;">
            <a href="/" class="btn">🚀 Open Virasat Atlas</a>
            <a href="/test-db.php" class="btn btn-sec">Run Database Diagnostic</a>
        </div>

    <?php else: ?>

        <?php if ($error): ?>
            <div class="status-err">
                <strong>Error during setup:</strong> <?= htmlspecialchars($error) ?>
            </div>
        <?php endif; ?>

        <form method="POST">
            <p style="margin-bottom: 1.5rem; color: #555;">
                Click the button below to connect to MySQL on <code><?= htmlspecialchars($host) ?></code>, create the 11 archival tables, and seed monuments, digital twins, and user roles.
            </p>
            <button type="submit" name="run_install" value="1" class="btn">
                ⚡ Run 1-Click Database Setup Now
            </button>
            <a href="/test-db.php" class="btn btn-sec">Check Connection First</a>
        </form>

        <p style="margin-top: 2rem; font-size: 0.85rem; color: #888;">
            <em>Note: You can also import <code>if0_43194312_hackcult26.sql</code> directly via phpMyAdmin in your InfinityFree cPanel.</em>
        </p>

    <?php endif; ?>
</div>
</body>
</html>
