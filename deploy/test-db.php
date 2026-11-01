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
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #F7F4EE; color: #17191B; padding: 2rem; }
        .card { max-width: 650px; margin: 0 auto; background: #fff; border-radius: 8px; padding: 2rem; box-shadow: 0 4px 12px rgba(0,0,0,0.08); border: 1px solid #E2D9CB; }
        h1 { color: #8A5A32; font-size: 1.5rem; margin-top: 0; }
        .status-ok { background: #E8F5E9; color: #2E7D32; padding: 0.75rem 1rem; border-radius: 6px; font-weight: 600; margin-bottom: 1rem; border: 1px solid #C8E6C9; }
        .status-err { background: #FFEBEE; color: #C62828; padding: 0.75rem 1rem; border-radius: 6px; font-weight: 600; margin-bottom: 1rem; border: 1px solid #FFCDD2; }
        table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
        td, th { padding: 0.6rem; border-bottom: 1px solid #EEE8DD; text-align: left; font-size: 0.9rem; }
        .btn { display: inline-block; background: #8A5A32; color: #fff; padding: 0.65rem 1.25rem; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 1.5rem; }
    </style>
</head>
<body>
<div class="card">
    <h1>Virasat Atlas — Database Diagnostic</h1>
    <p>Testing connection to <code><?= htmlspecialchars($host) ?></code> on database <code><?= htmlspecialchars($dbname) ?></code>...</p>

    <?php
    try {
        $dsn = "mysql:host={$host};port={$port};dbname={$dbname};charset=utf8mb4";
        $pdo = new PDO($dsn, $user, $pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_TIMEOUT => 10
        ]);

        echo '<div class="status-ok">Connected to MySQL successfully!</div>';

        // Check tables
        $stmt = $pdo->query("SHOW TABLES");
        $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);

        echo '<h3>Database Tables (' . count($tables) . ')</h3>';
        if (empty($tables)) {
            echo '<p style="color: #875B19;">⚠️ The database is currently empty. Run the installer or import <code>if0_43194312_hackclt26.sql</code> to create all tables and sample heritage records.</p>';
            echo '<a href="install.php" class="btn">Run 1-Click Installer (install.php)</a>';
        } else {
            echo '<ul>';
            foreach ($tables as $t) {
                $countStmt = $pdo->query("SELECT COUNT(*) FROM `{$t}`");
                $count = $countStmt->fetchColumn();
                echo "<li><strong>" . htmlspecialchars($t) . "</strong>: " . (int)$count . " rows</li>";
            }
            echo '</ul>';
            echo '<div style="margin-top: 1.5rem;"><a href="/" class="btn">Go to Virasat Atlas App</a></div>';
        }

    } catch (Exception $e) {
        echo '<div class="status-err">Connection Failed: ' . htmlspecialchars($e->getMessage()) . '</div>';
        echo '<p>Please verify your MySQL hostname, username, and password in cPanel / InfinityFree Client Area.</p>';
    }
    ?>
</div>
</body>
</html>
