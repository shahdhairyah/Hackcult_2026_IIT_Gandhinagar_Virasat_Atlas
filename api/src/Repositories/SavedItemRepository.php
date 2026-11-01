<?php
namespace Virasat\Repositories;

use Virasat\Config\Database;
use PDO;
use Throwable;

class SavedItemRepository {
    public static function toggle(int $userId, int $itemId): bool {
        $pdo = Database::getConnection();
        if ($pdo !== null) {
            try {
                $check = $pdo->prepare("SELECT id FROM saved_items WHERE user_id = ? AND archive_item_id = ?");
                $check->execute([$userId, $itemId]);
                $existingId = $check->fetchColumn();

                if ($existingId) {
                    $del = $pdo->prepare("DELETE FROM saved_items WHERE id = ?");
                    $del->execute([$existingId]);
                    return false; // un-saved
                } else {
                    $ins = $pdo->prepare("INSERT INTO saved_items (user_id, archive_item_id) VALUES (?, ?)");
                    $ins->execute([$userId, $itemId]);
                    return true; // saved
                }
            } catch (Throwable $e) {
                error_log("SavedItemRepository::toggle exception: " . $e->getMessage());
            }
        }
        return true;
    }

    public static function remove(int $userId, int $itemId): bool {
        $pdo = Database::getConnection();
        if ($pdo !== null) {
            try {
                $del = $pdo->prepare("DELETE FROM saved_items WHERE user_id = ? AND archive_item_id = ?");
                return $del->execute([$userId, $itemId]);
            } catch (Throwable $e) {
                error_log("SavedItemRepository::remove exception: " . $e->getMessage());
            }
        }
        return true;
    }

    public static function isSaved(int $userId, int $itemId): bool {
        $pdo = Database::getConnection();
        if ($pdo !== null) {
            try {
                $stmt = $pdo->prepare("SELECT 1 FROM saved_items WHERE user_id = ? AND archive_item_id = ?");
                $stmt->execute([$userId, $itemId]);
                return (bool)$stmt->fetchColumn();
            } catch (Throwable $e) {
                error_log("SavedItemRepository::isSaved exception: " . $e->getMessage());
            }
        }
        return false;
    }

    public static function listByUser(int $userId): array {
        $pdo = Database::getConnection();
        if ($pdo !== null) {
            try {
                $sql = "SELECT ai.id, ai.title, ai.item_type, ai.summary, ai.region, ai.latitude, ai.longitude,
                               ai.rights_status, ai.status, si.created_at as saved_at,
                               m.id as primary_media_id, m.storage_key as primary_media_key, m.alt_text as primary_media_alt
                        FROM saved_items si
                        JOIN archive_items ai ON ai.id = si.archive_item_id
                        LEFT JOIN media_assets m ON m.archive_item_id = ai.id AND m.is_primary = 1
                        WHERE si.user_id = ? AND (ai.status = 'published' OR ai.submitted_by = ?)
                        ORDER BY si.created_at DESC";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([$userId, $userId]);
                return $stmt->fetchAll();
            } catch (Throwable $e) {
                error_log("SavedItemRepository::listByUser exception: " . $e->getMessage());
            }
        }
        return [];
    }
}
