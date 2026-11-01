<?php
/**
 * Virasat Atlas - Remote MySQL Connection Diagnostic Tool
 * Used to verify database connection from within InfinityFree hosting.
 */

header('Content-Type: text/html; charset=utf-8');

$host = 'sql308.infinityfree.com';
$port = '3306';
$dbname = 'if0_43194312_hackclt26';
$user = 'if0_43194312';
$pass = 'WWeqIqyQcPCcYy';

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Database Diagnostic — Virasat Atlas</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #F7F4EE; color: #17191B; padding: 2rem; margin: 0; }
        .card { max-width: 720px; margin: 0 auto; background: #fff; border-radius: 8px; padding: 2rem; box-shadow: 0 4px 12px rgba(0,0,0,0.08); border: 1px solid #E2D9CB; }
        h1 { color: #8A5A32; font-size: 1.5rem; margin-top: 0; }
        .status-ok { background: #E8F5E9; color: #2E7D32; padding: 0.85rem 1.15rem; border-radius: 6px; font-weight: 600; margin-bottom: 1.25rem; border: 1px solid #C8E6C9; }
        .status-err { background: #FFEBEE; color: #C62828; padding: 0.85rem 1.15rem; border-radius: 6px; font-weight: 600; margin-bottom: 1.25rem; border: 1px solid #FFCDD2; }
        table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
        td, th { padding: 0.65rem; border-bottom: 1px solid #EEE8DD; text-align: left; font-size: 0.9rem; }
        .btn { display: inline-block; background: #8A5A32; color: #fff; padding: 0.65rem 1.25rem; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 1.25rem; }
        code { background: #EEE8DD; padding: 2px 6px; border-radius: 4px; font-size: 0.85rem; }
    </style>
</head>
<body>
<div class="card">
    <h1>Virasat Atlas — Database Diagnostic</h1>
    <p>Target Server: <code><?= htmlspecialchars($host) ?></code> &bull; Database: <code><?= htmlspecialchars($dbname) ?></code> &bull; User: <code><?= htmlspecialchars($user) ?></code></p>

    <?php
    $pdo = null;
    $dsns = [
        "mysql:host={$host};dbname={$dbname};charset=utf8mb4",
        "mysql:host={$host};port={$port};dbname={$dbname};charset=utf8mb4",
        "mysql:host={$host};dbname={$dbname}"
    ];

    $lastError = null;
    foreach ($dsns as $dsn) {
        try {
            $pdo = new PDO($dsn, $user, $pass, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_TIMEOUT => 10
            ]);
            break;
        } catch (Exception $e) {
            $lastError = $e->getMessage();
        }
    }

    if ($pdo === null) {
        echo '<div class="status-err">Connection Failed: ' . htmlspecialchars($lastError) . '</div>';
        echo '<p>Troubleshooting steps:</p>';
        echo '<ul>';
        echo '<li>Ensure your MySQL database <code>' . htmlspecialchars($dbname) . '</code> was created in InfinityFree cPanel.</li>';
        echo '<li>Verify that the password matches your InfinityFree vPPanel account password.</li>';
        echo '<li>Confirm that MySQL Hostname is <code>' . htmlspecialchars($host) . '</code>.</li>';
        echo '</ul>';
    } else {
        echo '<div class="status-ok">Connected to MySQL successfully!</div>';

        // Disable ONLY_FULL_GROUP_BY for current session
        try {
            $pdo->exec("SET SESSION sql_mode = 'NO_ENGINE_SUBSTITUTION'");
        } catch (Exception $e) {}

        // Check tables
        $stmt = $pdo->query("SHOW TABLES");
        $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);

        echo '<h3>Database Tables (' . count($tables) . ')</h3>';
        if (empty($tables)) {
            echo '<p style="color: #875B19; font-weight: 500;">⚠️ The database is currently empty (0 tables). The application will auto-initialize, or you can click below to initialize immediately:</p>';
            echo '<a href="install.php" class="btn">Run 1-Click Installer (install.php)</a>';
        } else {
            echo '<table>';
            echo '<thead><tr style="background: #F7F4EE;"><th>Table Name</th><th>Row Count</th><th>Status</th></tr></thead>';
            echo '<tbody>';
            foreach ($tables as $t) {
                $count = $pdo->query("SELECT COUNT(*) FROM `{$t}`")->fetchColumn();
                echo "<tr><td><code>" . htmlspecialchars($t) . "</code></td><td>" . (int)$count . "</td><td><span style='color: #2E7D32;'>Ready</span></td></tr>";
            }
            echo '</tbody></table>';

            // Test Query
            try {
                $pubCount = $pdo->query("SELECT COUNT(*) FROM archive_items WHERE status = 'published'")->fetchColumn();
                echo "<p style='margin-top: 1rem; color: #2E7D32;'><strong>API Query Test:</strong> Successfully retrieved {$pubCount} published archive records.</p>";
            } catch (Exception $qe) {
                echo "<p style='margin-top: 1rem; color: #C62828;'><strong>API Query Test Error:</strong> " . htmlspecialchars($qe->getMessage()) . "</p>";
            }

            echo '<div style="margin-top: 1.5rem; display: flex; gap: 1rem;">';
            echo '<a href="/" class="btn">🚀 Open Virasat Atlas</a>';
            echo '<a href="/api/v1/health" class="btn" style="background: #315B73;">Verify /api/v1/health</a>';
            echo '</div>';
        }
    }
    ?>
</div>
</body>
</html>
