<?php
namespace Virasat\Controllers;

use Virasat\Config\Database;
use Virasat\Config\Env;
use Virasat\Responses\JsonResponse;
use Exception;

class HealthController {
    public static function check(): void {
        $dbStatus = 'healthy';
        $dbError = null;

        try {
            $pdo = Database::getConnection();
            $stmt = $pdo->query('SELECT 1');
            $stmt->fetch();
        } catch (Exception $e) {
            $dbStatus = 'unhealthy';
            $dbError = 'Database unreachable.';
        }

        $storagePath = Env::get('MEDIA_STORAGE_PATH', __DIR__ . '/../../storage/uploads');
        $storageWritable = is_dir($storagePath) && is_writable($storagePath);

        $isHealthy = ($dbStatus === 'healthy' && $storageWritable);

        JsonResponse::success([
            'status' => $isHealthy ? 'ready' : 'degraded',
            'version' => '1.0.0',
            'timestamp' => gmdate('c'),
            'checks' => [
                'database' => [
                    'status' => $dbStatus,
                    'driver' => 'mysql'
                ],
                'storage' => [
                    'status' => $storageWritable ? 'healthy' : 'unhealthy'
                ]
            ]
        ], null, $isHealthy ? 200 : 503);
    }
}

