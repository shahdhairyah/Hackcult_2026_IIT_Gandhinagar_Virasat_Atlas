<?php
namespace Virasat\Responses;

class JsonResponse {
    public static function success(mixed $data = null, ?array $meta = null, int $statusCode = 200): void {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode([
            'data' => $data,
            'meta' => $meta,
            'error' => null
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    public static function error(string $message, string $code = 'BAD_REQUEST', int $statusCode = 400, ?array $fields = null): void {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=UTF-8');
        $error = [
            'code' => $code,
            'message' => $message
        ];
        if ($fields !== null) {
            $error['fields'] = $fields;
        }
        echo json_encode([
            'data' => null,
            'error' => $error
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    public static function unauthorized(string $message = 'Authentication required.'): void {
        self::error($message, 'UNAUTHENTICATED', 401);
    }

    public static function forbidden(string $message = 'You do not have permission to perform this action.'): void {
        self::error($message, 'FORBIDDEN', 403);
    }

    public static function notFound(string $message = 'Resource not found.'): void {
        self::error($message, 'NOT_FOUND', 404);
    }

    public static function validationError(string $message, array $fields): void {
        self::error($message, 'VALIDATION_ERROR', 422, $fields);
    }
}

