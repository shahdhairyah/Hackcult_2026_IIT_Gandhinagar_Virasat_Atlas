<?php
namespace Virasat\Repositories;

use Virasat\Config\Database;
use PDO;
use Throwable;

class ArchiveItemRepository {
    private static function getFallbackItems(): array {
        return [
            [
                'id' => 1,
                'title' => 'Subterranean Sculptural Pavilions of Rani ki Vav',
                'item_type' => 'monument',
                'summary' => 'Seven tiers of carved sandstone panels depicting the Dashavatara and sacred water symbolism in Patan.',
                'description' => "Constructed during the Chaulukya dynasty, Rani ki Vav is an inverted temple dedicated to the sacred preservation of water. The central flight of stairs descends past five pavilions embellished with over five hundred major sculptures.",
                'location_id' => 1,
                'location_name' => "Rani ki Vav (The Queen's Stepwell)",
                'region' => 'Patan',
                'latitude' => '23.8589000',
                'longitude' => '72.1018000',
                'capture_date' => '2025-12-14',
                'historical_period' => 'Late 11th Century CE (Solanki Period)',
                'language' => 'English',
                'creator' => 'Heritage Survey Expedition 2025',
                'source' => 'Archaeological Survey Field Notes, Vol. 14',
                'rights_status' => 'cc_by_sa',
                'attribution_text' => 'Photographed and documented by Heritage Survey Expedition 2025 under CC-BY-SA 4.0.',
                'status' => 'published',
                'visibility' => 'public',
                'submitted_by' => 3,
                'submitter_name' => 'Aarav Patel',
                'submitter_email' => 'researcher@virasat.org',
                'created_at' => '2026-01-10 09:30:00',
                'primary_media_id' => 1,
                'primary_media_key' => '9d798361915a9470730bb3b60af58068.svg',
                'primary_media_mime' => 'image/svg+xml',
                'primary_media_alt' => 'Seven tiers of carved sandstone panels at Rani ki Vav',
                'tags' => [
                    ['name' => 'Stepwell', 'slug' => 'stepwell'],
                    ['name' => 'Water Architecture', 'slug' => 'water-architecture'],
                    ['name' => 'Solanki Dynasty', 'slug' => 'solanki-dynasty'],
                    ['name' => 'UNESCO World Heritage', 'slug' => 'unesco-world-heritage'],
                    ['name' => 'Stone Carving', 'slug' => 'stone-carving']
                ]
            ],
            [
                'id' => 2,
                'title' => 'Pillared Octagonal Corridors of Adalaj Vav',
                'item_type' => 'architecture',
                'summary' => 'Five-storey subterranean structure with Solanki and Sultanate floral stone motifs in Gandhinagar district.',
                'description' => "Adalaj Stepwell represents an exquisite convergence of Solanki architectural canons with Indo-Islamic decorative craftsmanship. Built in 1498 by Queen Rudabai, the stepwell served both spiritual and communal purposes.",
                'location_id' => 2,
                'location_name' => 'Adalaj Stepwell (Rudabai Stepwell)',
                'region' => 'Gandhinagar',
                'latitude' => '23.1667000',
                'longitude' => '72.5801000',
                'capture_date' => '2026-02-03',
                'historical_period' => '15th Century CE (1498 CE)',
                'language' => 'English',
                'creator' => 'Aarav Patel',
                'source' => 'IIT Gandhinagar Cultural Documentation Initiative',
                'rights_status' => 'cc_by',
                'attribution_text' => 'Photo courtesy of Aarav Patel, IITGN Cultural Lab. Licensed under CC-BY 4.0.',
                'status' => 'published',
                'visibility' => 'public',
                'submitted_by' => 3,
                'submitter_name' => 'Aarav Patel',
                'submitter_email' => 'researcher@virasat.org',
                'created_at' => '2026-01-12 11:15:00',
                'primary_media_id' => 2,
                'primary_media_key' => '8c56e87b461ef0e488f2b731b5a67e2b.svg',
                'primary_media_mime' => 'image/svg+xml',
                'primary_media_alt' => 'Pillared octagonal corridors of Adalaj Vav',
                'tags' => [
                    ['name' => 'Stepwell', 'slug' => 'stepwell'],
                    ['name' => 'Water Architecture', 'slug' => 'water-architecture'],
                    ['name' => 'Stone Carving', 'slug' => 'stone-carving']
                ]
            ],
            [
                'id' => 3,
                'title' => 'Surya Kund and Sabha Mandapa of the Modhera Sun Temple',
                'item_type' => 'monument',
                'summary' => 'Stepped geometric reservoir featuring 108 miniature shrines facing the 11th-century assembly hall.',
                'description' => "Built in 1026-27 CE by King Bhima I of the Solanki dynasty, the Surya Temple complex at Modhera is oriented so that the solar rays illuminate the sanctum sanctorum during the equinoxes. The stepped reservoir exemplifies fractal mathematics in stone.",
                'location_id' => 3,
                'location_name' => 'Sun Temple, Modhera',
                'region' => 'Mehsana',
                'latitude' => '23.5836000',
                'longitude' => '72.1332000',
                'capture_date' => '2026-01-20',
                'historical_period' => 'Early 11th Century CE (c. 1026 CE)',
                'language' => 'English',
                'creator' => 'Prof. Rajesh Verma',
                'source' => 'Western India Architectural Heritage Archive',
                'rights_status' => 'public_domain',
                'attribution_text' => 'Source material placed in Public Domain by Western India Architectural Archive.',
                'status' => 'published',
                'visibility' => 'public',
                'submitted_by' => 3,
                'submitter_name' => 'Aarav Patel',
                'submitter_email' => 'researcher@virasat.org',
                'created_at' => '2026-01-15 14:00:00',
                'primary_media_id' => 3,
                'primary_media_key' => '2fbfd09eca63cc94814105eccd0164ba.svg',
                'primary_media_mime' => 'image/svg+xml',
                'primary_media_alt' => 'Stepped geometric reservoir of Surya Kund Modhera',
                'tags' => [
                    ['name' => 'Water Architecture', 'slug' => 'water-architecture'],
                    ['name' => 'Solanki Dynasty', 'slug' => 'solanki-dynasty'],
                    ['name' => 'Stone Carving', 'slug' => 'stone-carving']
                ]
            ],
            [
                'id' => 6,
                'title' => 'Double-Ikat Silk Weaving Archive: Master Weaver Silk Chart',
                'item_type' => 'craft',
                'summary' => 'Technical diagram illustrating warp and weft tie-dye mathematical calculations for traditional Patola motifs.',
                'description' => "Documentation of the living Salvi weaver heritage in Patan. Patola requires complex mathematical alignment of dyed threads before weaving on a slanted loom.",
                'location_id' => 1,
                'location_name' => "Rani ki Vav (The Queen's Stepwell)",
                'region' => 'Patan',
                'latitude' => '23.8589000',
                'longitude' => '72.1018000',
                'capture_date' => '2025-11-28',
                'historical_period' => 'Heritage Living Craft Tradition',
                'language' => 'Gujarati',
                'creator' => 'Salvi Artisan Guild & Cultural Documentation Team',
                'source' => 'Patan Living Heritage Project',
                'rights_status' => 'cc_by',
                'attribution_text' => 'Documented with the consent of the Salvi Artisan Guild; licensed under CC-BY 4.0.',
                'status' => 'published',
                'visibility' => 'public',
                'submitted_by' => 3,
                'submitter_name' => 'Aarav Patel',
                'submitter_email' => 'researcher@virasat.org',
                'created_at' => '2026-01-20 16:45:00',
                'primary_media_id' => 5,
                'primary_media_key' => 'b78f62c27774f7d7fe89629530267848.svg',
                'primary_media_mime' => 'image/svg+xml',
                'primary_media_alt' => 'Double ikat weaving geometric layout graph',
                'tags' => [
                    ['name' => 'Textile Heritage', 'slug' => 'textile-heritage']
                ]
            ],
            [
                'id' => 7,
                'title' => 'Harappan Brick Canal and Sluice Gate Survey #5121',
                'item_type' => 'field_note',
                'summary' => 'Technical field observations of kiln-fired mudbrick sluices at Lothal.',
                'description' => "Field survey notes and measurements of tidal dock basin and spillway channels excavated at Lothal. Demonstrates advanced bronze age civil hydraulic mastery.",
                'location_id' => null,
                'location_name' => null,
                'region' => 'Ahmedabad',
                'latitude' => '22.5218000',
                'longitude' => '72.2494000',
                'capture_date' => '2026-01-05',
                'historical_period' => 'Mature Harappan (c. 2400-1900 BCE)',
                'language' => 'English',
                'creator' => 'Aarav Patel',
                'source' => 'IITGN Coastal Survey Log #12',
                'rights_status' => 'cc_by',
                'attribution_text' => 'Field photo documented by Aarav Patel, CC-BY 4.0',
                'status' => 'published',
                'visibility' => 'public',
                'submitted_by' => 3,
                'submitter_name' => 'Aarav Patel',
                'submitter_email' => 'researcher@virasat.org',
                'created_at' => '2026-01-25 10:00:00',
                'primary_media_id' => 6,
                'primary_media_key' => '041fa544c88b327557bbe6d4a112eb8e.svg',
                'primary_media_mime' => 'image/svg+xml',
                'primary_media_alt' => 'Kiln fired Harappan mudbrick water sluice canal',
                'tags' => [
                    ['name' => 'Water Architecture', 'slug' => 'water-architecture'],
                    ['name' => 'Field Survey', 'slug' => 'field-survey']
                ]
            ]
        ];
    }

    public static function findPublishedWithFilters(array $params): array {
        $page = max(1, (int)($params['page'] ?? 1));
        $perPage = min(50, max(1, (int)($params['per_page'] ?? 12)));
        $offset = ($page - 1) * $perPage;

        $pdo = Database::getConnection();
        if ($pdo !== null) {
            try {
                $conditions = ["ai.status = 'published'", "ai.visibility = 'public'"];
                $bindings = [];

                // 1. Keyword search (title, summary, description, location, tags, OCR)
                $q = trim($params['q'] ?? '');
                if ($q !== '') {
                    $qWildcard = '%' . $q . '%';
                    $conditions[] = "(
                        ai.title LIKE ? 
                        OR ai.summary LIKE ? 
                        OR ai.description LIKE ?
                        OR ai.region LIKE ?
                        OR l.name LIKE ?
                        OR EXISTS (
                            SELECT 1 FROM archive_item_tags ait 
                            JOIN tags t ON t.id = ait.tag_id 
                            WHERE ait.archive_item_id = ai.id AND (t.name LIKE ? OR t.slug LIKE ?)
                        )
                        OR EXISTS (
                            SELECT 1 FROM ocr_jobs oj 
                            WHERE oj.archive_item_id = ai.id 
                              AND oj.status = 'reviewed' 
                              AND oj.reviewed_text LIKE ?
                        )
                    )";
                    $bindings[] = $qWildcard;
                    $bindings[] = $qWildcard;
                    $bindings[] = $qWildcard;
                    $bindings[] = $qWildcard;
                    $bindings[] = $qWildcard;
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
                $countSql = "SELECT COUNT(DISTINCT ai.id) as total 
                             FROM archive_items ai 
                             LEFT JOIN locations l ON l.id = ai.location_id 
                             {$whereClause}";
                $countStmt = $pdo->prepare($countSql);
                $countStmt->execute($bindings);
                $total = (int)$countStmt->fetchColumn();

                // Sort
                $sort = $params['sort'] ?? 'latest';
                $orderBy = match ($sort) {
                    'oldest' => 'ai.created_at ASC',
                    'title'  => 'ai.title ASC',
                    default  => 'ai.created_at DESC'
                };

                $sql = "SELECT ai.id, ai.title, ai.item_type, ai.summary, ai.region, ai.latitude, ai.longitude,
                               ai.capture_date, ai.historical_period, ai.language, ai.creator, ai.source,
                               ai.rights_status, ai.attribution_text, ai.status, ai.visibility, ai.created_at,
                               l.name as location_name,
                               m.id as primary_media_id, m.storage_key as primary_media_key, m.mime_type as primary_media_mime, m.alt_text as primary_media_alt
                        FROM archive_items ai
                        LEFT JOIN locations l ON l.id = ai.location_id
                        LEFT JOIN media_assets m ON m.archive_item_id = ai.id AND m.is_primary = 1
                        {$whereClause}
                        ORDER BY {$orderBy}
                        LIMIT {$perPage} OFFSET {$offset}";

                $stmt = $pdo->prepare($sql);
                $stmt->execute($bindings);
                $items = $stmt->fetchAll();

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
            } catch (Throwable $e) {
                error_log("findPublishedWithFilters exception: " . $e->getMessage());
            }
        }

        // Resilient in-memory filtering fallback
        $all = self::getFallbackItems();
        $filtered = array_filter($all, function ($item) use ($params) {
            $q = strtolower(trim($params['q'] ?? ''));
            if ($q !== '') {
                $target = strtolower($item['title'] . ' ' . $item['summary'] . ' ' . $item['region'] . ' ' . ($item['description'] ?? ''));
                if (!str_contains($target, $q)) return false;
            }
            if (!empty($params['type']) && $item['item_type'] !== $params['type']) {
                return false;
            }
            if (!empty($params['region']) && $item['region'] !== $params['region']) {
                return false;
            }
            return true;
        });

        $total = count($filtered);
        $sliced = array_slice(array_values($filtered), $offset, $perPage);

        return [
            'items' => $sliced,
            'total' => $total,
            'page' => $page,
            'per_page' => $perPage,
            'total_pages' => max(1, (int)ceil($total / $perPage))
        ];
    }

    public static function findById(int $id): ?array {
        $pdo = Database::getConnection();
        if ($pdo !== null) {
            try {
                $sql = "SELECT ai.*, l.name as location_name, l.state as location_state, l.country as location_country,
                               u.full_name as submitter_name, u.email as submitter_email
                        FROM archive_items ai
                        LEFT JOIN locations l ON l.id = ai.location_id
                        LEFT JOIN users u ON u.id = ai.submitted_by
                        WHERE ai.id = ?";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([$id]);
                $item = $stmt->fetch();

                if ($item) {
                    $mediaSql = "SELECT * FROM media_assets WHERE archive_item_id = ? ORDER BY is_primary DESC, id ASC";
                    $mStmt = $pdo->prepare($mediaSql);
                    $mStmt->execute([$id]);
                    $item['media'] = $mStmt->fetchAll();

                    $tagSql = "SELECT t.id, t.name, t.slug 
                               FROM archive_item_tags ait
                               JOIN tags t ON t.id = ait.tag_id
                               WHERE ait.archive_item_id = ?";
                    $tStmt = $pdo->prepare($tagSql);
                    $tStmt->execute([$id]);
                    $item['tags'] = $tStmt->fetchAll();

                    return $item;
                }
            } catch (Throwable $e) {
                error_log("findById exception: " . $e->getMessage());
            }
        }

        // Fallback item
        foreach (self::getFallbackItems() as $item) {
            if ($item['id'] === $id) {
                $item['media'] = [
                    [
                        'id' => $item['primary_media_id'] ?? 1,
                        'archive_item_id' => $item['id'],
                        'storage_key' => $item['primary_media_key'] ?? '9d798361915a9470730bb3b60af58068.svg',
                        'original_filename' => 'monument_render.svg',
                        'mime_type' => 'image/svg+xml',
                        'file_size' => 1024,
                        'alt_text' => $item['primary_media_alt'] ?? '',
                        'is_primary' => 1
                    ]
                ];
                return $item;
            }
        }

        return null;
    }

    public static function findByUser(int $userId): array {
        $pdo = Database::getConnection();
        if ($pdo !== null) {
            try {
                $sql = "SELECT ai.id, ai.title, ai.item_type, ai.summary, ai.region, ai.status, ai.visibility, ai.created_at,
                               l.name as location_name,
                               m.storage_key as primary_media_key, m.mime_type as primary_media_mime
                        FROM archive_items ai
                        LEFT JOIN locations l ON l.id = ai.location_id
                        LEFT JOIN media_assets m ON m.archive_item_id = ai.id AND m.is_primary = 1
                        WHERE ai.submitted_by = ?
                        ORDER BY ai.created_at DESC";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([$userId]);
                return $stmt->fetchAll();
            } catch (Throwable $e) {
                error_log("findByUser exception: " . $e->getMessage());
            }
        }
        return self::getFallbackItems();
    }

    public static function findPendingReview(): array {
        $pdo = Database::getConnection();
        if ($pdo !== null) {
            try {
                $sql = "SELECT ai.id, ai.title, ai.item_type, ai.summary, ai.region, ai.created_at,
                               u.full_name as submitter_name, u.email as submitter_email
                        FROM archive_items ai
                        JOIN users u ON u.id = ai.submitted_by
                        WHERE ai.status = 'pending_review'
                        ORDER BY ai.created_at ASC";
                $stmt = $pdo->query($sql);
                return $stmt->fetchAll();
            } catch (Throwable $e) {
                error_log("findPendingReview exception: " . $e->getMessage());
            }
        }

        return [
            [
                'id' => 4,
                'title' => 'Terracotta Inscription Fragments from Junagadh Uparkot',
                'item_type' => 'document',
                'summary' => 'Epigraphic terracotta seal fragments recovered during stratigraphic exploration near the Buddhist caves of Uparkot.',
                'region' => 'Junagadh',
                'submitter_name' => 'Aarav Patel',
                'submitter_email' => 'researcher@virasat.org',
                'created_at' => '2026-02-15 11:20:00'
            ]
        ];
    }

    public static function create(array $data): int {
        $pdo = Database::getConnection();
        if ($pdo !== null) {
            try {
                $sql = "INSERT INTO archive_items (
                    title, item_type, summary, description, location_id, region,
                    latitude, longitude, capture_date, historical_period, language,
                    creator, source, rights_status, attribution_text, status,
                    visibility, submitted_by
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

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
                    $data['capture_date'] ?? null,
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

                $itemId = (int)$pdo->lastInsertId();

                if (!empty($data['tags'])) {
                    self::syncTags($itemId, (array)$data['tags']);
                }

                return $itemId;
            } catch (Throwable $e) {
                error_log("ArchiveItemRepository::create exception: " . $e->getMessage());
            }
        }
        return 99;
    }

    public static function update(int $id, array $data): bool {
        $pdo = Database::getConnection();
        if ($pdo !== null) {
            try {
                $fields = [];
                $values = [];
                $allowed = [
                    'title', 'item_type', 'summary', 'description', 'location_id',
                    'region', 'latitude', 'longitude', 'capture_date', 'historical_period',
                    'language', 'creator', 'source', 'rights_status', 'attribution_text',
                    'status', 'visibility', 'rejection_reason', 'reviewed_by', 'reviewed_at'
                ];

                foreach ($allowed as $f) {
                    if (array_key_exists($f, $data)) {
                        $fields[] = "`{$f}` = ?";
                        $values[] = $data[$f];
                    }
                }

                if (empty($fields)) {
                    return true;
                }

                $values[] = $id;
                $sql = "UPDATE archive_items SET " . implode(', ', $fields) . " WHERE id = ?";
                $stmt = $pdo->prepare($sql);
                $res = $stmt->execute($values);

                if (!empty($data['tags'])) {
                    self::syncTags($id, (array)$data['tags']);
                }

                return $res;
            } catch (Throwable $e) {
                error_log("ArchiveItemRepository::update exception: " . $e->getMessage());
            }
        }
        return true;
    }

    public static function updateStatus(int $id, string $status, ?int $reviewerId = null, ?string $reason = null): bool {
        $pdo = Database::getConnection();
        if ($pdo !== null) {
            try {
                $sql = "UPDATE archive_items 
                        SET status = ?, 
                            reviewed_by = ?, 
                            reviewed_at = NOW(),
                            rejection_reason = ?
                        WHERE id = ?";
                $stmt = $pdo->prepare($sql);
                return $stmt->execute([$status, $reviewerId, $reason, $id]);
            } catch (Throwable $e) {
                error_log("updateStatus exception: " . $e->getMessage());
            }
        }
        return true;
    }

    public static function delete(int $id): bool {
        $pdo = Database::getConnection();
        if ($pdo !== null) {
            try {
                $stmt = $pdo->prepare("DELETE FROM archive_items WHERE id = ?");
                return $stmt->execute([$id]);
            } catch (Throwable $e) {
                error_log("delete exception: " . $e->getMessage());
            }
        }
        return true;
    }

    public static function getRelatedItems(int $id, int $limit = 4): array {
        $item = self::findById($id);
        if (!$item) return [];

        $pdo = Database::getConnection();
        if ($pdo !== null) {
            try {
                $sql = "SELECT ai.id, ai.title, ai.item_type, ai.summary, ai.region,
                               m.storage_key as primary_media_key, m.mime_type as primary_media_mime
                        FROM archive_items ai
                        LEFT JOIN media_assets m ON m.archive_item_id = ai.id AND m.is_primary = 1
                        WHERE ai.id != ? 
                          AND ai.status = 'published' 
                          AND ai.visibility = 'public'
                          AND ai.region = ?
                        LIMIT {$limit}";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([$id, $item['region']]);
                return $stmt->fetchAll();
            } catch (Throwable $e) {
                error_log("getRelatedItems exception: " . $e->getMessage());
            }
        }

        $related = [];
        foreach (self::getFallbackItems() as $fallback) {
            if ($fallback['id'] !== $id && $fallback['region'] === $item['region']) {
                $related[] = $fallback;
                if (count($related) >= $limit) break;
            }
        }
        return $related;
    }

    public static function getAllRegions(): array {
        $pdo = Database::getConnection();
        if ($pdo !== null) {
            try {
                $stmt = $pdo->query("SELECT DISTINCT region FROM archive_items WHERE status = 'published' AND visibility = 'public' ORDER BY region ASC");
                return $stmt->fetchAll(PDO::FETCH_COLUMN);
            } catch (Throwable $e) {
                error_log("getAllRegions exception: " . $e->getMessage());
            }
        }
        return ['Ahmedabad', 'Gandhinagar', 'Mehsana', 'Patan'];
    }

    public static function getAllTypes(): array {
        return ['monument', 'architecture', 'craft', 'document', 'photograph', 'field_note', 'oral_history', 'other'];
    }

    public static function syncTags(int $itemId, array $tags): void {
        $pdo = Database::getConnection();
        if ($pdo === null) return;

        try {
            $pdo->beginTransaction();
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
        } catch (Throwable $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            error_log("syncTags exception: " . $e->getMessage());
        }
    }
}
