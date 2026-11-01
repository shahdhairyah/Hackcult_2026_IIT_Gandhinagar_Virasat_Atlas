<?php
/**
 * Virasat Atlas - PHP REST API Entry Point
 */

declare(strict_types=1);

// PSR-4 Autoloader for Virasat namespace
spl_autoload_register(function (string $class) {
    $prefix = 'Virasat\\';
    $baseDir = __DIR__ . '/src/';

    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }

    $relativeClass = substr($class, $len);
    $file = $baseDir . str_replace('\\', '/', $relativeClass) . '.php';

    if (file_exists($file)) {
        require_once $file;
    }
});

use Virasat\Config\Env;
use Virasat\Middleware\CorsMiddleware;
use Virasat\Responses\JsonResponse;
use Virasat\Controllers\HealthController;
use Virasat\Controllers\AuthController;
use Virasat\Controllers\ArchiveItemController;
use Virasat\Controllers\MediaController;
use Virasat\Controllers\ReviewController;
use Virasat\Controllers\LocationController;
use Virasat\Controllers\CollectionController;
use Virasat\Controllers\OcrController;
use Virasat\Controllers\SavedItemController;
use Virasat\Controllers\AdminController;

// 1. Load environment variables
Env::load(__DIR__ . '/.env');

// 2. Global CORS handling
CorsMiddleware::handle();

// 3. Global Exception Handler
set_exception_handler(function (Throwable $e) {
    error_log('Unhandled exception: ' . $e->getMessage() . "\n" . $e->getTraceAsString());
    JsonResponse::error($e->getMessage(), 'SERVER_ERROR', 500, [
        'file' => basename($e->getFile()),
        'line' => $e->getLine()
    ]);
});

// 4. Request parsing
$requestMethod = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$requestUri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);

// Normalize route (strip trailing slash and project directory prefix if needed)
$uri = rtrim($requestUri, '/');
$uri = str_replace('/index.php', '', $uri);
if ($uri === '') {
    $uri = '/';
}

// Router dispatch
// All API routes are under /api/v1 or /api
$prefix = '/api/v1';

if (str_starts_with($uri, '/api') && !str_starts_with($uri, '/api/v1')) {
    $uri = '/api/v1' . substr($uri, 4);
}

// Health check
if ($uri === $prefix . '/health' && ($requestMethod === 'GET' || $requestMethod === 'HEAD')) {
    HealthController::check();
}

// Auth endpoints
if ($uri === $prefix . '/auth/login' && $requestMethod === 'POST') {
    AuthController::login();
}
if ($uri === $prefix . '/auth/logout' && $requestMethod === 'POST') {
    AuthController::logout();
}
if ($uri === $prefix . '/auth/me' && ($requestMethod === 'GET' || $requestMethod === 'HEAD')) {
    AuthController::me();
}

// Workspace endpoints
if ($uri === $prefix . '/workspace/items' && ($requestMethod === 'GET' || $requestMethod === 'HEAD')) {
    ArchiveItemController::myWorkspace();
}

// Review Queue endpoints
if ($uri === $prefix . '/review-queue' && ($requestMethod === 'GET' || $requestMethod === 'HEAD')) {
    ReviewController::queue();
}
if (preg_match('#^' . $prefix . '/archive-items/(\d+)/review$#', $uri, $m) && $requestMethod === 'POST') {
    ReviewController::review((int)$m[1]);
}

// Archive Item endpoints
if ($uri === $prefix . '/archive-items' && ($requestMethod === 'GET' || $requestMethod === 'HEAD')) {
    ArchiveItemController::index();
}
if ($uri === $prefix . '/archive-items' && $requestMethod === 'POST') {
    ArchiveItemController::store();
}
if (preg_match('#^' . $prefix . '/archive-items/(\d+)$#', $uri, $m)) {
    if ($requestMethod === 'GET' || $requestMethod === 'HEAD') {
        ArchiveItemController::show((int)$m[1]);
    } elseif ($requestMethod === 'PATCH' || $requestMethod === 'PUT' || $requestMethod === 'POST') {
        ArchiveItemController::update((int)$m[1]);
    }
}
if (preg_match('#^' . $prefix . '/archive-items/(\d+)/related$#', $uri, $m) && ($requestMethod === 'GET' || $requestMethod === 'HEAD')) {
    ArchiveItemController::related((int)$m[1]);
}

// OCR Jobs endpoints
if (preg_match('#^' . $prefix . '/archive-items/(\d+)/ocr-jobs$#', $uri, $m)) {
    if ($requestMethod === 'GET' || $requestMethod === 'HEAD') {
        OcrController::index((int)$m[1]);
    } elseif ($requestMethod === 'POST') {
        OcrController::store((int)$m[1]);
    }
}
if (preg_match('#^' . $prefix . '/ocr-jobs/(\d+)$#', $uri, $m) && ($requestMethod === 'PATCH' || $requestMethod === 'PUT' || $requestMethod === 'POST')) {
    OcrController::update((int)$m[1]);
}

// Media endpoints
if (preg_match('#^' . $prefix . '/archive-items/(\d+)/media$#', $uri, $m) && $requestMethod === 'POST') {
    MediaController::upload((int)$m[1]);
}
if (preg_match('#^' . $prefix . '/media/(\d+)/view$#', $uri, $m) && ($requestMethod === 'GET' || $requestMethod === 'HEAD')) {
    MediaController::view((int)$m[1]);
}
if (preg_match('#^' . $prefix . '/media/(\d+)$#', $uri, $m) && $requestMethod === 'DELETE') {
    MediaController::destroy((int)$m[1]);
}

// Locations endpoints
if ($uri === $prefix . '/locations' && $requestMethod === 'GET') {
    LocationController::index();
}
if ($uri === $prefix . '/locations/all' && $requestMethod === 'GET') {
    ArchiveItemController::locations();
}

// Tags endpoint
if ($uri === $prefix . '/tags' && $requestMethod === 'GET') {
    ArchiveItemController::tags();
}

// Collections endpoints
if ($uri === $prefix . '/collections' && ($requestMethod === 'GET' || $requestMethod === 'HEAD')) {
    CollectionController::index();
}
if ($uri === $prefix . '/collections' && $requestMethod === 'POST') {
    CollectionController::store();
}
if (preg_match('#^' . $prefix . '/collections/(\d+)$#', $uri, $m) && ($requestMethod === 'GET' || $requestMethod === 'HEAD')) {
    CollectionController::show((int)$m[1]);
}
if (preg_match('#^' . $prefix . '/collections/(\d+)/items$#', $uri, $m) && ($requestMethod === 'PATCH' || $requestMethod === 'PUT' || $requestMethod === 'POST')) {
    CollectionController::setItems((int)$m[1]);
}

// Saved Items / Bookmarks endpoints
if ($uri === $prefix . '/saved-items' && ($requestMethod === 'GET' || $requestMethod === 'HEAD')) {
    SavedItemController::index();
}
if (preg_match('#^' . $prefix . '/saved-items/(\d+)$#', $uri, $m)) {
    if ($requestMethod === 'POST') {
        SavedItemController::toggle((int)$m[1]);
    }
    if ($requestMethod === 'DELETE') {
        SavedItemController::remove((int)$m[1]);
    }
}
if (preg_match('#^' . $prefix . '/saved-items/(\d+)/status$#', $uri, $m) && ($requestMethod === 'GET' || $requestMethod === 'HEAD')) {
    SavedItemController::status((int)$m[1]);
}

// Admin & Governance endpoints
if ($uri === $prefix . '/admin/metrics' && ($requestMethod === 'GET' || $requestMethod === 'HEAD')) {
    AdminController::metrics();
}
if ($uri === $prefix . '/admin/users' && ($requestMethod === 'GET' || $requestMethod === 'HEAD')) {
    AdminController::users();
}
if (preg_match('#^' . $prefix . '/admin/users/(\d+)/role$#', $uri, $m) && ($requestMethod === 'PATCH' || $requestMethod === 'POST')) {
    AdminController::updateUserRole((int)$m[1]);
}
if ($uri === $prefix . '/admin/audit-logs' && ($requestMethod === 'GET' || $requestMethod === 'HEAD')) {
    AdminController::auditLogs();
}
if ($uri === $prefix . '/archive-export' && ($requestMethod === 'GET' || $requestMethod === 'HEAD')) {
    AdminController::exportArchive();
}

// Root fallback / documentation status
if ($uri === '/' || $uri === $prefix) {
    JsonResponse::success([
        'name' => 'Virasat Atlas API',
        'version' => 'v1',
        'health' => '/api/v1/health',
        'docs' => 'Virasat Atlas REST API for digital cultural & architectural archives.'
    ]);
}

// 404 for unknown endpoints
JsonResponse::notFound("Route not found: {$requestMethod} {$requestUri}");
