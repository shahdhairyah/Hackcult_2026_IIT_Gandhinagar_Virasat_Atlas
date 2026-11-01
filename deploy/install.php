<?php
/**
 * Virasat Atlas — One-Click Database Installer
 * DELETE THIS FILE AFTER INSTALLATION
 *
 * Visit: http://hackcult26.gt.tc/install.php
 */

$host    = 'sql308.infinityfree.com';
$db      = 'if0_43194312_hackcult26';
$user    = 'if0_43194312';
$pass    = 'WWeqIqyQcPCcYy';
$sqlFile = __DIR__ . '/if0_43194312_hackcult26.sql';

header('Content-Type: text/html; charset=UTF-8');
$log = [];

function log_msg(string $msg, bool $ok = true): void {
    global $log;
    $log[] = ['msg' => $msg, 'ok' => $ok];
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $pdo = new PDO("mysql:host={$host};dbname={$db};charset=utf8mb4", $user, $pass, [
            PDO::ATTR_TIMEOUT => 8,
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        ]);
        log_msg('✅ Connected to database');

        // Disable FK checks during import
        $pdo->exec('SET FOREIGN_KEY_CHECKS=0');

        if (!file_exists($sqlFile)) {
            log_msg('❌ SQL file not found: ' . basename($sqlFile), false);
        } else {
            $sql = file_get_contents($sqlFile);
            // Split on statement boundaries
            $statements = preg_split('/;\s*\n/', $sql, -1, PREG_SPLIT_NO_EMPTY);
            $count = 0;
            foreach ($statements as $stmt) {
                $stmt = trim($stmt);
                if ($stmt === '' || stripos($stmt, '--') === 0) continue;
                try {
                    $pdo->exec($stmt);
                    $count++;
                } catch (Exception $ex) {
                    log_msg('⚠ Statement skipped: ' . substr($stmt, 0, 80) . '… ' . $ex->getMessage(), false);
                }
            }
            log_msg("✅ Imported {$count} SQL statements");
        }

        $pdo->exec('SET FOREIGN_KEY_CHECKS=1');
        $tables = $pdo->query('SHOW TABLES')->fetchAll(PDO::FETCH_COLUMN);
        log_msg('✅ Tables present: ' . implode(', ', $tables));

    } catch (Exception $e) {
        log_msg('❌ Fatal: ' . $e->getMessage(), false);
    }
}
?>
<!DOCTYPE html>
<html>
<head><title>Virasat Atlas – Installer</title>
<style>body{font-family:sans-serif;background:#0f172a;color:#e2e8f0;padding:3em;max-width:700px;margin:0 auto}
h1{color:#f59e0b}button{background:#f59e0b;color:#000;border:none;padding:12px 24px;font-size:1rem;cursor:pointer;border-radius:6px}
button:hover{background:#d97706}.ok{color:#4ade80}.err{color:#f87171}
li{padding:4px 0;list-style:none}</style></head>
<body>
<h1>🏛 Virasat Atlas Installer</h1>
<p>This will import the database schema and seed data into <strong><?= htmlspecialchars($db) ?></strong>.</p>
<?php if (!empty($log)): ?>
<h2>Results</h2>
<ul>
<?php foreach ($log as $entry): ?>
  <li class="<?= $entry['ok'] ? 'ok' : 'err' ?>"><?= htmlspecialchars($entry['msg']) ?></li>
<?php endforeach; ?>
</ul>
<?php if (end($log)['ok']): ?>
  <p class="ok">✅ Installation complete! <a href="/" style="color:#f59e0b">Go to the app →</a></p>
  <p class="err">⚠ Delete install.php and the .sql file now for security.</p>
<?php endif; ?>
<?php else: ?>
<form method="POST">
  <button type="submit">Run Installation</button>
</form>
<?php endif; ?>
</body></html>

