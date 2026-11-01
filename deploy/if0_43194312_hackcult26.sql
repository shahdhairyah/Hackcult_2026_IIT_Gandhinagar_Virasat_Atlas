mysqldump: Deprecated program name. It will be removed in a future release, use '/home/shahdhairyah/.local/mariadb/usr/bin/mariadb-dump' instead
WARNING: option --ssl-verify-server-cert is disabled, because of an insecure passwordless login.
/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.20-13.0.2-MariaDB, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: virasat_atlas
-- ------------------------------------------------------
-- Server version	13.0.2-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `archive_item_tags`
--

DROP TABLE IF EXISTS `archive_item_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `archive_item_tags` (
  `archive_item_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL,
  PRIMARY KEY (`archive_item_id`,`tag_id`),
  KEY `fk_ait_tag` (`tag_id`),
  CONSTRAINT `fk_ait_item` FOREIGN KEY (`archive_item_id`) REFERENCES `archive_items` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ait_tag` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `archive_item_tags`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `archive_item_tags` WRITE;
/*!40000 ALTER TABLE `archive_item_tags` DISABLE KEYS */;
INSERT INTO `archive_item_tags` VALUES
(1,1),
(2,1),
(1,2),
(2,2),
(3,2),
(4,2),
(7,2),
(8,2),
(9,2),
(1,3),
(3,3),
(5,3),
(1,4),
(1,5),
(2,5),
(3,5),
(5,6),
(4,7),
(7,7),
(8,7),
(9,7),
(6,8);
/*!40000 ALTER TABLE `archive_item_tags` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `archive_items`
--

DROP TABLE IF EXISTS `archive_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `archive_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `item_type` enum('monument','architecture','craft','document','photograph','field_note','oral_history','other') NOT NULL,
  `summary` text NOT NULL,
  `description` longtext DEFAULT NULL,
  `location_id` int(11) DEFAULT NULL,
  `region` varchar(255) NOT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `capture_date` date DEFAULT NULL,
  `historical_period` varchar(255) DEFAULT NULL,
  `language` varchar(100) NOT NULL DEFAULT 'English',
  `creator` varchar(255) DEFAULT NULL,
  `source` varchar(255) NOT NULL,
  `rights_status` enum('public_domain','cc_by','cc_by_sa','cc_by_nc','permission_granted','permission_pending','restricted','unknown') NOT NULL DEFAULT 'unknown',
  `attribution_text` text DEFAULT NULL,
  `status` enum('draft','pending_review','published','rejected','archived') NOT NULL DEFAULT 'draft',
  `visibility` enum('public','unlisted','private') NOT NULL DEFAULT 'public',
  `rejection_reason` text DEFAULT NULL,
  `submitted_by` int(11) NOT NULL,
  `reviewed_by` int(11) DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_archive_items_location` (`location_id`),
  KEY `fk_archive_items_reviewer` (`reviewed_by`),
  KEY `idx_items_status_vis` (`status`,`visibility`),
  KEY `idx_items_type` (`item_type`),
  KEY `idx_items_region` (`region`),
  KEY `idx_items_submitted_by` (`submitted_by`),
  FULLTEXT KEY `ft_items_search` (`title`,`summary`,`description`),
  CONSTRAINT `fk_archive_items_author` FOREIGN KEY (`submitted_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_archive_items_location` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_archive_items_reviewer` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `archive_items`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `archive_items` WRITE;
/*!40000 ALTER TABLE `archive_items` DISABLE KEYS */;
INSERT INTO `archive_items` VALUES
(1,'Subterranean Sculptural Pavilions of Rani ki Vav','monument','Seven tiers of carved sandstone panels depicting the Dashavatara and sacred water symbolism in Patan.','Built during the reign of the Chaulukya (Solanki) king Bhima I by his widowed queen Udayamati in the late 11th century. The inverted temple design honours the sanctity of water across seven terraced levels, housing more than 500 principal sculptures and a thousand minor ones that combine religious, mythological, and secular imagery.',1,'Patan',23.8589000,72.1018000,'2025-12-14','Late 11th Century CE (Solanki Period)','English','Heritage Survey Expedition 2025','Archaeological Survey Field Notes, Vol. 14','cc_by_sa','Photographed and documented by Heritage Survey Expedition 2025 under CC-BY-SA 4.0.','published','public',NULL,3,2,'2026-01-10 05:00:00','2026-11-01 10:56:58','2026-11-01 10:56:58'),
(2,'Pillared Octagonal Corridors of Adalaj Vav','architecture','Five-storey subterranean structure with Solanki and Sultanate floral stone motifs in Gandhinagar district.','The stepwell was commissioned in 1498 by Queen Rudabai in memory of Rana Veer Singh. The architecture uniquely blends Solanki Hindu iconography with Indo-Islamic floral tracery, incorporating three entrance stairs leading into a subterranean octagonal pool that moderated microclimatic heat for travellers on regional trade routes.',2,'Gandhinagar',23.1667000,72.5801000,'2026-02-03','15th Century CE (1498 CE)','English','Aarav Patel','IIT Gandhinagar Cultural Documentation Initiative','cc_by','Photo courtesy of Aarav Patel, IITGN Cultural Lab. Licensed under CC-BY 4.0.','published','public',NULL,3,2,'2026-02-05 08:45:00','2026-11-01 10:56:58','2026-11-01 10:56:58'),
(3,'Surya Kund and Sabha Mandapa of the Modhera Sun Temple','monument','Stepped geometric reservoir featuring 108 miniature shrines facing the 11th-century assembly hall.','Constructed after 1026-27 CE by King Bhimadeva I of the Solanki dynasty. The Surya Kund is an intricately stepped water tank featuring miniature shrines dedicated to Vishnu, Ganesha, and manifestations of Shiva. The alignment allows equinoctial sunrise rays to pass through the pillared assembly hall into the sanctum.',3,'Mehsana',23.5836000,72.1332000,'2026-01-20','Early 11th Century CE (c. 1026 CE)','English','Prof. Rajesh Verma','Western India Architectural Heritage Archive','public_domain','Source material placed in Public Domain by Western India Architectural Archive.','published','public',NULL,3,2,'2026-01-25 03:30:00','2026-11-01 10:56:58','2026-11-01 10:56:58'),
(4,'Field Survey Notebook: Hydraulic Gradient Observations at Mehsana Stepwells','field_note','Original notebook records measuring seasonal water table elevations and decorative frieze weathering.','Field observations recorded between November 2025 and January 2026 documenting six secondary stepwells in Mehsana and Patan districts. Includes notes on salinity ingress, micro-cracks in frieze layers, and local folklore surrounding dry subterranean wells.',3,'Mehsana',23.5836000,72.1332000,'2026-03-01','Contemporary Fieldwork (2025-2026)','English','Aarav Patel','IITGN Field Survey Log #04','permission_granted','Field notes recorded by Aarav Patel; publication approved for research use.','draft','private',NULL,3,NULL,NULL,'2026-11-01 10:56:58','2026-11-01 10:56:58'),
(5,'Sanskrit and Gujarati Inscription Plate from Patan Stepwell Shaft','document','Epigraphic scan documenting dedication verses and mason guild marks in Devanagari script.','High-resolution surface impression and digital scan of a bilingual dedication tablet. Records references to donor lineages, the architect overseer (Sutradhara), and astrological dates commemorating the water blessing ceremony.',1,'Patan',23.8589000,72.1018000,'2026-02-15','13th Century CE','Sanskrit','Epigraphy Department, State Archaeology','Archive Registration #EPI-2026-09','permission_pending','Scanned with permission of State Epigraphy Unit; rights review in progress.','pending_review','unlisted',NULL,3,NULL,NULL,'2026-11-01 10:56:58','2026-11-01 10:56:58'),
(6,'Double-Ikat Silk Weaving Archive: Master Weaver Silk Chart','craft','Technical diagram illustrating warp and weft tie-dye mathematical calculations for traditional Patola motifs.','The Salvi community preserved the geometric double-ikat technique in Patan since the 12th century under the patronage of King Kumarapala. This archive record captures the graph-paper master charts (naqsha) used to align naturally dyed resist patterns before loom mounting.',1,'Patan',23.8589000,72.1018000,'2025-11-28','Heritage Living Craft Tradition','Gujarati','Salvi Artisan Guild & Cultural Documentation Team','Patan Living Heritage Project','cc_by','Documented with the consent of the Salvi Artisan Guild; licensed under CC-BY 4.0.','published','public',NULL,3,2,'2025-12-05 05:30:00','2026-11-01 10:56:58','2026-11-01 10:56:58'),
(7,'Harappan Brick Canal and Sluice Gate Survey #5121','field_note','Technical field observations of kiln-fired mudbrick sluices at Lothal.','Subterranean canal network measuring hydraulic pressure gradients.',NULL,'Ahmedabad',22.5218000,72.2494000,NULL,NULL,'English',NULL,'IITGN Coastal Survey Log #12','cc_by','Field photo documented by Aarav Patel, CC-BY 4.0','published','public',NULL,3,2,'2026-11-01 10:59:11','2026-11-01 10:59:11','2026-11-01 10:59:11'),
(8,'Harappan Brick Canal and Sluice Gate Survey #8865','field_note','Technical field observations of kiln-fired mudbrick sluices at Lothal.','Subterranean canal network measuring hydraulic pressure gradients.',NULL,'Ahmedabad',22.5218000,72.2494000,NULL,NULL,'English',NULL,'IITGN Coastal Survey Log #12','cc_by','Field photo documented by Aarav Patel, CC-BY 4.0','published','public',NULL,3,2,'2026-11-01 11:38:57','2026-11-01 11:38:57','2026-11-01 11:38:57'),
(9,'Harappan Brick Canal and Sluice Gate Survey #3131','field_note','Technical field observations of kiln-fired mudbrick sluices at Lothal.','Subterranean canal network measuring hydraulic pressure gradients.',NULL,'Ahmedabad',22.5218000,72.2494000,NULL,NULL,'English',NULL,'IITGN Coastal Survey Log #12','cc_by','Field photo documented by Aarav Patel, CC-BY 4.0','published','public',NULL,3,2,'2026-11-01 11:39:24','2026-11-01 11:39:24','2026-11-01 11:39:24');
/*!40000 ALTER TABLE `archive_items` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `entity_type` varchar(100) NOT NULL,
  `entity_id` int(11) NOT NULL,
  `details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`details`)),
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_audit_user` (`user_id`),
  KEY `idx_audit_entity` (`entity_type`,`entity_id`),
  KEY `idx_audit_action` (`action`),
  CONSTRAINT `fk_audit_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
INSERT INTO `audit_logs` VALUES
(1,1,'system_seed','system',1,'{\"message\":\"Initial database seed completed for Virasat Atlas.\"}',NULL,'2026-11-01 10:56:58'),
(2,3,'user_login','user',3,NULL,'127.0.0.1','2026-11-01 10:59:11'),
(3,3,'item_created_draft','archive_item',7,'{\"title\":\"Harappan Brick Canal and Sluice Gate Survey #5121\"}','127.0.0.1','2026-11-01 10:59:11'),
(4,3,'media_uploaded','media_asset',6,'{\"item_id\":7,\"filename\":\"sluice.svg\"}','127.0.0.1','2026-11-01 10:59:11'),
(5,3,'item_updated','archive_item',7,'{\"title\":\"Harappan Brick Canal and Sluice Gate Survey #5121\"}','127.0.0.1','2026-11-01 10:59:11'),
(6,2,'user_login','user',2,NULL,'127.0.0.1','2026-11-01 10:59:11'),
(7,2,'item_approved','archive_item',7,'{\"action\":\"approve\",\"reason\":\"\"}','127.0.0.1','2026-11-01 10:59:11'),
(8,3,'ocr_job_created','ocr_job',1,'{\"item_id\":7,\"language\":\"eng\"}','127.0.0.1','2026-11-01 10:59:11'),
(9,3,'ocr_transcript_reviewed','ocr_job',1,'{\"item_id\":7}','127.0.0.1','2026-11-01 10:59:11'),
(10,1,'user_login','user',1,NULL,'127.0.0.1','2026-11-01 10:59:12'),
(11,3,'user_login','user',3,NULL,NULL,'2026-11-01 11:29:13'),
(12,3,'user_login','user',3,NULL,NULL,'2026-11-01 11:37:04'),
(13,3,'user_login','user',3,NULL,'127.0.0.1','2026-11-01 11:38:57'),
(14,3,'item_created_draft','archive_item',8,'{\"title\":\"Harappan Brick Canal and Sluice Gate Survey #8865\"}','127.0.0.1','2026-11-01 11:38:57'),
(15,3,'media_uploaded','media_asset',7,'{\"item_id\":8,\"filename\":\"sluice.svg\"}','127.0.0.1','2026-11-01 11:38:57'),
(16,3,'item_updated','archive_item',8,'{\"title\":\"Harappan Brick Canal and Sluice Gate Survey #8865\"}','127.0.0.1','2026-11-01 11:38:57'),
(17,2,'user_login','user',2,NULL,'127.0.0.1','2026-11-01 11:38:57'),
(18,2,'item_approved','archive_item',8,'{\"action\":\"approve\",\"reason\":\"\"}','127.0.0.1','2026-11-01 11:38:57'),
(19,3,'ocr_job_created','ocr_job',2,'{\"item_id\":8,\"language\":\"eng\"}','127.0.0.1','2026-11-01 11:38:57'),
(20,3,'ocr_transcript_reviewed','ocr_job',2,'{\"item_id\":8}','127.0.0.1','2026-11-01 11:38:57'),
(21,3,'user_login','user',3,NULL,'127.0.0.1','2026-11-01 11:39:24'),
(22,3,'item_created_draft','archive_item',9,'{\"title\":\"Harappan Brick Canal and Sluice Gate Survey #3131\"}','127.0.0.1','2026-11-01 11:39:24'),
(23,3,'media_uploaded','media_asset',8,'{\"item_id\":9,\"filename\":\"sluice.svg\"}','127.0.0.1','2026-11-01 11:39:24'),
(24,3,'item_updated','archive_item',9,'{\"title\":\"Harappan Brick Canal and Sluice Gate Survey #3131\"}','127.0.0.1','2026-11-01 11:39:24'),
(25,2,'user_login','user',2,NULL,'127.0.0.1','2026-11-01 11:39:24'),
(26,2,'item_approved','archive_item',9,'{\"action\":\"approve\",\"reason\":\"\"}','127.0.0.1','2026-11-01 11:39:24'),
(27,3,'ocr_job_created','ocr_job',3,'{\"item_id\":9,\"language\":\"eng\"}','127.0.0.1','2026-11-01 11:39:24'),
(28,3,'ocr_transcript_reviewed','ocr_job',3,'{\"item_id\":9}','127.0.0.1','2026-11-01 11:39:24'),
(29,1,'user_login','user',1,NULL,'127.0.0.1','2026-11-01 11:39:24'),
(30,3,'user_login','user',3,NULL,NULL,'2026-11-01 11:39:52');
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `collection_items`
--

DROP TABLE IF EXISTS `collection_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `collection_items` (
  `collection_id` int(11) NOT NULL,
  `archive_item_id` int(11) NOT NULL,
  `item_order` int(11) NOT NULL DEFAULT 0,
  `curator_notes` text DEFAULT NULL,
  PRIMARY KEY (`collection_id`,`archive_item_id`),
  KEY `fk_ci_item` (`archive_item_id`),
  CONSTRAINT `fk_ci_collection` FOREIGN KEY (`collection_id`) REFERENCES `collections` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ci_item` FOREIGN KEY (`archive_item_id`) REFERENCES `archive_items` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `collection_items`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `collection_items` WRITE;
/*!40000 ALTER TABLE `collection_items` DISABLE KEYS */;
INSERT INTO `collection_items` VALUES
(1,1,1,'Queen\'s Stepwell representing the pinnacle of Chaulukya subterranean carving.'),
(1,2,2,'Rudabai Stepwell demonstrating syncretic Hindu-Islamic architectural confluence.'),
(2,1,2,'Rani ki Vav stepwell commissioning details.'),
(2,3,1,'The Modhera Sun Temple and its 108-shrine Surya Kund.');
/*!40000 ALTER TABLE `collection_items` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `collections`
--

DROP TABLE IF EXISTS `collections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `collections` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `summary` text NOT NULL,
  `description` longtext DEFAULT NULL,
  `curator_id` int(11) NOT NULL,
  `cover_image_url` varchar(500) DEFAULT NULL,
  `is_published` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `fk_collections_curator` (`curator_id`),
  CONSTRAINT `fk_collections_curator` FOREIGN KEY (`curator_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `collections`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `collections` WRITE;
/*!40000 ALTER TABLE `collections` DISABLE KEYS */;
INSERT INTO `collections` VALUES
(1,'Stepwells of Western India: Sacred Subterranean Waters','stepwells-western-india','A curated journey through the masterworks of inverted water architecture in Gujarat.','From seven-tier subterranean sanctums to communal traveller resting pavilions, stepwells (vavs) represent an engineering response to seasonal arid climates transformed into enduring sacred architecture.',2,NULL,1,'2026-11-01 10:56:58','2026-11-01 10:56:58'),
(2,'Solanki Dynasty Imperial Architecture','solanki-dynasty-architecture','Exploration of 11th-century Chaulukya stone temples, stepwells, and monumental civic structures.','Documenting the Maru-Gurjara style characterised by meticulous stone carving, solar geometry, and ceremonial reservoirs.',2,NULL,1,'2026-11-01 10:56:58','2026-11-01 10:56:58');
/*!40000 ALTER TABLE `collections` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `locations`
--

DROP TABLE IF EXISTS `locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `locations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `region` varchar(255) NOT NULL,
  `state` varchar(255) DEFAULT NULL,
  `country` varchar(100) NOT NULL DEFAULT 'India',
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `is_approximate` tinyint(1) NOT NULL DEFAULT 0,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_locations_region` (`region`),
  KEY `idx_locations_coords` (`latitude`,`longitude`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locations`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `locations` WRITE;
/*!40000 ALTER TABLE `locations` DISABLE KEYS */;
INSERT INTO `locations` VALUES
(1,'Rani ki Vav (The Queen\'s Stepwell)','Patan','Gujarat','India',23.8589000,72.1018000,0,'UNESCO World Heritage site on the banks of the Saraswati River.','2026-11-01 10:56:58'),
(2,'Adalaj Stepwell (Rudabai Stepwell)','Gandhinagar','Gujarat','India',23.1667000,72.5801000,0,'Five-story octagonal stepwell built in 1498 by Queen Rudadevi.','2026-11-01 10:56:58'),
(3,'Sun Temple, Modhera','Mehsana','Gujarat','India',23.5836000,72.1332000,0,'11th century Solanki dynasty temple complex dedicated to the solar deity Surya.','2026-11-01 10:56:58'),
(4,'Sarkhej Roza Architectural Complex','Ahmedabad','Gujarat','India',22.9806000,72.5028000,0,'Mosque and tomb complex exemplifying the Sultanate architectural style of Gujarat.','2026-11-01 10:56:58'),
(5,'Champaner-Pavagadh Archaeological Park','Panchmahal','Gujarat','India',22.4851000,73.5358000,0,'Historic city transitioning from Hindu-Jain to Islamic architecture.','2026-11-01 10:56:58');
/*!40000 ALTER TABLE `locations` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `media_assets`
--

DROP TABLE IF EXISTS `media_assets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `media_assets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `archive_item_id` int(11) NOT NULL,
  `storage_key` varchar(255) NOT NULL,
  `original_filename` varchar(255) NOT NULL,
  `mime_type` varchar(100) NOT NULL,
  `file_size` bigint(20) NOT NULL,
  `sha256_checksum` varchar(64) NOT NULL,
  `alt_text` text DEFAULT NULL,
  `caption` text DEFAULT NULL,
  `is_primary` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_media_item_primary` (`archive_item_id`,`is_primary`),
  CONSTRAINT `fk_media_archive_item` FOREIGN KEY (`archive_item_id`) REFERENCES `archive_items` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `media_assets`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `media_assets` WRITE;
/*!40000 ALTER TABLE `media_assets` DISABLE KEYS */;
INSERT INTO `media_assets` VALUES
(1,1,'9d798361915a9470730bb3b60af58068.svg','rani_ki_vav_tiers.svg','image/svg+xml',685,'afa82c050d057ebc4a7587afccf61cd1bf8587c340d8aa52166e1d5e836d327f','Seven tiers of carved sandstone panels at Rani ki Vav','The western pavilion tiers leading down to the well shaft.',1,'2026-11-01 10:56:58'),
(2,2,'8c56e87b461ef0e488f2b731b5a67e2b.svg','adalaj_stepwell_octagonal.svg','image/svg+xml',682,'844a13e42334e1922041bf9d4b64be876538d74d065c45dc574b7dfa4e69c61c','Pillared octagonal corridors of Adalaj Vav','Shaft corridors showing Solanki stone friezes and light shafts.',1,'2026-11-01 10:56:58'),
(3,3,'2fbfd09eca63cc94814105eccd0164ba.svg','modhera_surya_kund.svg','image/svg+xml',681,'9c0cb70f7430df14b51f2ff1aeee4222e0f33f5331c0db03ad28b105a8ccc3b6','Stepped geometric reservoir of Surya Kund Modhera','Miniature shrines framing the ceremonial stepped water body.',1,'2026-11-01 10:56:58'),
(4,5,'55ae629ad5823c4d63d83c134c516dc2.svg','patan_inscription_plate.svg','image/svg+xml',686,'b10aed74b826a79edff9bc7c3da3435f8e0fe02296b4a87f2b3f5bf58d3cecb3','High resolution scan of epigraphic dedication tablet','Bilingual Sanskrit-Gujarati stone inscription rubric.',1,'2026-11-01 10:56:58'),
(5,6,'b78f62c27774f7d7fe89629530267848.svg','patola_weaving_chart.svg','image/svg+xml',682,'49c2acd9b36582cd3ba7a07245da1b32bb5eb8ed2f751a8bfa0b372c737784ef','Double ikat weaving geometric layout graph','Artisan graph chart indicating red and gold silk thread alignments.',1,'2026-11-01 10:56:58'),
(6,7,'041fa544c88b327557bbe6d4a112eb8e.svg','sluice.svg','image/svg+xml',202,'f4cfc6193c3e1e47e48106c9e9d35a33e3f6c95f3094b46368350346bda388ea','Kiln fired Harappan mudbrick water sluice canal','Canal drainage conduit',1,'2026-11-01 10:59:11'),
(7,8,'d2dad1c65f4344c316953732b29c6fb7.svg','sluice.svg','image/svg+xml',202,'f4cfc6193c3e1e47e48106c9e9d35a33e3f6c95f3094b46368350346bda388ea','Kiln fired Harappan mudbrick water sluice canal','Canal drainage conduit',1,'2026-11-01 11:38:57'),
(8,9,'a4af1bc3a65bb30a82481e2e436474c4.svg','sluice.svg','image/svg+xml',202,'f4cfc6193c3e1e47e48106c9e9d35a33e3f6c95f3094b46368350346bda388ea','Kiln fired Harappan mudbrick water sluice canal','Canal drainage conduit',1,'2026-11-01 11:39:24');
/*!40000 ALTER TABLE `media_assets` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `ocr_jobs`
--

DROP TABLE IF EXISTS `ocr_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `ocr_jobs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `archive_item_id` int(11) NOT NULL,
  `media_asset_id` int(11) DEFAULT NULL,
  `language` varchar(50) NOT NULL DEFAULT 'eng',
  `engine` varchar(50) NOT NULL DEFAULT 'tesseract',
  `raw_text` longtext DEFAULT NULL,
  `reviewed_text` longtext DEFAULT NULL,
  `confidence` float DEFAULT NULL,
  `status` enum('pending','completed','reviewed','failed') NOT NULL DEFAULT 'completed',
  `reviewed_by` int(11) DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_ocr_archive_item` (`archive_item_id`),
  KEY `fk_ocr_media_asset` (`media_asset_id`),
  KEY `fk_ocr_reviewer` (`reviewed_by`),
  CONSTRAINT `fk_ocr_archive_item` FOREIGN KEY (`archive_item_id`) REFERENCES `archive_items` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ocr_media_asset` FOREIGN KEY (`media_asset_id`) REFERENCES `media_assets` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_ocr_reviewer` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ocr_jobs`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `ocr_jobs` WRITE;
/*!40000 ALTER TABLE `ocr_jobs` DISABLE KEYS */;
INSERT INTO `ocr_jobs` VALUES
(1,7,NULL,'eng','tesseract','Survey Note: Mehsana Station #04\nDate: 14 Dec 2025. Ambient temp 28C.\nWater level at tier 4 observed at -12.4m datum.\nMason marks: 3 distinct guild sigils noted on octagonal pillar frieze.\n[Illegible word: s-l-t-y] deposit observed along base plinth.','Epigraphically verified transcript: Lothal tidal sluice gate alignment and Harappan mudbrick water conduit.',0.87,'reviewed',3,'2026-11-01 10:59:11','2026-11-01 10:59:11'),
(2,8,NULL,'eng','tesseract','Survey Note: Mehsana Station #04\nDate: 14 Dec 2025. Ambient temp 28C.\nWater level at tier 4 observed at -12.4m datum.\nMason marks: 3 distinct guild sigils noted on octagonal pillar frieze.\n[Illegible word: s-l-t-y] deposit observed along base plinth.','Epigraphically verified transcript: Lothal tidal sluice gate alignment and Harappan mudbrick water conduit.',0.87,'reviewed',3,'2026-11-01 11:38:57','2026-11-01 11:38:57'),
(3,9,NULL,'eng','tesseract','Survey Note: Mehsana Station #04\nDate: 14 Dec 2025. Ambient temp 28C.\nWater level at tier 4 observed at -12.4m datum.\nMason marks: 3 distinct guild sigils noted on octagonal pillar frieze.\n[Illegible word: s-l-t-y] deposit observed along base plinth.','Epigraphically verified transcript: Lothal tidal sluice gate alignment and Harappan mudbrick water conduit.',0.87,'reviewed',3,'2026-11-01 11:39:24','2026-11-01 11:39:24');
/*!40000 ALTER TABLE `ocr_jobs` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `saved_items`
--

DROP TABLE IF EXISTS `saved_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `saved_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `archive_item_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_item` (`user_id`,`archive_item_id`),
  KEY `fk_saved_item` (`archive_item_id`),
  CONSTRAINT `fk_saved_item` FOREIGN KEY (`archive_item_id`) REFERENCES `archive_items` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_saved_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `saved_items`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `saved_items` WRITE;
/*!40000 ALTER TABLE `saved_items` DISABLE KEYS */;
INSERT INTO `saved_items` VALUES
(11,3,1,'2026-11-01 11:39:24');
/*!40000 ALTER TABLE `saved_items` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `tags` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tags`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `tags` WRITE;
/*!40000 ALTER TABLE `tags` DISABLE KEYS */;
INSERT INTO `tags` VALUES
(1,'Stepwell','stepwell'),
(2,'Water Architecture','water-architecture'),
(3,'Solanki Dynasty','solanki-dynasty'),
(4,'UNESCO World Heritage','unesco-world-heritage'),
(5,'Stone Carving','stone-carving'),
(6,'Epigraphy','epigraphy'),
(7,'Field Survey','field-survey'),
(8,'Textile Heritage','textile-heritage'),
(9,'Islamic Architecture','islamic-architecture');
/*!40000 ALTER TABLE `tags` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `role` enum('visitor','researcher','reviewer','admin') NOT NULL DEFAULT 'researcher',
  `organization` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_users_role` (`role`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES
(1,'admin@virasat.org','$2y$10$fqzqclJZXTWo8gBr6da51O76ch3TgUxntqVuZcgNpOyIiTwJScYFC','Dr. Sunita Sen','admin','National Heritage Archive Council','2026-11-01 10:56:57','2026-11-01 10:56:57'),
(2,'reviewer@virasat.org','$2y$10$P60jkHUmUnL0lehCAdZVKOWfAiODtUCWWKgdyd.J7bD89yupeBWv2','Prof. Rajesh Verma','reviewer','School of Architectural History','2026-11-01 10:56:57','2026-11-01 10:56:57'),
(3,'researcher@virasat.org','$2y$10$uLC59ldNI5o5tnBSOGSch.9vZ/hXtOL35PnzdTnWeCJi1tMD6JP1e','Aarav Patel','researcher','IIT Gandhinagar Heritage Lab','2026-11-01 10:56:57','2026-11-01 10:56:57'),
(4,'visitor@virasat.org','$2y$10$3BnfiJVOsxfF0sMOYea6MOf1WqLse1TLiR48o81e/QM1oCyjRos.O','Neha Sharma','visitor','Independent Researcher','2026-11-01 10:56:58','2026-11-01 10:56:58');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2026-11-01 18:10:45
