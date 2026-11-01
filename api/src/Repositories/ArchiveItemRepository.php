<?php
namespace Virasat\Repositories;

use Virasat\Config\Database;
use PDO;

class ArchiveItemRepository {
    public static function findPublishedWithFilters(array $params): array {
        $pdo = Database::getConnection();

        $page = max(1, (int)($params['page'] ?? 1));
        $perPage = min(50, max(1, (int)($params['per_page'] ?? 12)));
        $offset = ($page - 1) * $perPage;

        $conditions = ["ai.status = 'published'", "ai.visibility = 'public'"];
        $bindings = [];

        // 1. Keyword search (MySQL FULLTEXT or LIKE fallback + reviewed OCR transcript)
        $q = trim($params['q'] ?? '');
        if ($q !== '') {
            $conditions[] = "(
                MATCH(ai.title, ai.summary, ai.description) AGAINST(? IN BOOLEAN MODE) 
                OR ai.title LIKE ? 
                OR ai.region LIKE ?
                OR EXISTS (
                    SELECT 1 FROM ocr_jobs oj 
                    WHERE oj.archive_item_id = ai.id 
                      AND oj.status = 'reviewed' 
                      AND oj.reviewed_text LIKE ?
                )
            )";
            $qWildcard = '%' . $q . '%';
            $bindings[] = $q . '*';
            $bindings[] = $qWildcard;
            $bindings[] = $qWildcard;
            $bindings[] = $qWildcard;
        }

        // 2. Type filter
        if (!empty($params['type'])) {
            $conditions[] = "ai.item_type = ?";
            $bindings[] = $params['type'];
        }

        // 3. Region filter
        if (!empty($params['region'])) {
            $conditions[] = "ai.region = ?";
            $bindings[] = $params['region'];
        }

        // 4. Location filter
        if (!empty($params['location_id'])) {
            $conditions[] = "ai.location_id = ?";
            $bindings[] = (int)$params['location_id'];
        }

        // 5. Language filter
        if (!empty($params['language'])) {
            $conditions[] = "ai.language = ?";
            $bindings[] = $params['language'];
        }

        // 6. Tag filter
        if (!empty($params['tag'])) {
            $conditions[] = "EXISTS (
                SELECT 1 FROM archive_item_tags ait
                JOIN tags t ON t.id = ait.tag_id
                WHERE ait.archive_item_id = ai.id AND (t.slug = ? OR t.name = ?)
            )";
            $bindings[] = $params['tag'];
            $bindings[] = $params['tag'];
        }

        $whereClause = "WHERE " . implode(" AND ", $conditions);

        // Count total
        $countSql = "SELECT COUNT(DISTINCT ai.id) as total FROM archive_items ai {$whereClause}";
        $countStmt = $pdo->prepare($countSql);
        $countStmt->execute($bindings);
        $total = (int)$countStmt->fetchColumn();

        // Sort allowlist
        $sort = $params['sort'] ?? 'latest';
        $orderBy = match ($sort) {
            'oldest' => 'ai.created_at ASC',
            'title'  => 'ai.title ASC',
            default  => 'ai.created_at DESC'
        };

        // Query items
        $sql = "SELECT ai.id, ai.title, ai.item_type, ai.summary, ai.region, ai.latitude, ai.longitude,
                       ai.capture_date, ai.historical_period, ai.language, ai.creator, ai.source,
                       ai.rights_status, ai.attribution_text, ai.status, ai.visibility, ai.created_at,
                       l.name as location_name,
                       m.id as primary_media_id, m.storage_key as primary_media_key, m.mime_type as primary_media_mime, m.alt_text as primary_media_alt
                FROM archive_items ai
                LEFT JOIN locations l ON l.id = ai.location_id
                LEFT JOIN media_assets m ON m.archive_item_id = ai.id AND m.is_primary = 1
                {$whereClause}
                GROUP BY ai.id
                ORDER BY {$orderBy}
                LIMIT {$perPage} OFFSET {$offset}";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($bindings);
        $items = $stmt->fetchAll();

        // Fetch tags for items
        if (!empty($items)) {
            $itemIds = array_column($items, 'id');
            $inClause = implode(',', array_fill(0, count($itemIds), '?'));
            $tagSql = "SELECT ait.archive_item_id, t.name, t.slug 
                       FROM archive_item_tags ait
                       JOIN tags t ON t.id = ait.tag_id
                       WHERE ait.archive_item_id IN ($inClause)";
            $tagStmt = $pdo->prepare($tagSql);
            $tagStmt->execute($itemIds);
            $tagsByItem = [];
            while ($row = $tagStmt->fetch()) {
                $tagsByItem[$row['archive_item_id']][] = [
                    'name' => $row['name'],
                    'slug' => $row['slug']
                ];
            }

            foreach ($items as &$item) {
                $item['tags'] = $tagsByItem[$item['id']] ?? [];
            }
        }

        return [
            'items' => $items,
            'total' => $total,
            'page' => $page,
            'per_page' => $perPage,
            'total_pages' => (int)ceil($total / $perPage)
        ];
    }

    public static function findById(int $id): ?array {
        $pdo = Database::getConnection();
        $sql = "SELECT ai.*, 
                       l.name as location_name, l.state as location_state, l.country as location_country,
                       u.full_name as submitter_name, u.organization as submitter_org,
                       r.full_name as reviewer_name
                FROM archive_items ai
                LEFT JOIN locations l ON l.id = ai.location_id
                LEFT JOIN users u ON u.id = ai.submitted_by
                LEFT JOIN users r ON r.id = ai.reviewed_by
                WHERE ai.id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$id]);
        $item = $stmt->fetch();

        if (!$item) {
            return null;
        }

        // Fetch media
        $item['media'] = MediaRepository::findByItemId($id);

        // Fetch tags
        $tagSql = "SELECT t.id, t.name, t.slug 
                   FROM archive_item_tags ait
                   JOIN tags t ON t.id = ait.tag_id
                   WHERE ait.archive_item_id = ?";
        $tagStmt = $pdo->prepare($tagSql);
        $tagStmt->execute([$id]);
        $item['tags'] = $tagStmt->fetchAll();

        return $item;
    }

    public static function findByUser(int $userId): array {
        $pdo = Database::getConnection();
        $sql = "SELECT ai.*, 
                       l.name as location_name,
                       m.id as primary_media_id, m.storage_key as primary_media_key, m.alt_text as primary_media_alt
                FROM archive_items ai
                LEFT JOIN locations l ON l.id = ai.location_id
                LEFT JOIN media_assets m ON m.archive_item_id = ai.id AND m.is_primary = 1
                WHERE ai.submitted_by = ?
                GROUP BY ai.id
                ORDER BY ai.updated_at DESC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$userId]);
        $items = $stmt->fetchAll();

        // Attach tags
        if (!empty($items)) {
            $itemIds = array_column($items, 'id');
            $inClause = implode(',', array_fill(0, count($itemIds), '?'));
            $tagSql = "SELECT ait.archive_item_id, t.name, t.slug 
                       FROM archive_item_tags ait
                       JOIN tags t ON t.id = ait.tag_id
                       WHERE ait.archive_item_id IN ($inClause)";
            $tagStmt = $pdo->prepare($tagSql);
            $tagStmt->execute($itemIds);
            $tagsByItem = [];
            while ($row = $tagStmt->fetch()) {
                $tagsByItem[$row['archive_item_id']][] = [
                    'name' => $row['name'],
                    'slug' => $row['slug']
                ];
            }

            foreach ($items as &$item) {
                $item['tags'] = $tagsByItem[$item['id']] ?? [];
            }
        }

        return $items;
    }

    public static function findPendingReview(): array {
        $pdo = Database::getConnection();
        $sql = "SELECT ai.*, 
                       l.name as location_name,
                       u.full_name as submitter_name, u.email as submitter_email,
                       m.id as primary_media_id, m.storage_key as primary_media_key, m.alt_text as primary_media_alt
                FROM archive_items ai
                LEFT JOIN locations l ON l.id = ai.location_id
                LEFT JOIN users u ON u.id = ai.submitted_by
                LEFT JOIN media_assets m ON m.archive_item_id = ai.id AND m.is_primary = 1
                WHERE ai.status = 'pending_review'
                GROUP BY ai.id
                ORDER BY ai.created_at ASC";
        $stmt = $pdo->query($sql);
        return $stmt->fetchAll();
    }

    public static function create(array $data): int {
        $pdo = Database::getConnection();
        $sql = "INSERT INTO archive_items 
            (title, item_type, summary, description, location_id, region, latitude, longitude,
             capture_date, historical_period, language, creator, source, rights_status,
             attribution_text, status, visibility, submitted_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $data['title'],
            $data['item_type'],
            $data['summary'],
            $data['description'] ?? null,
            $data['location_id'] ?? null,
            $data['region'],
            $data['latitude'] ?? null,
            $data['longitude'] ?? null,
            !empty($data['capture_date']) ? $data['capture_date'] : null,
            $data['historical_period'] ?? null,
            $data['language'] ?? 'English',
            $data['creator'] ?? null,
            $data['source'],
            $data['rights_status'] ?? 'unknown',
            $data['attribution_text'] ?? null,
            $data['status'] ?? 'draft',
            $data['visibility'] ?? 'public',
            $data['submitted_by']
        ]);
        return (int)$pdo->lastInsertId();
    }

    public static function update(int $id, array $data): bool {
        $pdo = Database::getConnection();
        $fields = [
            'title = ?',
            'item_type = ?',
            'summary = ?',
            'description = ?',
            'location_id = ?',
            'region = ?',
            'latitude = ?',
            'longitude = ?',
            'capture_date = ?',
            'historical_period = ?',
            'language = ?',
            'creator = ?',
            'source = ?',
            'rights_status = ?',
            'attribution_text = ?',
            'status = ?',
            'visibility = ?'
        ];
        $values = [
            $data['title'],
            $data['item_type'],
            $data['summary'],
            $data['description'] ?? null,
            $data['location_id'] ?? null,
            $data['region'],
            $data['latitude'] ?? null,
            $data['longitude'] ?? null,
            !empty($data['capture_date']) ? $data['capture_date'] : null,
            $data['historical_period'] ?? null,
            $data['language'] ?? 'English',
            $data['creator'] ?? null,
            $data['source'],
            $data['rights_status'] ?? 'unknown',
            $data['attribution_text'] ?? null,
            $data['status'] ?? 'draft',
            $data['visibility'] ?? 'public'
        ];

        $values[] = $id;
        $sql = "UPDATE archive_items SET " . implode(', ', $fields) . " WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        return $stmt->execute($values);
    }

    public static function updateStatus(int $id, string $status, ?int $reviewerId = null, ?string $reason = null): bool {
        $pdo = Database::getConnection();
        $sql = "UPDATE archive_items 
                SET status = ?, 
                    reviewed_by = ?, 
                    reviewed_at = CURRENT_TIMESTAMP, 
                    rejection_reason = ? 
                WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        return $stmt->execute([$status, $reviewerId, $reason, $id]);
    }

    public static function getRelatedItems(int $id): array {
        $pdo = Database::getConnection();
        $item = self::findById($id);
        if (!$item) return [];

        $tagIds = !empty($item['tags']) ? array_column($item['tags'], 'id') : [];

        if (!empty($tagIds)) {
            $inClause = implode(',', array_fill(0, count($tagIds), '?'));
            $sql = "SELECT DISTINCT ai.id, ai.title, ai.item_type, ai.summary, ai.region,
                           m.id as primary_media_id, m.storage_key as primary_media_key, m.alt_text as primary_media_alt
                    FROM archive_items ai
                    JOIN archive_item_tags ait ON ait.archive_item_id = ai.id
                    LEFT JOIN media_assets m ON m.archive_item_id = ai.id AND m.is_primary = 1
                    WHERE ai.id != ? 
                      AND ai.status = 'published' 
                      AND ai.visibility = 'public'
                      AND ait.tag_id IN ($inClause)
                    GROUP BY ai.id
                    LIMIT 4";
            $bindings = array_merge([$id], $tagIds);
            $stmt = $pdo->prepare($sql);
            $stmt->execute($bindings);
            $related = $stmt->fetchAll();
            if (!empty($related)) {
                return $related;
            }
        }

        // Fallback: match by same region
        $sql = "SELECT DISTINCT ai.id, ai.title, ai.item_type, ai.summary, ai.region,
                       m.id as primary_media_id, m.storage_key as primary_media_key, m.alt_text as primary_media_alt
                FROM archive_items ai
                LEFT JOIN media_assets m ON m.archive_item_id = ai.id AND m.is_primary = 1
                WHERE ai.id != ? 
                  AND ai.status = 'published' 
                  AND ai.visibility = 'public'
                  AND ai.region = ?
                GROUP BY ai.id
                LIMIT 4";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$id, $item['region']]);
        return $stmt->fetchAll();
    }

    public static function syncTags(int $itemId, array $tags): void {
        $pdo = Database::getConnection();
        $pdo->beginTransaction();
        try {
            // Remove existing tag associations
            $delStmt = $pdo->prepare("DELETE FROM archive_item_tags WHERE archive_item_id = ?");
            $delStmt->execute([$itemId]);

            $findTag = $pdo->prepare("SELECT id FROM tags WHERE slug = ? OR name = ? LIMIT 1");
            $insTag = $pdo->prepare("INSERT INTO tags (name, slug) VALUES (?, ?)");
            $insAssoc = $pdo->prepare("INSERT IGNORE INTO archive_item_tags (archive_item_id, tag_id) VALUES (?, ?)");

            foreach ($tags as $tag) {
                $name = trim(is_array($tag) ? ($tag['name'] ?? '') : $tag);
                if ($name === '') continue;

                $slug = strtolower(preg_replace('/[^a-zA-Z0-9]+/', '-', $name));
                $slug = trim($slug, '-');

                $findTag->execute([$slug, $name]);
                $tagId = $findTag->fetchColumn();

                if (!$tagId) {
                    $insTag->execute([$name, $slug]);
                    $tagId = $pdo->lastInsertId();
                }

                $insAssoc->execute([$itemId, $tagId]);
            }

            $pdo->commit();
        } catch (\Exception $e) {
            $pdo->rollBack();
            throw $e;
        }
    }
}

