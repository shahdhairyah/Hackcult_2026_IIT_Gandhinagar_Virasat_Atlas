<?php
namespace Virasat\Repositories;

use Virasat\Config\Database;
use PDO;
use Throwable;

class MediaRepository {
    private static function getFallbackMedia(): array {
        return [
            1 => ['id' => 1, 'archive_item_id' => 1, 'storage_key' => '9d798361915a9470730bb3b60af58068.svg', 'original_filename' => 'rani_ki_vav_elevation.svg', 'mime_type' => 'image/svg+xml', 'file_size' => 1024, 'sha256_checksum' => '9d798361915a', 'alt_text' => 'Seven tiers of carved sandstone panels at Rani ki Vav', 'caption' => null, 'is_primary' => 1, 'created_at' => '2026-01-01 00:00:00'],
            2 => ['id' => 2, 'archive_item_id' => 2, 'storage_key' => '8c56e87b461ef0e488f2b731b5a67e2b.svg', 'original_filename' => 'adalaj_stepwell_octagonal_shaft.svg', 'mime_type' => 'image/svg+xml', 'file_size' => 1024, 'sha256_checksum' => '8c56e87b461e', 'alt_text' => 'Pillared octagonal corridors of Adalaj Vav', 'caption' => null, 'is_primary' => 1, 'created_at' => '2026-01-01 00:00:00'],
            3 => ['id' => 3, 'archive_item_id' => 3, 'storage_key' => '2fbfd09eca63cc94814105eccd0164ba.svg', 'original_filename' => 'modhera_surya_kund_stepped_pond.svg', 'mime_type' => 'image/svg+xml', 'file_size' => 1024, 'sha256_checksum' => '2fbfd09eca63', 'alt_text' => 'Stepped geometric reservoir of Surya Kund Modhera', 'caption' => null, 'is_primary' => 1, 'created_at' => '2026-01-01 00:00:00'],
            5 => ['id' => 5, 'archive_item_id' => 6, 'storage_key' => 'b78f62c27774f7d7fe89629530267848.svg', 'original_filename' => 'patan_patola_technical_grid.svg', 'mime_type' => 'image/svg+xml', 'file_size' => 1024, 'sha256_checksum' => 'b78f62c27774', 'alt_text' => 'Double ikat weaving geometric layout graph', 'caption' => null, 'is_primary' => 1, 'created_at' => '2026-01-01 00:00:00'],
            6 => ['id' => 6, 'archive_item_id' => 7, 'storage_key' => '041fa544c88b327557bbe6d4a112eb8e.svg', 'original_filename' => 'lothal_brick_sluice_survey.svg', 'mime_type' => 'image/svg+xml', 'file_size' => 1024, 'sha256_checksum' => '041fa544c88b', 'alt_text' => 'Kiln fired Harappan mudbrick water sluice canal', 'caption' => null, 'is_primary' => 1, 'created_at' => '2026-01-01 00:00:00']
        ];
    }

    public static function findByItemId(int $itemId): array {
        $pdo = Database::getConnection();
        if ($pdo !== null) {
            try {
                $stmt = $pdo->prepare("SELECT id, archive_item_id, storage_key, original_filename, mime_type, file_size, sha256_checksum, alt_text, caption, is_primary, created_at 
                                       FROM media_assets 
                                       WHERE archive_item_id = ? 
                                       ORDER BY is_primary DESC, id ASC");
                $stmt->execute([$itemId]);
                return $stmt->fetchAll();
            } catch (Throwable $e) {
                error_log("MediaRepository::findByItemId exception: " . $e->getMessage());
            }
        }

        $res = [];
        foreach (self::getFallbackMedia() as $m) {
            if ($m['archive_item_id'] === $itemId) {
                $res[] = $m;
            }
        }
        return $res;
    }

    public static function findById(int $id): ?array {
        $pdo = Database::getConnection();
        if ($pdo !== null) {
            try {
                $stmt = $pdo->prepare("SELECT id, archive_item_id, storage_key, original_filename, mime_type, file_size, sha256_checksum, alt_text, caption, is_primary, created_at 
                                       FROM media_assets 
                                       WHERE id = ?");
                $stmt->execute([$id]);
                $res = $stmt->fetch();
                if ($res) return $res;
            } catch (Throwable $e) {
                error_log("MediaRepository::findById exception: " . $e->getMessage());
            }
        }

        $fallback = self::getFallbackMedia();
        return $fallback[$id] ?? null;
    }

    public static function create(array $data): int {
        $pdo = Database::getConnection();
        if ($pdo !== null) {
            try {
                $stmt = $pdo->prepare("INSERT INTO media_assets 
                    (archive_item_id, storage_key, original_filename, mime_type, file_size, sha256_checksum, alt_text, caption, is_primary) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([
                    $data['archive_item_id'],
                    $data['storage_key'],
                    $data['original_filename'],
                    $data['mime_type'],
                    $data['file_size'],
                    $data['sha256_checksum'],
                    $data['alt_text'] ?? null,
                    $data['caption'] ?? null,
                    $data['is_primary'] ?? 0
                ]);
                return (int)$pdo->lastInsertId();
            } catch (Throwable $e) {
                error_log("MediaRepository::create exception: " . $e->getMessage());
            }
        }
        return 99;
    }

    public static function delete(int $id): bool {
        $pdo = Database::getConnection();
        if ($pdo !== null) {
            try {
                $stmt = $pdo->prepare("DELETE FROM media_assets WHERE id = ?");
                return $stmt->execute([$id]);
            } catch (Throwable $e) {
                error_log("MediaRepository::delete exception: " . $e->getMessage());
            }
        }
        return true;
    }

    public static function setPrimary(int $itemId, int $mediaId): void {
        $pdo = Database::getConnection();
        if ($pdo !== null) {
            try {
                $pdo->beginTransaction();
                $stmt = $pdo->prepare("UPDATE media_assets SET is_primary = 0 WHERE archive_item_id = ?");
                $stmt->execute([$itemId]);
                $stmt = $pdo->prepare("UPDATE media_assets SET is_primary = 1 WHERE id = ? AND archive_item_id = ?");
                $stmt->execute([$mediaId, $itemId]);
                $pdo->commit();
            } catch (Throwable $e) {
                if ($pdo->inTransaction()) {
                    $pdo->rollBack();
                }
                error_log("MediaRepository::setPrimary exception: " . $e->getMessage());
            }
        }
    }
}
