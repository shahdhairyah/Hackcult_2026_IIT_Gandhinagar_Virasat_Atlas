<?php
namespace Virasat\Repositories;

use Virasat\Config\Database;
use PDO;
use Throwable;

class CollectionRepository {
    private static function getFallbackCollections(): array {
        return [
            [
                'id' => 1,
                'title' => 'Subterranean Water Architecture of Gujarat',
                'slug' => 'water-architecture-gujarat',
                'summary' => 'Comprehensive spatial and architectural cataloguing of stepped water corridors, cisterns, and vavs from the 11th to 16th centuries.',
                'description' => 'This collection highlights Gujarat\'s unique stepwell structures combining hydraulic engineering with temple architecture.',
                'curator_id' => 1,
                'curator_name' => 'Dr. Sunita Sen',
                'cover_image_url' => null,
                'is_published' => 1,
                'created_at' => '2026-01-10 10:00:00',
                'item_count' => 2,
                'items' => [
                    [
                        'id' => 1,
                        'title' => 'Subterranean Sculptural Pavilions of Rani ki Vav',
                        'item_type' => 'monument',
                        'summary' => 'Seven tiers of carved sandstone panels depicting the Dashavatara and sacred water symbolism in Patan.',
                        'region' => 'Patan',
                        'latitude' => '23.8589000',
                        'longitude' => '72.1018000',
                        'item_order' => 1,
                        'curator_notes' => 'Masterpiece of Solanki subterranean craftsmanship.',
                        'primary_media_key' => '9d798361915a9470730bb3b60af58068.svg',
                        'primary_media_alt' => 'Seven tiers of carved sandstone panels at Rani ki Vav'
                    ],
                    [
                        'id' => 2,
                        'title' => 'Pillared Octagonal Corridors of Adalaj Vav',
                        'item_type' => 'architecture',
                        'summary' => 'Five-storey subterranean structure with Solanki and Sultanate floral stone motifs in Gandhinagar district.',
                        'region' => 'Gandhinagar',
                        'latitude' => '23.1667000',
                        'longitude' => '72.5801000',
                        'item_order' => 2,
                        'curator_notes' => 'Unique integration of Solanki and Indo-Islamic sculptural elements.',
                        'primary_media_key' => '8c56e87b461ef0e488f2b731b5a67e2b.svg',
                        'primary_media_alt' => 'Pillared octagonal corridors of Adalaj Vav'
                    ]
                ]
            ],
            [
                'id' => 2,
                'title' => 'Solanki Dynasty Imperial Architecture & Living Crafts',
                'slug' => 'solanki-dynasty',
                'summary' => 'Masterworks commissioned under Chaulukya patronage in Northern Gujarat, featuring stepped ponds, geometric ornamentation, and Patan Patola textiles.',
                'description' => 'Exemplars of Chaulukya architectural and textile genius.',
                'curator_id' => 2,
                'curator_name' => 'Prof. Rajesh Verma',
                'cover_image_url' => null,
                'is_published' => 1,
                'created_at' => '2026-01-15 14:00:00',
                'item_count' => 2,
                'items' => [
                    [
                        'id' => 3,
                        'title' => 'Surya Kund and Sabha Mandapa of the Modhera Sun Temple',
                        'item_type' => 'monument',
                        'summary' => 'Stepped geometric reservoir featuring 108 miniature shrines facing the 11th-century assembly hall.',
                        'region' => 'Mehsana',
                        'latitude' => '23.5836000',
                        'longitude' => '72.1332000',
                        'item_order' => 1,
                        'curator_notes' => 'Orientation aligned precisely to solar equinox.',
                        'primary_media_key' => '2fbfd09eca63cc94814105eccd0164ba.svg',
                        'primary_media_alt' => 'Stepped geometric reservoir of Surya Kund Modhera'
                    ],
                    [
                        'id' => 6,
                        'title' => 'Double-Ikat Silk Weaving Archive: Master Weaver Silk Chart',
                        'item_type' => 'craft',
                        'summary' => 'Technical diagram illustrating warp and weft tie-dye mathematical calculations for traditional Patola motifs.',
                        'region' => 'Patan',
                        'latitude' => '23.8589000',
                        'longitude' => '72.1018000',
                        'item_order' => 2,
                        'curator_notes' => 'Patan living silk weaving heritage documentation.',
                        'primary_media_key' => 'b78f62c27774f7d7fe89629530267848.svg',
                        'primary_media_alt' => 'Double ikat weaving geometric layout graph'
                    ]
                ]
            ]
        ];
    }

    public static function findAllPublished(): array {
        $pdo = Database::getConnection();
        if ($pdo !== null) {
            try {
                $sql = "SELECT c.id, c.title, c.slug, c.summary, c.description, c.curator_id, c.cover_image_url, c.is_published, c.created_at,
                               u.full_name as curator_name, COUNT(ci.archive_item_id) as item_count
                        FROM collections c
                        JOIN users u ON u.id = c.curator_id
                        LEFT JOIN collection_items ci ON ci.collection_id = c.id
                        WHERE c.is_published = 1
                        GROUP BY c.id, c.title, c.slug, c.summary, c.description, c.curator_id, c.cover_image_url, c.is_published, c.created_at, u.full_name
                        ORDER BY c.created_at DESC";
                $stmt = $pdo->query($sql);
                return $stmt->fetchAll();
            } catch (Throwable $e) {
                error_log("CollectionRepository::findAllPublished exception: " . $e->getMessage());
            }
        }
        $cols = self::getFallbackCollections();
        foreach ($cols as &$col) {
            unset($col['items']);
        }
        return $cols;
    }

    public static function findById(int $id): ?array {
        $pdo = Database::getConnection();
        if ($pdo !== null) {
            try {
                $sql = "SELECT c.*, u.full_name as curator_name 
                        FROM collections c
                        JOIN users u ON u.id = c.curator_id
                        WHERE c.id = ?";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([$id]);
                $collection = $stmt->fetch();
                if ($collection) {
                    $itemSql = "SELECT ai.id, ai.title, ai.item_type, ai.summary, ai.region, ai.latitude, ai.longitude,
                                       ci.item_order, ci.curator_notes,
                                       m.storage_key as primary_media_key, m.alt_text as primary_media_alt
                                FROM collection_items ci
                                JOIN archive_items ai ON ai.id = ci.archive_item_id
                                LEFT JOIN media_assets m ON m.archive_item_id = ai.id AND m.is_primary = 1
                                WHERE ci.collection_id = ? AND ai.status = 'published' AND ai.visibility = 'public'
                                ORDER BY ci.item_order ASC";
                    $itemStmt = $pdo->prepare($itemSql);
                    $itemStmt->execute([$id]);
                    $collection['items'] = $itemStmt->fetchAll();
                    return $collection;
                }
            } catch (Throwable $e) {
                error_log("CollectionRepository::findById exception: " . $e->getMessage());
            }
        }

        foreach (self::getFallbackCollections() as $col) {
            if ($col['id'] === $id) return $col;
        }
        return null;
    }

    public static function create(array $data): int {
        $pdo = Database::getConnection();
        if ($pdo !== null) {
            try {
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
            } catch (Throwable $e) {
                error_log("CollectionRepository::create exception: " . $e->getMessage());
            }
        }
        return 99;
    }

    public static function setItems(int $collectionId, array $items): bool {
        $pdo = Database::getConnection();
        if ($pdo !== null) {
            try {
                $pdo->beginTransaction();
                $del = $pdo->prepare("DELETE FROM collection_items WHERE collection_id = ?");
                $del->execute([$collectionId]);

                $ins = $pdo->prepare("INSERT INTO collection_items (collection_id, archive_item_id, item_order, curator_notes) VALUES (?, ?, ?, ?)");
                foreach ($items as $idx => $item) {
                    $itemId = is_array($item) ? (int)$item['archive_item_id'] : (int)$item;
                    $notes = is_array($item) ? ($item['curator_notes'] ?? null) : null;
                    $ins->execute([$collectionId, $itemId, $idx + 1, $notes]);
                }
                $pdo->commit();
                return true;
            } catch (Throwable $e) {
                $pdo->rollBack();
                error_log("CollectionRepository::setItems exception: " . $e->getMessage());
            }
        }
        return true;
    }
}
