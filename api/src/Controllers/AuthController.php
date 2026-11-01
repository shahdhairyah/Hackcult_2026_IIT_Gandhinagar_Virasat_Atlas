<?php
namespace Virasat\Controllers;

use Virasat\Repositories\UserRepository;
use Virasat\Repositories\AuditRepository;
use Virasat\Validators\AuthValidator;
use Virasat\Responses\JsonResponse;
use Virasat\Middleware\AuthMiddleware;

class AuthController {
    public static function login(): void {
        AuthMiddleware::startSession();

        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        $errors = AuthValidator::validateLogin($input);

        if (!empty($errors)) {
            JsonResponse::validationError('Invalid login details.', $errors);
        }

        $user = UserRepository::findByEmail($input['email']);
        if (!$user || !password_verify($input['password'], $user['password_hash'])) {
            JsonResponse::error('Invalid email or password.', 'INVALID_CREDENTIALS', 401);
        }

        // Set session
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_role'] = $user['role'];
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));

        unset($user['password_hash']);

        // Generate token for Bearer header support in cross-origin / headless environments
        $token = base64_encode(json_encode([
            'id' => $user['id'],
            'email' => $user['email'],
            'role' => $user['role'],
            't' => time()
        ]));

        AuditRepository::log($user['id'], 'user_login', 'user', $user['id']);

        JsonResponse::success([
            'user' => $user,
            'csrf_token' => $_SESSION['csrf_token'],
            'token' => $token
        ]);
    }

    public static function logout(): void {
        AuthMiddleware::startSession();
        $user = AuthMiddleware::user();

        if ($user) {
            AuditRepository::log($user['id'], 'user_logout', 'user', $user['id']);
        }

        $_SESSION = [];
        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(
                session_name(),
                '',
                time() - 42000,
                $params['path'],
                $params['domain'],
                $params['secure'],
                $params['httponly']
            );
        }
        session_destroy();

        JsonResponse::success(['message' => 'Logged out successfully.']);
    }

    public static function me(): void {
        $user = AuthMiddleware::user();
        if (!$user) {
            JsonResponse::success(['user' => null]);
        }

        unset($user['password_hash']);
        $csrfToken = $_SESSION['csrf_token'] ?? null;
        if (!$csrfToken) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
            $csrfToken = $_SESSION['csrf_token'];
        }

        JsonResponse::success([
            'user' => $user,
            'csrf_token' => $csrfToken
        ]);
    }
}

