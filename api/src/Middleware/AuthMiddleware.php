<?php
namespace Virasat\Middleware;

use Virasat\Repositories\UserRepository;
use Virasat\Responses\JsonResponse;
use Virasat\Config\Env;

class AuthMiddleware {
    private static ?array $currentUser = null;

    public static function startSession(): void {
        if (session_status() === PHP_SESSION_NONE) {
            $secure = filter_var(Env::get('SESSION_SECURE_COOKIE', false), FILTER_VALIDATE_BOOLEAN);
            session_set_cookie_params([
                'lifetime' => 86400 * 7,
                'path' => '/',
                'domain' => '',
                'secure' => $secure,
                'httponly' => true,
                'samesite' => 'Lax'
            ]);
            session_start();
        }
    }

    public static function authenticate(): ?array {
        self::startSession();

        // 1. Check session
        if (!empty($_SESSION['user_id'])) {
            $user = UserRepository::findById((int)$_SESSION['user_id']);
            if ($user) {
                self::$currentUser = $user;
                return $user;
            }
        }

        // 2. Check Authorization Bearer header
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
        if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            $token = trim($matches[1]);
            // Support base64 user session token
            $decoded = json_decode(base64_decode($token), true);
            if (is_array($decoded) && !empty($decoded['id'])) {
                $user = UserRepository::findById((int)$decoded['id']);
                if ($user) {
                    self::$currentUser = $user;
                    return $user;
                }
            }
        }

        return null;
    }

    public static function requireAuth(): array {
        $user = self::authenticate();
        if (!$user) {
            JsonResponse::unauthorized('Authentication required to access this resource.');
        }
        return $user;
    }

    public static function user(): ?array {
        if (self::$currentUser === null) {
            self::authenticate();
        }
        return self::$currentUser;
    }

    public static function setUser(array $user): void {
        self::$currentUser = $user;
    }
}

