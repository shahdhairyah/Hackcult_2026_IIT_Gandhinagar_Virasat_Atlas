-- Virasat Atlas - Database Schema
-- Baseline: MySQL 8+ / MariaDB (InnoDB, utf8mb4)

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `audit_logs`;
DROP TABLE IF EXISTS `ocr_jobs`;
DROP TABLE IF EXISTS `collection_items`;
DROP TABLE IF EXISTS `collections`;
DROP TABLE IF EXISTS `archive_item_tags`;
DROP TABLE IF EXISTS `tags`;
DROP TABLE IF EXISTS `media_assets`;
DROP TABLE IF EXISTS `archive_items`;
DROP TABLE IF EXISTS `locations`;
DROP TABLE IF EXISTS `users`;

SET FOREIGN_KEY_CHECKS = 1;

-- 1. Users
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(255) NOT NULL,
  `role` ENUM('visitor', 'researcher', 'reviewer', 'admin') NOT NULL DEFAULT 'researcher',
  `organization` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Locations
CREATE TABLE `locations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `region` VARCHAR(255) NOT NULL,
  `state` VARCHAR(255) NULL,
  `country` VARCHAR(100) NOT NULL DEFAULT 'India',
  `latitude` DECIMAL(10, 7) NULL,
  `longitude` DECIMAL(10, 7) NULL,
  `is_approximate` TINYINT(1) NOT NULL DEFAULT 0,
  `notes` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_locations_region` (`region`),
  INDEX `idx_locations_coords` (`latitude`, `longitude`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Archive Items
CREATE TABLE `archive_items` (
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
  `language` VARCHAR(100) NOT NULL DEFAULT 'English',
  `creator` VARCHAR(255) NULL,
  `source` VARCHAR(255) NOT NULL,
  `rights_status` ENUM('public_domain', 'cc_by', 'cc_by_sa', 'cc_by_nc', 'permission_granted', 'permission_pending', 'restricted', 'unknown') NOT NULL DEFAULT 'unknown',
  `attribution_text` TEXT NULL,
  `status` ENUM('draft', 'pending_review', 'published', 'rejected', 'archived') NOT NULL DEFAULT 'draft',
  `visibility` ENUM('public', 'unlisted', 'private') NOT NULL DEFAULT 'public',
  `rejection_reason` TEXT NULL,
  `submitted_by` INT NOT NULL,
  `reviewed_by` INT NULL,
  `reviewed_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_archive_items_location` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_archive_items_author` FOREIGN KEY (`submitted_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_archive_items_reviewer` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  INDEX `idx_items_status_vis` (`status`, `visibility`),
  INDEX `idx_items_type` (`item_type`),
  INDEX `idx_items_region` (`region`),
  INDEX `idx_items_submitted_by` (`submitted_by`),
  FULLTEXT KEY `ft_items_search` (`title`, `summary`, `description`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Media Assets
CREATE TABLE `media_assets` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `archive_item_id` INT NOT NULL,
  `storage_key` VARCHAR(255) NOT NULL,
  `original_filename` VARCHAR(255) NOT NULL,
  `mime_type` VARCHAR(100) NOT NULL,
  `file_size` BIGINT NOT NULL,
  `sha256_checksum` VARCHAR(64) NOT NULL,
  `alt_text` TEXT NULL,
  `caption` TEXT NULL,
  `is_primary` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_media_archive_item` FOREIGN KEY (`archive_item_id`) REFERENCES `archive_items` (`id`) ON DELETE CASCADE,
  INDEX `idx_media_item_primary` (`archive_item_id`, `is_primary`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Tags
CREATE TABLE `tags` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `slug` VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Archive Item Tags mapping
CREATE TABLE `archive_item_tags` (
  `archive_item_id` INT NOT NULL,
  `tag_id` INT NOT NULL,
  PRIMARY KEY (`archive_item_id`, `tag_id`),
  CONSTRAINT `fk_ait_item` FOREIGN KEY (`archive_item_id`) REFERENCES `archive_items` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ait_tag` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Collections
CREATE TABLE `collections` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `summary` TEXT NOT NULL,
  `description` LONGTEXT NULL,
  `curator_id` INT NOT NULL,
  `cover_image_url` VARCHAR(500) NULL,
  `is_published` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_collections_curator` FOREIGN KEY (`curator_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Collection Items mapping
CREATE TABLE `collection_items` (
  `collection_id` INT NOT NULL,
  `archive_item_id` INT NOT NULL,
  `item_order` INT NOT NULL DEFAULT 0,
  `curator_notes` TEXT NULL,
  PRIMARY KEY (`collection_id`, `archive_item_id`),
  CONSTRAINT `fk_ci_collection` FOREIGN KEY (`collection_id`) REFERENCES `collections` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ci_item` FOREIGN KEY (`archive_item_id`) REFERENCES `archive_items` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. OCR Jobs
CREATE TABLE `ocr_jobs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `archive_item_id` INT NOT NULL,
  `media_asset_id` INT NULL,
  `language` VARCHAR(50) NOT NULL DEFAULT 'eng',
  `engine` VARCHAR(50) NOT NULL DEFAULT 'tesseract',
  `raw_text` LONGTEXT NULL,
  `reviewed_text` LONGTEXT NULL,
  `confidence` FLOAT NULL,
  `status` ENUM('pending', 'completed', 'reviewed', 'failed') NOT NULL DEFAULT 'completed',
  `reviewed_by` INT NULL,
  `reviewed_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_ocr_archive_item` FOREIGN KEY (`archive_item_id`) REFERENCES `archive_items` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ocr_media_asset` FOREIGN KEY (`media_asset_id`) REFERENCES `media_assets` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_ocr_reviewer` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Audit Logs
CREATE TABLE `audit_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NULL,
  `action` VARCHAR(100) NOT NULL,
  `entity_type` VARCHAR(100) NOT NULL,
  `entity_id` INT NOT NULL,
  `details` JSON NULL,
  `ip_address` VARCHAR(45) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_audit_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  INDEX `idx_audit_entity` (`entity_type`, `entity_id`),
  INDEX `idx_audit_action` (`action`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Saved Items / Research Bookmarks
CREATE TABLE `saved_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `archive_item_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_user_item` (`user_id`, `archive_item_id`),
  CONSTRAINT `fk_saved_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_saved_item` FOREIGN KEY (`archive_item_id`) REFERENCES `archive_items` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

