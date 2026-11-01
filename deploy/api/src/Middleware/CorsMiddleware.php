<?php
namespace Virasat\Middleware;

use Virasat\Config\Env;

class CorsMiddleware {
    public static function handle(): void {
        $allowedOrigin = Env::get('APP_ALLOWED_ORIGIN', 'http://localhost:5173');
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

        if ($origin !== '') {
            $isAllowed = ($origin === $allowedOrigin)
                || str_contains($origin, 'hackcult26.gt.tc')
                || preg_match('/^https?:\/\/(localhost|127\.0\.0\.1)(:[0-9]+)?$/', $origin);

            if ($isAllowed) {
                header("Access-Control-Allow-Origin: {$origin}");
                header('Access-Control-Allow-Credentials: true');
            } else {
                header("Access-Control-Allow-Origin: {$origin}");
            }
        } else {
            header("Access-Control-Allow-Origin: *");
        }

        header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-CSRF-Token');
        header('Access-Control-Max-Age: 86400');

        // Handle pre-flight request
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(204);
            exit;
        }
    }
}
