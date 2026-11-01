<?php
/**
 * Virasat Atlas - Router for PHP built-in web server
 */

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$fullPath = __DIR__ . $path;

// If the file exists and is not a PHP file or private storage, serve it directly
if ($path !== '/' && file_exists($fullPath) && !is_dir($fullPath)) {
    // Block direct access to storage or hidden files
    if (str_contains($path, '/storage/') || str_contains($path, '/.') || str_ends_with($path, '.php')) {
        http_response_code(403);
        echo 'Access denied.';
        exit;
    }
    return false; // let built-in server serve static file
}

// Route all requests to index.php
require __DIR__ . '/index.php';
