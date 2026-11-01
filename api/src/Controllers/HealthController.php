<?php
namespace Virasat\Controllers;

use Virasat\Responses\JsonResponse;
use Virasat\Config\Database;
use Virasat\Config\Env;
use Throwable;

class HealthController {
    public static function check(): void {
        $dbStatus = 'unknown';
        $dbError = null;

        try {
            $pdo = Database::getConnection();
            if ($pdo !== null) {
                $dbStatus = 'connected';
            } else {
                $dbStatus = 'offline_resilient_fallback';
                $dbError = Database::getLastError();
            }
        } catch (Throwable $e) {
            $dbStatus = 'error';
            $dbError = $e->getMessage();
        }

        JsonResponse::success([
            'status' => 'ready',
            'api_version' => '1.0.0',
            'environment' => Env::get('APP_ENV', 'production'),
            'database' => [
                'status' => $dbStatus,
                'target_host' => Env::get('DB_HOST', 'sql308.infinityfree.com'),
                'target_database' => Env::get('DB_DATABASE', 'if0_43194312_hackcult26'),
                'target_user' => Env::get('DB_USERNAME', 'if0_43194312'),
                'error_detail' => $dbError
            ],
            'timestamp' => date('c'),
            'php_version' => PHP_VERSION,
            'features' => [
                'react_spa' => true,
                'php_rest_api' => true,
                'digital_twin_3d' => true,
                'multilingual_i18n' => true,
                'oais_archival_export' => true
            ]
        ]);
    }
}
