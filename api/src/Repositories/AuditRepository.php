<?php
namespace Virasat\Repositories;

use Virasat\Config\Database;

class AuditRepository {
    public static function log(?int $userId, string $action, string $entityType, int $entityId, ?array $details = null): void {
        try {
            $pdo = Database::getConnection();
            $ip = $_SERVER['REMOTE_ADDR'] ?? null;
            $stmt = $pdo->prepare("INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details, ip_address) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $userId,
                $action,
                $entityType,
                $entityId,
                $details ? json_encode($details, JSON_UNESCAPED_SLASHES) : null,
                $ip
            ]);
        } catch (\Exception $e) {
            error_log("Failed to write audit log: " . $e->getMessage());
        }
    }
}

