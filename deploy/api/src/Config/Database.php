<?php
namespace Virasat\Config;

use PDO;
use Exception;
use Throwable;

class Database {
    private static ?PDO $connection = null;
    private static bool $schemaChecked = false;

    public static function getConnection(): PDO {
        if (self::$connection !== null) {
            return self::$connection;
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
            PDO::ATTR_TIMEOUT            => 10,
        ];

        // Try standard connection without port first (most compatible on InfinityFree/cPanel)
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
            error_log("Database connection failed: {$lastError}");
            throw new Exception("Database connection to '{$host}' ({$db}) failed: {$lastError}. Please check MySQL credentials in cPanel.");
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

    public static function ensureSchema(PDO $pdo): void {
        try {
            $stmt = $pdo->query("SELECT 1 FROM `archive_items` LIMIT 1");
        } catch (Throwable $e) {
            // Table doesn't exist yet: auto-initialize tables and seed data
            self::autoInitSchema($pdo);
        }
    }

    public static function autoInitSchema(PDO $pdo): void {
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
          CONSTRAINT `fk_ai_location` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`) ON DELETE SET NULL,
          CONSTRAINT `fk_ai_submitter` FOREIGN KEY (`submitted_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
          CONSTRAINT `fk_ai_reviewer` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
          INDEX `idx_ai_status_vis` (`status`, `visibility`),
          INDEX `idx_ai_type` (`item_type`),
          INDEX `idx_ai_region` (`region`),
          FULLTEXT KEY `ft_ai_search` (`title`, `summary`, `description`)
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
          CONSTRAINT `fk_media_item` FOREIGN KEY (`archive_item_id`) REFERENCES `archive_items` (`id`) ON DELETE CASCADE,
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
          PRIMARY KEY (`archive_item_id`, `tag_id`),
          CONSTRAINT `fk_ait_item` FOREIGN KEY (`archive_item_id`) REFERENCES `archive_items` (`id`) ON DELETE CASCADE,
          CONSTRAINT `fk_ait_tag` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE
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
          `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT `fk_col_creator` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

        // 8. Collection Items
        $pdo->exec("CREATE TABLE IF NOT EXISTS `collection_items` (
          `collection_id` INT NOT NULL,
          `archive_item_id` INT NOT NULL,
          `sort_order` INT NOT NULL DEFAULT 0,
          `curator_note` TEXT NULL,
          PRIMARY KEY (`collection_id`, `archive_item_id`),
          CONSTRAINT `fk_ci_collection` FOREIGN KEY (`collection_id`) REFERENCES `collections` (`id`) ON DELETE CASCADE,
          CONSTRAINT `fk_ci_item` FOREIGN KEY (`archive_item_id`) REFERENCES `archive_items` (`id`) ON DELETE CASCADE
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
          `reviewed_by` INT NULL,
          CONSTRAINT `fk_ocr_item` FOREIGN KEY (`archive_item_id`) REFERENCES `archive_items` (`id`) ON DELETE CASCADE
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

        // 11. Saved Items / Research Bookmarks
        $pdo->exec("CREATE TABLE IF NOT EXISTS `saved_items` (
          `id` INT AUTO_INCREMENT PRIMARY KEY,
          `user_id` INT NOT NULL,
          `archive_item_id` INT NOT NULL,
          `notes` TEXT NULL,
          `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE KEY `uk_user_item` (`user_id`, `archive_item_id`),
          CONSTRAINT `fk_saved_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
          CONSTRAINT `fk_saved_item` FOREIGN KEY (`archive_item_id`) REFERENCES `archive_items` (`id`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

        $pdo->exec("SET FOREIGN_KEY_CHECKS = 1;");

        // Check if users exist; if not, seed realistic data
        $uCheck = $pdo->query("SELECT COUNT(*) FROM `users`")->fetchColumn();
        if ((int)$uCheck === 0) {
            self::seedDefaultData($pdo);
        }
    }

    private static function seedDefaultData(PDO $pdo): void {
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
                'description' => 'Built during the reign of the Chaulukya (Solanki) king Bhima I by his widowed queen Udayamati in the late 11th century. The inverted temple design honours the sanctity of water across seven terraced levels, housing more than 500 principal sculptures and a thousand minor ones that combine religious, mythological, and secular imagery.',
                'location_id' => $lIds[0],
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
                'submitted_by' => $uIds['researcher'],
                'reviewed_by' => $uIds['reviewer'],
                'reviewed_at' => '2026-01-10 10:30:00'
            ],
            [
                'title' => 'Pillared Octagonal Corridors of Adalaj Vav',
                'item_type' => 'architecture',
                'summary' => 'Five-storey subterranean structure with Solanki and Sultanate floral stone motifs in Gandhinagar district.',
                'description' => 'The stepwell was commissioned in 1498 by Queen Rudabai in memory of Rana Veer Singh. The architecture uniquely blends Solanki Hindu iconography with Indo-Islamic floral tracery, incorporating three entrance stairs leading into a subterranean octagonal pool that moderated microclimatic heat for travellers on regional trade routes.',
                'location_id' => $lIds[1],
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
                'submitted_by' => $uIds['researcher'],
                'reviewed_by' => $uIds['reviewer'],
                'reviewed_at' => '2026-02-10 14:00:00'
            ],
            [
                'title' => 'Surya Kund and Sabha Mandapa of the Modhera Sun Temple',
                'item_type' => 'monument',
                'summary' => 'Geometric stepped water tank with 108 miniature shrines and ornate assembly hall oriented to the equinox sun.',
                'description' => 'Commissioned by King Bhima I of the Solanki dynasty in 1026 CE. The rectangular stepped tank (Surya Kund) features geometric stair flights leading to deep groundwater, surrounded by miniature shrines for Ganesha, Shiva, and Vishnu.',
                'location_id' => $lIds[2],
                'region' => 'Mehsana',
                'latitude' => 23.5836000,
                'longitude' => 72.1332000,
                'capture_date' => '2025-11-20',
                'historical_period' => 'Early 11th Century CE (c. 1026 CE)',
                'language' => 'English',
                'creator' => 'Western India Architectural Heritage Survey',
                'source' => 'Western India Architectural Heritage Archive',
                'rights_status' => 'public_domain',
                'attribution_text' => 'Source material placed in Public Domain by Western India Architectural Archive.',
                'status' => 'published',
                'submitted_by' => $uIds['researcher'],
                'reviewed_by' => $uIds['reviewer'],
                'reviewed_at' => '2026-01-15 09:00:00'
            ]
        ];

        $iStmt = $pdo->prepare("INSERT INTO archive_items (title, item_type, summary, description, location_id, region, latitude, longitude, capture_date, historical_period, language, creator, source, rights_status, attribution_text, status, visibility, submitted_by, reviewed_by, reviewed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'public', ?, ?, ?)");
        $itemIds = [];
        foreach ($items as $it) {
            $iStmt->execute([
                $it['title'], $it['item_type'], $it['summary'], $it['description'], $it['location_id'],
                $it['region'], $it['latitude'], $it['longitude'], $it['capture_date'], $it['historical_period'],
                $it['language'], $it['creator'], $it['source'], $it['rights_status'], $it['attribution_text'],
                $it['status'], $it['submitted_by'], $it['reviewed_by'], $it['reviewed_at']
            ]);
            $itemIds[] = (int)$pdo->lastInsertId();
        }

        // Tag associations
        $tagMapStmt = $pdo->prepare("INSERT IGNORE INTO archive_item_tags (archive_item_id, tag_id) VALUES (?, ?)");
        if (!empty($itemIds)) {
            $tagMapStmt->execute([$itemIds[0], $tIds['stepwell']]);
            $tagMapStmt->execute([$itemIds[0], $tIds['water-architecture']]);
            $tagMapStmt->execute([$itemIds[0], $tIds['solanki-dynasty']]);
            $tagMapStmt->execute([$itemIds[1], $tIds['stepwell']]);
            $tagMapStmt->execute([$itemIds[1], $tIds['water-architecture']]);
            $tagMapStmt->execute([$itemIds[2], $tIds['solanki-dynasty']]);
        }

        // Seed initial collection
        $colStmt = $pdo->prepare("INSERT INTO collections (title, slug, summary, description, is_published, created_by) VALUES (?, ?, ?, ?, 1, ?)");
        $colStmt->execute([
            'Subterranean Water Architecture of North Gujarat',
            'subterranean-water-architecture-north-gujarat',
            'A curated exploration of stepwell engineering, sacred hydrological geometry, and community water heritage across Patan, Mehsana, and Gandhinagar.',
            'Stepwells (vavs) were not merely utilitarian wells; they served as cool retreats, pilgrimage rest stops, and social community spaces adorned with religious iconography.',
            $uIds['reviewer']
        ]);
        $colId = (int)$pdo->lastInsertId();

        $cItemStmt = $pdo->prepare("INSERT INTO collection_items (collection_id, archive_item_id, sort_order, curator_note) VALUES (?, ?, ?, ?)");
        if (!empty($itemIds)) {
            $cItemStmt->execute([$colId, $itemIds[0], 1, 'The premier subterranean temple-well with multi-tiered pillared pavilions.']);
            $cItemStmt->execute([$colId, $itemIds[1], 2, 'Showcases the harmonious fusion of Solanki Hindu motifs and Islamic floral tracery.']);
        }
    }
}
