<?php
namespace Virasat\Repositories;

use Virasat\Config\Database;
use PDO;

class CollectionRepository {
    public static function findAllPublished(): array {
        $pdo = Database::getConnection();
        $sql = "SELECT c.*, u.full_name as curator_name, COUNT(ci.archive_item_id) as item_count
                FROM collections c
                JOIN users u ON u.id = c.curator_id
                LEFT JOIN collection_items ci ON ci.collection_id = c.id
                WHERE c.is_published = 1
                GROUP BY c.id
                ORDER BY c.created_at DESC";
        $stmt = $pdo->query($sql);
        return $stmt->fetchAll();
    }

    public static function findById(int $id): ?array {
        $pdo = Database::getConnection();
        $sql = "SELECT c.*, u.full_name as curator_name 
                FROM collections c
                JOIN users u ON u.id = c.curator_id
                WHERE c.id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$id]);
        $collection = $stmt->fetch();
        if (!$collection) {
            return null;
        }

        // Fetch ordered items
        $itemSql = "SELECT ai.id, ai.title, ai.item_type, ai.summary, ai.region, ai.latitude, ai.longitude,
                           ci.item_order, ci.curator_notes,
                           m.storage_key as primary_media_key, m.alt_text as primary_media_alt
                    FROM collection_items ci
                    JOIN archive_items ai ON ai.id = ci.archive_item_id
                    LEFT JOIN media_assets m ON m.archive_item_id = ai.id AND m.is_primary = 1
                    WHERE ci.collection_id = ? AND ai.status = 'published' AND ai.visibility = 'public'
                    GROUP BY ai.id
                    ORDER BY ci.item_order ASC";
        $itemStmt = $pdo->prepare($itemSql);
        $itemStmt->execute([$id]);
        $collection['items'] = $itemStmt->fetchAll();

        return $collection;
    }

    public static function create(array $data): int {
        $pdo = Database::getConnection();
        $slug = strtolower(preg_replace('/[^a-zA-Z0-9]+/', '-', $data['title']));
        $slug = trim($slug, '-');

        $stmt = $pdo->prepare("INSERT INTO collections (title, slug, summary, description, curator_id, is_published) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['title'],
            $slug,
            $data['summary'],
            $data['description'] ?? null,
            $data['curator_id'],
            $data['is_published'] ?? 1
        ]);
        return (int)$pdo->lastInsertId();
    }

    public static function setItems(int $collectionId, array $items): void {
        $pdo = Database::getConnection();
        $pdo->beginTransaction();
        try {
            $del = $pdo->prepare("DELETE FROM collection_items WHERE collection_id = ?");
            $del->execute([$collectionId]);

            $ins = $pdo->prepare("INSERT INTO collection_items (collection_id, archive_item_id, item_order, curator_notes) VALUES (?, ?, ?, ?)");
            foreach ($items as $order => $it) {
                $itemId = is_array($it) ? ($it['archive_item_id'] ?? $it['id']) : $it;
                $notes = is_array($it) ? ($it['curator_notes'] ?? null) : null;
                $ins->execute([$collectionId, $itemId, $order + 1, $notes]);
            }
            $pdo->commit();
        } catch (\Exception $e) {
            $pdo->rollBack();
            throw $e;
        }
    }
}

