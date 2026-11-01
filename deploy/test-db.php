<?php
/**
 * Virasat Atlas — Database & Routing Diagnostic Tool
 * DELETE THIS FILE AFTER VERIFICATION
 */

// Prevent caching
header('Cache-Control: no-store');
header('Content-Type: text/html; charset=UTF-8');

$host = 'sql308.infinityfree.com';
$db   = 'if0_43194312_hackcult26';
$user = 'if0_43194312';
$pass = 'WWeqIqyQcPCcYy';

$results = [];

// 1. PHP Version
$results['PHP Version'] = PHP_VERSION . (version_compare(PHP_VERSION, '7.4', '>=') ? ' ✅' : ' ❌ (need 7.4+)');

// 2. Extensions
foreach (['pdo', 'pdo_mysql', 'json', 'mbstring', 'openssl'] as $ext) {
    $results["ext/$ext"] = extension_loaded($ext) ? '✅ loaded' : '❌ MISSING';
}

// 3. Writable uploads
$uploadsDir = __DIR__ . '/api/storage/uploads';
$results['uploads dir exists']    = is_dir($uploadsDir) ? '✅' : '❌ MISSING';
$results['uploads dir writable']  = is_writable($uploadsDir) ? '✅' : '❌ NOT WRITABLE';

// 4. .env file
$envFile = __DIR__ . '/api/.env';
$results['.env file']  = file_exists($envFile) ? '✅ exists' : '❌ MISSING';

// 5. Database connection
try {
    $dsn = "mysql:host={$host};dbname={$db};charset=utf8mb4";
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_TIMEOUT => 5,
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);
    $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    $results['DB connection'] = '✅ Connected';
    $results['DB tables']     = count($tables) . ' found: ' . implode(', ', $tables);
} catch (Exception $e) {
    $results['DB connection'] = '❌ FAILED: ' . $e->getMessage();
}

// 6. Routing test
$results['SERVER_SOFTWARE'] = $_SERVER['SERVER_SOFTWARE'] ?? 'unknown';
$results['REQUEST_URI']     = $_SERVER['REQUEST_URI'] ?? 'N/A';
$results['SCRIPT_NAME']     = $_SERVER['SCRIPT_NAME'] ?? 'N/A';

?>
<!DOCTYPE html>
<html>
<head><title>Virasat Atlas – Diagnostics</title>
<style>body{font-family:monospace;background:#111;color:#eee;padding:2em}
h1{color:#f90}table{border-collapse:collapse;width:100%}
td{padding:8px 14px;border-bottom:1px solid #333}
td:first-child{color:#aaa;width:240px}.ok{color:#4f4}
.err{color:#f44}</style></head>
<body>
<h1>Virasat Atlas Diagnostics</h1>
<table>
<?php foreach ($results as $k => $v): ?>
<tr><td><?= htmlspecialchars($k) ?></td>
    <td class="<?= str_contains($v,'❌') ? 'err' : 'ok' ?>"><?= htmlspecialchars($v) ?></td></tr>
<?php endforeach; ?>
</table>
<p style="margin-top:2em;color:#888">⚠ Delete test-db.php after verification</p>
</body></html>

