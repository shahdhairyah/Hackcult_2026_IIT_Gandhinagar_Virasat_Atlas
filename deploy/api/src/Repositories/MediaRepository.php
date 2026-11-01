<?php
namespace Virasat\Repositories;

use Virasat\Config\Database;
use PDO;

class MediaRepository {
    public static function findByItemId(int $itemId): array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT id, archive_item_id, storage_key, original_filename, mime_type, file_size, sha256_checksum, alt_text, caption, is_primary, created_at 
                               FROM media_assets 
                               WHERE archive_item_id = ? 
                               ORDER BY is_primary DESC, id ASC");
        $stmt->execute([$itemId]);
        return $stmt->fetchAll();
    }

    public static function findById(int $id): ?array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT id, archive_item_id, storage_key, original_filename, mime_type, file_size, sha256_checksum, alt_text, caption, is_primary, created_at 
                               FROM media_assets 
                               WHERE id = ?");
        $stmt->execute([$id]);
        $res = $stmt->fetch();
        return $res ?: null;
    }

    public static function create(array $data): int {
        $pdo = Database::getConnection();
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
    }

    public static function delete(int $id): bool {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("DELETE FROM media_assets WHERE id = ?");
        return $stmt->execute([$id]);
    }

    public static function setPrimary(int $itemId, int $mediaId): void {
        $pdo = Database::getConnection();
        $pdo->beginTransaction();
        try {
            $stmt = $pdo->prepare("UPDATE media_assets SET is_primary = 0 WHERE archive_item_id = ?");
            $stmt->execute([$itemId]);
            $stmt = $pdo->prepare("UPDATE media_assets SET is_primary = 1 WHERE id = ? AND archive_item_id = ?");
            $stmt->execute([$mediaId, $itemId]);
            $pdo->commit();
        } catch (\Exception $e) {
            $pdo->rollBack();
            throw $e;
        }
    }
}

