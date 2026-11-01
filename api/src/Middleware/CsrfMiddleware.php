<?php
/**
 * CSRF protection middleware for cookie‑based sessions.
 * Checks the X‑CSRF‑Token header (or _csrf field) against the token stored in the session.
 * Should be invoked on any state‑changing request (POST, PATCH, DELETE, PUT).
 */
class CsrfMiddleware {
    public static function verify(): void {
        // Only enforce for non‑GET verbs
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        if (strtoupper($method) === 'GET') {
            return;
        }
        $sessionToken = $_SESSION['csrf_token'] ?? null;
        if (!$sessionToken) {
            self::reject('Missing CSRF token in session.');
        }
        $header = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
        $bodyToken = '';
        if (in_array(strtoupper($method), ['POST', 'PATCH', 'PUT', 'DELETE'])) {
            $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
            $bodyToken = $input['_csrf'] ?? '';
        }
        $provided = $header ?: $bodyToken;
        if (!hash_equals($sessionToken, $provided)) {
            self::reject('Invalid CSRF token.');
        }
    }

    private static function reject(string $msg): void {
        http_response_code(403);
        header('Content-Type: application/json');
        echo json_encode([
            'error' => [
                'code' => 'CSRF_FAILURE',
                'message' => $msg,
            ]
        ]);
        exit;
    }
}
?>
