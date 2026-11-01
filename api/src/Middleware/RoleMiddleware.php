<?php
namespace Virasat\Middleware;

use Virasat\Responses\JsonResponse;

class RoleMiddleware {
    private static array $roleWeights = [
        'visitor' => 0,
        'researcher' => 1,
        'reviewer' => 2,
        'admin' => 3
    ];

    public static function requireRole(string $minimumRole): array {
        $user = AuthMiddleware::requireAuth();
        $userRole = $user['role'] ?? 'visitor';

        $userWeight = self::$roleWeights[$userRole] ?? -1;
        $requiredWeight = self::$roleWeights[$minimumRole] ?? 99;

        if ($userWeight < $requiredWeight) {
            JsonResponse::forbidden("Forbidden: requires {$minimumRole} role or higher.");
        }

        return $user;
    }

    public static function hasRole(array $user, string $minimumRole): bool {
        $userRole = $user['role'] ?? 'visitor';
        $userWeight = self::$roleWeights[$userRole] ?? -1;
        $requiredWeight = self::$roleWeights[$minimumRole] ?? 99;
        return $userWeight >= $requiredWeight;
    }
}
