<?php
namespace Virasat\Config;

use PDO;
use Exception;
use Throwable;

class Database {
    private static ?PDO $connection = null;
    private static bool $schemaChecked = false;
    private static bool $isFallback = false;
    private static ?string $lastError = null;

    public static function getConnection(): ?PDO {
        if (self::$connection !== null) {
            return self::$connection;
        }

        if (self::$isFallback) {
            return null;
        }

        $host = Env::get('DB_HOST', 'sql308.infinityfree.com');
        $port = Env::get('DB_PORT', '3306');
        $db   = Env::get('DB_DATABASE', 'if0_43194312_hackcult26');
        $user = Env::get('DB_USERNAME', 'if0_43194312');
        $pass = Env::get('DB_PASSWORD', 'WWeqIqyQcPCcYy');

        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
            PDO::ATTR_TIMEOUT            => 3,
        ];

        // Connection attempts in order of compatibility
        $dsns = [
            "mysql:host={$host};dbname={$db};charset=utf8mb4",
            "mysql:host={$host};port={$port};dbname={$db};charset=utf8mb4",
            "mysql:host={$host};dbname={$db}"
        ];

        $lastError = null;
        foreach ($dsns as $dsn) {
            try {
                self::$connection = new PDO($dsn, $user, $pass, $options);
                break;
            } catch (Throwable $e) {
                $lastError = $e->getMessage();
            }
        }

        if (self::$connection === null) {
            self::$isFallback = true;
            self::$lastError = $lastError;
            error_log("Database connection failed: {$lastError}. Resilient offline mode active.");
            return null;
        }

        try {
            self::$connection->exec("SET NAMES utf8mb4");
            self::$connection->exec("SET SESSION sql_mode = 'NO_ENGINE_SUBSTITUTION'");
        } catch (Throwable $e) {
            // ignore
        }

        // Automatic self-healing: verify tables exist, auto-create & seed if empty
        if (!self::$schemaChecked) {
            self::$schemaChecked = true;
            self::ensureSchema(self::$connection);
        }

        return self::$connection;
    }

    public static function isFallback(): bool {
        return self::$isFallback;
    }

    public static function getLastError(): ?string {
        return self::$lastError;
    }

    public static function ensureSchema(PDO $pdo): void {
        try {
            $stmt = $pdo->query("SHOW TABLES LIKE 'archive_items'");
            if (!$stmt->fetch()) {
                self::autoInitSchema($pdo);
            }
        } catch (Throwable $e) {
            error_log("ensureSchema error: " . $e->getMessage());
        }
    }

    public static function autoInitSchema(PDO $pdo): void {
        try {
            $pdo->exec("SET FOREIGN_KEY_CHECKS = 0;");

            // 1. Users
            $pdo->exec("CREATE TABLE IF NOT EXISTS `users` (
              `id` INT AUTO_INCREMENT PRIMARY KEY,
              `email` VARCHAR(255) NOT NULL UNIQUE,
              `password_hash` VARCHAR(255) NOT NULL,
              `full_name` VARCHAR(255) NOT NULL,
              `role` ENUM('visitor', 'researcher', 'reviewer', 'admin') NOT NULL DEFAULT 'visitor',
              `organization` VARCHAR(255) NULL,
              `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              INDEX `idx_users_role` (`role`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

            // 2. Locations
            $pdo->exec("CREATE TABLE IF NOT EXISTS `locations` (
              `id` INT AUTO_INCREMENT PRIMARY KEY,
              `name` VARCHAR(255) NOT NULL,
              `region` VARCHAR(255) NOT NULL,
              `state` VARCHAR(255) NOT NULL DEFAULT 'Gujarat',
              `country` VARCHAR(255) NOT NULL DEFAULT 'India',
              `latitude` DECIMAL(10, 7) NULL,
              `longitude` DECIMAL(10, 7) NULL,
              `is_approximate` TINYINT(1) DEFAULT 0,
              `notes` TEXT NULL,
              `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              INDEX `idx_locations_region` (`region`),
              INDEX `idx_locations_coords` (`latitude`, `longitude`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

            // 3. Archive Items
            $pdo->exec("CREATE TABLE IF NOT EXISTS `archive_items` (
              `id` INT AUTO_INCREMENT PRIMARY KEY,
              `title` VARCHAR(255) NOT NULL,
              `item_type` ENUM('monument', 'architecture', 'craft', 'document', 'photograph', 'field_note', 'oral_history', 'other') NOT NULL,
              `summary` TEXT NOT NULL,
              `description` LONGTEXT NULL,
              `location_id` INT NULL,
              `region` VARCHAR(255) NOT NULL,
              `latitude` DECIMAL(10, 7) NULL,
              `longitude` DECIMAL(10, 7) NULL,
              `capture_date` DATE NULL,
              `historical_period` VARCHAR(255) NULL,
              `language` VARCHAR(50) DEFAULT 'English',
              `creator` VARCHAR(255) NULL,
              `source` VARCHAR(255) NOT NULL,
              `rights_status` ENUM('public_domain', 'cc_by', 'cc_by_sa', 'cc_by_nc', 'permission_granted', 'restricted', 'unknown') NOT NULL DEFAULT 'unknown',
              `attribution_text` TEXT NULL,
              `status` ENUM('draft', 'pending_review', 'published', 'rejected', 'archived') NOT NULL DEFAULT 'draft',
              `visibility` ENUM('public', 'unlisted', 'private') NOT NULL DEFAULT 'public',
              `rejection_reason` TEXT NULL,
              `submitted_by` INT NOT NULL,
              `reviewed_by` INT NULL,
              `reviewed_at` DATETIME NULL,
              `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              INDEX `idx_ai_status_vis` (`status`, `visibility`),
              INDEX `idx_ai_type` (`item_type`),
              INDEX `idx_ai_region` (`region`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

            // 4. Media Assets
            $pdo->exec("CREATE TABLE IF NOT EXISTS `media_assets` (
              `id` INT AUTO_INCREMENT PRIMARY KEY,
              `archive_item_id` INT NOT NULL,
              `storage_key` VARCHAR(255) NOT NULL,
              `original_filename` VARCHAR(255) NOT NULL,
              `mime_type` VARCHAR(100) NOT NULL,
              `file_size` BIGINT NOT NULL,
              `sha256_checksum` VARCHAR(64) NOT NULL,
              `alt_text` TEXT NULL,
              `caption` TEXT NULL,
              `is_primary` TINYINT(1) DEFAULT 0,
              `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              INDEX `idx_media_item` (`archive_item_id`),
              INDEX `idx_media_primary` (`archive_item_id`, `is_primary`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

            // 5. Tags
            $pdo->exec("CREATE TABLE IF NOT EXISTS `tags` (
              `id` INT AUTO_INCREMENT PRIMARY KEY,
              `name` VARCHAR(100) NOT NULL UNIQUE,
              `slug` VARCHAR(100) NOT NULL UNIQUE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

            // 6. Archive Item Tags
            $pdo->exec("CREATE TABLE IF NOT EXISTS `archive_item_tags` (
              `archive_item_id` INT NOT NULL,
              `tag_id` INT NOT NULL,
              PRIMARY KEY (`archive_item_id`, `tag_id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

            // 7. Collections
            $pdo->exec("CREATE TABLE IF NOT EXISTS `collections` (
              `id` INT AUTO_INCREMENT PRIMARY KEY,
              `title` VARCHAR(255) NOT NULL,
              `slug` VARCHAR(255) NOT NULL UNIQUE,
              `summary` TEXT NOT NULL,
              `description` LONGTEXT NULL,
              `cover_media_id` INT NULL,
              `is_published` TINYINT(1) DEFAULT 1,
              `created_by` INT NOT NULL,
              `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

            // 8. Collection Items
            $pdo->exec("CREATE TABLE IF NOT EXISTS `collection_items` (
              `collection_id` INT NOT NULL,
              `archive_item_id` INT NOT NULL,
              `sort_order` INT NOT NULL DEFAULT 0,
              `curator_note` TEXT NULL,
              PRIMARY KEY (`collection_id`, `archive_item_id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

            // 9. OCR Jobs
            $pdo->exec("CREATE TABLE IF NOT EXISTS `ocr_jobs` (
              `id` INT AUTO_INCREMENT PRIMARY KEY,
              `archive_item_id` INT NOT NULL,
              `media_asset_id` INT NULL,
              `language` VARCHAR(50) DEFAULT 'eng',
              `raw_extracted_text` LONGTEXT NULL,
              `reviewed_text` LONGTEXT NULL,
              `status` ENUM('pending', 'completed', 'reviewed', 'failed') NOT NULL DEFAULT 'pending',
              `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              `reviewed_at` DATETIME NULL,
              `reviewed_by` INT NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

            // 10. Audit Logs
            $pdo->exec("CREATE TABLE IF NOT EXISTS `audit_logs` (
              `id` INT AUTO_INCREMENT PRIMARY KEY,
              `user_id` INT NULL,
              `action` VARCHAR(100) NOT NULL,
              `entity_type` VARCHAR(100) NOT NULL,
              `entity_id` INT NOT NULL,
              `details` LONGTEXT NULL,
              `ip_address` VARCHAR(45) NULL,
              `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              INDEX `idx_audit_entity` (`entity_type`, `entity_id`),
              INDEX `idx_audit_action` (`action`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

            // 11. Saved Items
            $pdo->exec("CREATE TABLE IF NOT EXISTS `saved_items` (
              `id` INT AUTO_INCREMENT PRIMARY KEY,
              `user_id` INT NOT NULL,
              `archive_item_id` INT NOT NULL,
              `notes` TEXT NULL,
              `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              UNIQUE KEY `uk_user_item` (`user_id`, `archive_item_id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

            $pdo->exec("SET FOREIGN_KEY_CHECKS = 1;");

            // Check if users exist; if not, seed realistic data
            $uCheck = $pdo->query("SELECT COUNT(*) FROM `users`")->fetchColumn();
            if ((int)$uCheck === 0) {
                self::seedDefaultData($pdo);
            }
        } catch (Throwable $e) {
            error_log("autoInitSchema exception: " . $e->getMessage());
        }
    }

    private static function seedDefaultData(PDO $pdo): void {
        try {
            // Users
            $users = [
                ['email' => 'admin@virasat.org', 'password' => 'password123', 'name' => 'Dr. Sunita Sen', 'role' => 'admin', 'org' => 'National Heritage Archive Council'],
                ['email' => 'reviewer@virasat.org', 'password' => 'password123', 'name' => 'Prof. Rajesh Verma', 'role' => 'reviewer', 'org' => 'School of Architectural History'],
                ['email' => 'researcher@virasat.org', 'password' => 'password123', 'name' => 'Aarav Patel', 'role' => 'researcher', 'org' => 'IIT Gandhinagar Heritage Lab'],
                ['email' => 'visitor@virasat.org', 'password' => 'password123', 'name' => 'Neha Sharma', 'role' => 'visitor', 'org' => 'Independent Researcher']
            ];
            $uStmt = $pdo->prepare("INSERT INTO users (email, password_hash, full_name, role, organization) VALUES (?, ?, ?, ?, ?)");
            $uIds = [];
            foreach ($users as $u) {
                $uStmt->execute([$u['email'], password_hash($u['password'], PASSWORD_BCRYPT), $u['name'], $u['role'], $u['org']]);
                $uIds[$u['role']] = (int)$pdo->lastInsertId();
            }

            // Locations
            $locs = [
                ["Rani ki Vav (The Queen's Stepwell)", 'Patan', 'Gujarat', 'India', 23.8589000, 72.1018000, 'UNESCO World Heritage site on the banks of the Saraswati River.'],
                ['Adalaj Stepwell (Rudabai Stepwell)', 'Gandhinagar', 'Gujarat', 'India', 23.1667000, 72.5801000, 'Five-story octagonal stepwell built in 1498 by Queen Rudadevi.'],
                ['Sun Temple, Modhera', 'Mehsana', 'Gujarat', 'India', 23.5836000, 72.1332000, '11th century Solanki dynasty temple complex dedicated to the solar deity Surya.']
            ];
            $lStmt = $pdo->prepare("INSERT INTO locations (name, region, state, country, latitude, longitude, notes) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $lIds = [];
            foreach ($locs as $l) {
                $lStmt->execute($l);
                $lIds[] = (int)$pdo->lastInsertId();
            }

            // Tags
            $tags = [
                ['Stepwell', 'stepwell'],
                ['Water Architecture', 'water-architecture'],
                ['Solanki Dynasty', 'solanki-dynasty'],
                ['UNESCO World Heritage', 'unesco-world-heritage'],
                ['Stone Carving', 'stone-carving']
            ];
            $tStmt = $pdo->prepare("INSERT INTO tags (name, slug) VALUES (?, ?)");
            $tIds = [];
            foreach ($tags as $t) {
                $tStmt->execute($t);
                $tIds[$t[1]] = (int)$pdo->lastInsertId();
            }

            // Archive Items
            $items = [
                [
                    'title' => 'Subterranean Sculptural Pavilions of Rani ki Vav',
                    'item_type' => 'monument',
                    'summary' => 'Seven tiers of carved sandstone panels depicting the Dashavatara and sacred water symbolism in Patan.',
                    'description' => "Constructed during the Chaulukya dynasty, Rani ki Vav is an inverted temple dedicated to the sacred preservation of water. The central flight of stairs descends past five pavilions embellished with over five hundred major sculptures.",
                    'location_id' => $lIds[0] ?? 1,
                    'region' => 'Patan',
                    'latitude' => 23.8589000,
                    'longitude' => 72.1018000,
                    'capture_date' => '2025-12-14',
                    'historical_period' => 'Late 11th Century CE (Solanki Period)',
                    'language' => 'English',
                    'creator' => 'Heritage Survey Expedition 2025',
                    'source' => 'Archaeological Survey Field Notes, Vol. 14',
                    'rights_status' => 'cc_by_sa',
                    'attribution_text' => 'Photographed and documented by Heritage Survey Expedition 2025 under CC-BY-SA 4.0.',
                    'status' => 'published',
                    'visibility' => 'public',
                    'submitted_by' => $uIds['researcher'] ?? 3,
                    'media_key' => '9d798361915a9470730bb3b60af58068.svg',
                    'media_name' => 'rani_ki_vav_elevation.svg',
                    'media_alt' => 'Seven tiers of carved sandstone panels at Rani ki Vav',
                    'tag_slugs' => ['stepwell', 'water-architecture', 'solanki-dynasty', 'unesco-world-heritage', 'stone-carving']
                ],
                [
                    'title' => 'Pillared Octagonal Corridors of Adalaj Vav',
                    'item_type' => 'architecture',
                    'summary' => 'Five-storey subterranean structure with Solanki and Sultanate floral stone motifs in Gandhinagar district.',
                    'description' => "Adalaj Stepwell represents an exquisite convergence of Solanki architectural canons with Indo-Islamic decorative craftsmanship.",
                    'location_id' => $lIds[1] ?? 2,
                    'region' => 'Gandhinagar',
                    'latitude' => 23.1667000,
                    'longitude' => 72.5801000,
                    'capture_date' => '2026-02-03',
                    'historical_period' => '15th Century CE (1498 CE)',
                    'language' => 'English',
                    'creator' => 'Aarav Patel',
                    'source' => 'IIT Gandhinagar Cultural Documentation Initiative',
                    'rights_status' => 'cc_by',
                    'attribution_text' => 'Photo courtesy of Aarav Patel, IITGN Cultural Lab. Licensed under CC-BY 4.0.',
                    'status' => 'published',
                    'visibility' => 'public',
                    'submitted_by' => $uIds['researcher'] ?? 3,
                    'media_key' => '8c56e87b461ef0e488f2b731b5a67e2b.svg',
                    'media_name' => 'adalaj_stepwell_octagonal_shaft.svg',
                    'media_alt' => 'Pillared octagonal corridors of Adalaj Vav',
                    'tag_slugs' => ['stepwell', 'water-architecture', 'stone-carving']
                ],
                [
                    'title' => 'Surya Kund and Sabha Mandapa of the Modhera Sun Temple',
                    'item_type' => 'monument',
                    'summary' => 'Stepped geometric reservoir featuring 108 miniature shrines facing the 11th-century assembly hall.',
                    'description' => "Built in 1026-27 CE by King Bhima I of the Solanki dynasty, the Surya Temple complex at Modhera is oriented so that the solar rays illuminate the sanctum sanctorum during the equinoxes.",
                    'location_id' => $lIds[2] ?? 3,
                    'region' => 'Mehsana',
                    'latitude' => 23.5836000,
                    'longitude' => 72.1332000,
                    'capture_date' => '2026-01-20',
                    'historical_period' => 'Early 11th Century CE (c. 1026 CE)',
                    'language' => 'English',
                    'creator' => 'Prof. Rajesh Verma',
                    'source' => 'Western India Architectural Heritage Archive',
                    'rights_status' => 'public_domain',
                    'attribution_text' => 'Source material placed in Public Domain by Western India Architectural Archive.',
                    'status' => 'published',
                    'visibility' => 'public',
                    'submitted_by' => $uIds['researcher'] ?? 3,
                    'media_key' => '2fbfd09eca63cc94814105eccd0164ba.svg',
                    'media_name' => 'modhera_surya_kund_stepped_pond.svg',
                    'media_alt' => 'Stepped geometric reservoir of Surya Kund Modhera',
                    'tag_slugs' => ['water-architecture', 'solanki-dynasty', 'stone-carving']
                ]
            ];

            $aiStmt = $pdo->prepare("INSERT INTO archive_items (title, item_type, summary, description, location_id, region, latitude, longitude, capture_date, historical_period, language, creator, source, rights_status, attribution_text, status, visibility, submitted_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $mStmt = $pdo->prepare("INSERT INTO media_assets (archive_item_id, storage_key, original_filename, mime_type, file_size, sha256_checksum, alt_text, caption, is_primary) VALUES (?, ?, ?, 'image/svg+xml', 1024, 'dummychecksum', ?, ?, 1)");
            $aitStmt = $pdo->prepare("INSERT IGNORE INTO archive_item_tags (archive_item_id, tag_id) VALUES (?, ?)");

            foreach ($items as $it) {
                $aiStmt->execute([
                    $it['title'], $it['item_type'], $it['summary'], $it['description'],
                    $it['location_id'], $it['region'], $it['latitude'], $it['longitude'],
                    $it['capture_date'], $it['historical_period'], $it['language'], $it['creator'],
                    $it['source'], $it['rights_status'], $it['attribution_text'],
                    $it['status'], $it['visibility'], $it['submitted_by']
                ]);
                $aiId = (int)$pdo->lastInsertId();

                $mStmt->execute([$aiId, $it['media_key'], $it['media_name'], $it['media_alt'], $it['media_alt']]);

                foreach ($it['tag_slugs'] as $slug) {
                    if (isset($tIds[$slug])) {
                        $aitStmt->execute([$aiId, $tIds[$slug]]);
                    }
                }
            }

            // Collections
            $colStmt = $pdo->prepare("INSERT INTO collections (title, slug, summary, description, is_published, created_by) VALUES (?, ?, ?, ?, 1, ?)");
            $colStmt->execute([
                'Subterranean Water Architecture of Gujarat',
                'water-architecture-gujarat',
                'Comprehensive spatial and architectural cataloguing of stepped water corridors, cisterns, and vavs from the 11th to 16th centuries.',
                'This collection highlights Gujarat\'s unique stepwell structures combining hydraulic engineering with temple architecture.',
                $uIds['admin'] ?? 1
            ]);
            $colId = (int)$pdo->lastInsertId();

            $ciStmt = $pdo->prepare("INSERT INTO collection_items (collection_id, archive_item_id, sort_order) VALUES (?, 1, 1), (?, 2, 2)");
            $ciStmt->execute([$colId, $colId]);

        } catch (Throwable $e) {
            error_log("seedDefaultData exception: " . $e->getMessage());
        }
    }
}
