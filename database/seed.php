<?php
/**
 * Virasat Atlas - Database Seeder
 * Populates realistic, rights-cleared heritage records and roles.
 */

require_once __DIR__ . '/../api/src/Config/Env.php';
require_once __DIR__ . '/../api/src/Config/Database.php';

use Virasat\Config\Env;
use Virasat\Config\Database;

Env::load(__DIR__ . '/../api/.env');

$pdo = Database::getConnection();

echo "Seeding database...\n";

// Disable foreign key checks for clean re-seeding
$pdo->exec("SET FOREIGN_KEY_CHECKS = 0;");
$pdo->exec("TRUNCATE TABLE audit_logs;");
$pdo->exec("TRUNCATE TABLE ocr_jobs;");
$pdo->exec("TRUNCATE TABLE collection_items;");
$pdo->exec("TRUNCATE TABLE collections;");
$pdo->exec("TRUNCATE TABLE archive_item_tags;");
$pdo->exec("TRUNCATE TABLE tags;");
$pdo->exec("TRUNCATE TABLE media_assets;");
$pdo->exec("TRUNCATE TABLE archive_items;");
$pdo->exec("TRUNCATE TABLE locations;");
$pdo->exec("TRUNCATE TABLE users;");
$pdo->exec("SET FOREIGN_KEY_CHECKS = 1;");

// 1. Users
$users = [
    [
        'email' => 'admin@virasat.org',
        'password' => 'password123',
        'full_name' => 'Dr. Sunita Sen',
        'role' => 'admin',
        'organization' => 'National Heritage Archive Council'
    ],
    [
        'email' => 'reviewer@virasat.org',
        'password' => 'password123',
        'full_name' => 'Prof. Rajesh Verma',
        'role' => 'reviewer',
        'organization' => 'School of Architectural History'
    ],
    [
        'email' => 'researcher@virasat.org',
        'password' => 'password123',
        'full_name' => 'Aarav Patel',
        'role' => 'researcher',
        'organization' => 'IIT Gandhinagar Heritage Lab'
    ],
    [
        'email' => 'visitor@virasat.org',
        'password' => 'password123',
        'full_name' => 'Neha Sharma',
        'role' => 'visitor',
        'organization' => 'Independent Researcher'
    ]
];

$stmtUser = $pdo->prepare("INSERT INTO users (email, password_hash, full_name, role, organization) VALUES (?, ?, ?, ?, ?)");
$userIds = [];
foreach ($users as $u) {
    $stmtUser->execute([
        $u['email'],
        password_hash($u['password'], PASSWORD_BCRYPT),
        $u['full_name'],
        $u['role'],
        $u['organization']
    ]);
    $userIds[$u['role']] = $pdo->lastInsertId();
}
echo "Seeded 4 users.\n";

// 2. Locations
$locations = [
    [
        'name' => "Rani ki Vav (The Queen's Stepwell)",
        'region' => 'Patan',
        'state' => 'Gujarat',
        'country' => 'India',
        'latitude' => 23.8589000,
        'longitude' => 72.1018000,
        'is_approximate' => 0,
        'notes' => 'UNESCO World Heritage site on the banks of the Saraswati River.'
    ],
    [
        'name' => 'Adalaj Stepwell (Rudabai Stepwell)',
        'region' => 'Gandhinagar',
        'state' => 'Gujarat',
        'country' => 'India',
        'latitude' => 23.1667000,
        'longitude' => 72.5801000,
        'is_approximate' => 0,
        'notes' => 'Five-story octagonal stepwell built in 1498 by Queen Rudadevi.'
    ],
    [
        'name' => 'Sun Temple, Modhera',
        'region' => 'Mehsana',
        'state' => 'Gujarat',
        'country' => 'India',
        'latitude' => 23.5836000,
        'longitude' => 72.1332000,
        'is_approximate' => 0,
        'notes' => '11th century Solanki dynasty temple complex dedicated to the solar deity Surya.'
    ],
    [
        'name' => 'Sarkhej Roza Architectural Complex',
        'region' => 'Ahmedabad',
        'state' => 'Gujarat',
        'country' => 'India',
        'latitude' => 22.9806000,
        'longitude' => 72.5028000,
        'is_approximate' => 0,
        'notes' => 'Mosque and tomb complex exemplifying the Sultanate architectural style of Gujarat.'
    ],
    [
        'name' => 'Champaner-Pavagadh Archaeological Park',
        'region' => 'Panchmahal',
        'state' => 'Gujarat',
        'country' => 'India',
        'latitude' => 22.4851000,
        'longitude' => 73.5358000,
        'is_approximate' => 0,
        'notes' => 'Historic city transitioning from Hindu-Jain to Islamic architecture.'
    ]
];

$stmtLoc = $pdo->prepare("INSERT INTO locations (name, region, state, country, latitude, longitude, is_approximate, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
$locIds = [];
foreach ($locations as $idx => $loc) {
    $stmtLoc->execute([
        $loc['name'],
        $loc['region'],
        $loc['state'],
        $loc['country'],
        $loc['latitude'],
        $loc['longitude'],
        $loc['is_approximate'],
        $loc['notes']
    ]);
    $locIds[$idx] = $pdo->lastInsertId();
}
echo "Seeded " . count($locations) . " locations.\n";

// 3. Tags
$tags = [
    ['name' => 'Stepwell', 'slug' => 'stepwell'],
    ['name' => 'Water Architecture', 'slug' => 'water-architecture'],
    ['name' => 'Solanki Dynasty', 'slug' => 'solanki-dynasty'],
    ['name' => 'UNESCO World Heritage', 'slug' => 'unesco-world-heritage'],
    ['name' => 'Stone Carving', 'slug' => 'stone-carving'],
    ['name' => 'Epigraphy', 'slug' => 'epigraphy'],
    ['name' => 'Field Survey', 'slug' => 'field-survey'],
    ['name' => 'Textile Heritage', 'slug' => 'textile-heritage'],
    ['name' => 'Islamic Architecture', 'slug' => 'islamic-architecture']
];

$stmtTag = $pdo->prepare("INSERT INTO tags (name, slug) VALUES (?, ?)");
$tagIds = [];
foreach ($tags as $t) {
    $stmtTag->execute([$t['name'], $t['slug']]);
    $tagIds[$t['slug']] = $pdo->lastInsertId();
}
echo "Seeded " . count($tags) . " tags.\n";

// 4. Archive Items
$items = [
    [
        'title' => 'Subterranean Sculptural Pavilions of Rani ki Vav',
        'item_type' => 'monument',
        'summary' => 'Seven tiers of carved sandstone panels depicting the Dashavatara and sacred water symbolism in Patan.',
        'description' => 'Built during the reign of the Chaulukya (Solanki) king Bhima I by his widowed queen Udayamati in the late 11th century. The inverted temple design honours the sanctity of water across seven terraced levels, housing more than 500 principal sculptures and a thousand minor ones that combine religious, mythological, and secular imagery.',
        'location_id' => $locIds[0],
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
        'submitted_by' => $userIds['researcher'],
        'reviewed_by' => $userIds['reviewer'],
        'reviewed_at' => '2026-01-10 10:30:00',
        'tags' => ['stepwell', 'water-architecture', 'solanki-dynasty', 'unesco-world-heritage', 'stone-carving']
    ],
    [
        'title' => 'Pillared Octagonal Corridors of Adalaj Vav',
        'item_type' => 'architecture',
        'summary' => 'Five-storey subterranean structure with Solanki and Sultanate floral stone motifs in Gandhinagar district.',
        'description' => 'The stepwell was commissioned in 1498 by Queen Rudabai in memory of Rana Veer Singh. The architecture uniquely blends Solanki Hindu iconography with Indo-Islamic floral tracery, incorporating three entrance stairs leading into a subterranean octagonal pool that moderated microclimatic heat for travellers on regional trade routes.',
        'location_id' => $locIds[1],
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
        'submitted_by' => $userIds['researcher'],
        'reviewed_by' => $userIds['reviewer'],
        'reviewed_at' => '2026-02-05 14:15:00',
        'tags' => ['stepwell', 'water-architecture', 'stone-carving']
    ],
    [
        'title' => 'Surya Kund and Sabha Mandapa of the Modhera Sun Temple',
        'item_type' => 'monument',
        'summary' => 'Stepped geometric reservoir featuring 108 miniature shrines facing the 11th-century assembly hall.',
        'description' => 'Constructed after 1026-27 CE by King Bhimadeva I of the Solanki dynasty. The Surya Kund is an intricately stepped water tank featuring miniature shrines dedicated to Vishnu, Ganesha, and manifestations of Shiva. The alignment allows equinoctial sunrise rays to pass through the pillared assembly hall into the sanctum.',
        'location_id' => $locIds[2],
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
        'submitted_by' => $userIds['researcher'],
        'reviewed_by' => $userIds['reviewer'],
        'reviewed_at' => '2026-01-25 09:00:00',
        'tags' => ['solanki-dynasty', 'stone-carving', 'water-architecture']
    ],
    [
        'title' => 'Field Survey Notebook: Hydraulic Gradient Observations at Mehsana Stepwells',
        'item_type' => 'field_note',
        'summary' => 'Original notebook records measuring seasonal water table elevations and decorative frieze weathering.',
        'description' => 'Field observations recorded between November 2025 and January 2026 documenting six secondary stepwells in Mehsana and Patan districts. Includes notes on salinity ingress, micro-cracks in frieze layers, and local folklore surrounding dry subterranean wells.',
        'location_id' => $locIds[2],
        'region' => 'Mehsana',
        'latitude' => 23.5836000,
        'longitude' => 72.1332000,
        'capture_date' => '2026-03-01',
        'historical_period' => 'Contemporary Fieldwork (2025-2026)',
        'language' => 'English',
        'creator' => 'Aarav Patel',
        'source' => 'IITGN Field Survey Log #04',
        'rights_status' => 'permission_granted',
        'attribution_text' => 'Field notes recorded by Aarav Patel; publication approved for research use.',
        'status' => 'draft',
        'visibility' => 'private',
        'submitted_by' => $userIds['researcher'],
        'reviewed_by' => null,
        'reviewed_at' => null,
        'tags' => ['field-survey', 'water-architecture']
    ],
    [
        'title' => 'Sanskrit and Gujarati Inscription Plate from Patan Stepwell Shaft',
        'item_type' => 'document',
        'summary' => 'Epigraphic scan documenting dedication verses and mason guild marks in Devanagari script.',
        'description' => 'High-resolution surface impression and digital scan of a bilingual dedication tablet. Records references to donor lineages, the architect overseer (Sutradhara), and astrological dates commemorating the water blessing ceremony.',
        'location_id' => $locIds[0],
        'region' => 'Patan',
        'latitude' => 23.8589000,
        'longitude' => 72.1018000,
        'capture_date' => '2026-02-15',
        'historical_period' => '13th Century CE',
        'language' => 'Sanskrit',
        'creator' => 'Epigraphy Department, State Archaeology',
        'source' => 'Archive Registration #EPI-2026-09',
        'rights_status' => 'permission_pending',
        'attribution_text' => 'Scanned with permission of State Epigraphy Unit; rights review in progress.',
        'status' => 'pending_review',
        'visibility' => 'unlisted',
        'submitted_by' => $userIds['researcher'],
        'reviewed_by' => null,
        'reviewed_at' => null,
        'tags' => ['epigraphy', 'solanki-dynasty']
    ],
    [
        'title' => 'Double-Ikat Silk Weaving Archive: Master Weaver Silk Chart',
        'item_type' => 'craft',
        'summary' => 'Technical diagram illustrating warp and weft tie-dye mathematical calculations for traditional Patola motifs.',
        'description' => 'The Salvi community preserved the geometric double-ikat technique in Patan since the 12th century under the patronage of King Kumarapala. This archive record captures the graph-paper master charts (naqsha) used to align naturally dyed resist patterns before loom mounting.',
        'location_id' => $locIds[0],
        'region' => 'Patan',
        'latitude' => 23.8589000,
        'longitude' => 72.1018000,
        'capture_date' => '2025-11-28',
        'historical_period' => 'Heritage Living Craft Tradition',
        'language' => 'Gujarati',
        'creator' => 'Salvi Artisan Guild & Cultural Documentation Team',
        'source' => 'Patan Living Heritage Project',
        'rights_status' => 'cc_by',
        'attribution_text' => 'Documented with the consent of the Salvi Artisan Guild; licensed under CC-BY 4.0.',
        'status' => 'published',
        'visibility' => 'public',
        'submitted_by' => $userIds['researcher'],
        'reviewed_by' => $userIds['reviewer'],
        'reviewed_at' => '2025-12-05 11:00:00',
        'tags' => ['textile-heritage']
    ]
];

$stmtItem = $pdo->prepare("INSERT INTO archive_items 
(title, item_type, summary, description, location_id, region, latitude, longitude, capture_date, historical_period, language, creator, source, rights_status, attribution_text, status, visibility, submitted_by, reviewed_by, reviewed_at)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

$stmtItemTag = $pdo->prepare("INSERT INTO archive_item_tags (archive_item_id, tag_id) VALUES (?, ?)");

$itemIds = [];
foreach ($items as $idx => $it) {
    $stmtItem->execute([
        $it['title'],
        $it['item_type'],
        $it['summary'],
        $it['description'],
        $it['location_id'],
        $it['region'],
        $it['latitude'],
        $it['longitude'],
        $it['capture_date'],
        $it['historical_period'],
        $it['language'],
        $it['creator'],
        $it['source'],
        $it['rights_status'],
        $it['attribution_text'],
        $it['status'],
        $it['visibility'],
        $it['submitted_by'],
        $it['reviewed_by'],
        $it['reviewed_at']
    ]);
    $itemId = $pdo->lastInsertId();
    $itemIds[$idx] = $itemId;

    foreach ($it['tags'] as $tslug) {
        if (isset($tagIds[$tslug])) {
            $stmtItemTag->execute([$itemId, $tagIds[$tslug]]);
        }
    }
}
echo "Seeded " . count($items) . " archive items with tags.\n";

// 5. Media Assets (create dummy sample files in storage directory and DB)
$storageDir = __DIR__ . '/../api/storage/uploads';
if (!is_dir($storageDir)) {
    mkdir($storageDir, 0755, true);
}

// Generate simple SVG image placeholders for the seeded items so they render beautifully
$mediaData = [
    [
        'item_idx' => 0,
        'filename' => 'rani_ki_vav_tiers.svg',
        'alt' => 'Seven tiers of carved sandstone panels at Rani ki Vav',
        'caption' => 'The western pavilion tiers leading down to the well shaft.',
        'color' => '#8A5A32',
        'label' => 'Rani ki Vav Sculptural Tiers'
    ],
    [
        'item_idx' => 1,
        'filename' => 'adalaj_stepwell_octagonal.svg',
        'alt' => 'Pillared octagonal corridors of Adalaj Vav',
        'caption' => 'Shaft corridors showing Solanki stone friezes and light shafts.',
        'color' => '#315B73',
        'label' => 'Adalaj Stepwell Corridors'
    ],
    [
        'item_idx' => 2,
        'filename' => 'modhera_surya_kund.svg',
        'alt' => 'Stepped geometric reservoir of Surya Kund Modhera',
        'caption' => 'Miniature shrines framing the ceremonial stepped water body.',
        'color' => '#875B19',
        'label' => 'Modhera Surya Kund Steps'
    ],
    [
        'item_idx' => 4,
        'filename' => 'patan_inscription_plate.svg',
        'alt' => 'High resolution scan of epigraphic dedication tablet',
        'caption' => 'Bilingual Sanskrit-Gujarati stone inscription rubric.',
        'color' => '#282C2F',
        'label' => 'Epigraphic Inscription Rubric'
    ],
    [
        'item_idx' => 5,
        'filename' => 'patola_weaving_chart.svg',
        'alt' => 'Double ikat weaving geometric layout graph',
        'caption' => 'Artisan graph chart indicating red and gold silk thread alignments.',
        'color' => '#9A3D35',
        'label' => 'Double-Ikat Weaving Chart'
    ]
];

$stmtMedia = $pdo->prepare("INSERT INTO media_assets 
(archive_item_id, storage_key, original_filename, mime_type, file_size, sha256_checksum, alt_text, caption, is_primary)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");

foreach ($mediaData as $m) {
    $storageKey = bin2hex(random_bytes(16)) . '.svg';
    $filePath = $storageDir . '/' . $storageKey;
    
    $svg = <<<SVG
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <rect width="100%" height="100%" fill="{$m['color']}"/>
  <rect x="40" y="40" width="720" height="520" fill="none" stroke="#F7F4EE" stroke-width="4" stroke-opacity="0.6"/>
  <text x="400" y="280" font-family="serif" font-size="28" fill="#F7F4EE" text-anchor="middle" font-weight="bold">VIRASAT ATLAS</text>
  <text x="400" y="330" font-family="sans-serif" font-size="20" fill="#EEE8DD" text-anchor="middle">{$m['label']}</text>
  <text x="400" y="370" font-family="sans-serif" font-size="14" fill="#D9C4A2" text-anchor="middle">Digital Cultural &amp; Architectural Archive</text>
</svg>
SVG;
    file_put_contents($filePath, $svg);
    $sha256 = hash_file('sha256', $filePath);
    $size = filesize($filePath);
    
    $itemId = $itemIds[$m['item_idx']];
    $stmtMedia->execute([
        $itemId,
        $storageKey,
        $m['filename'],
        'image/svg+xml',
        $size,
        $sha256,
        $m['alt'],
        $m['caption'],
        1
    ]);
}
echo "Seeded " . count($mediaData) . " media assets with valid storage files.\n";

// 6. Collections
$collections = [
    [
        'title' => 'Stepwells of Western India: Sacred Subterranean Waters',
        'slug' => 'stepwells-western-india',
        'summary' => 'A curated journey through the masterworks of inverted water architecture in Gujarat.',
        'description' => 'From seven-tier subterranean sanctums to communal traveller resting pavilions, stepwells (vavs) represent an engineering response to seasonal arid climates transformed into enduring sacred architecture.',
        'curator_id' => $userIds['reviewer'],
        'items' => [
            ['idx' => 0, 'order' => 1, 'notes' => 'Queen\'s Stepwell representing the pinnacle of Chaulukya subterranean carving.'],
            ['idx' => 1, 'order' => 2, 'notes' => 'Rudabai Stepwell demonstrating syncretic Hindu-Islamic architectural confluence.']
        ]
    ],
    [
        'title' => 'Solanki Dynasty Imperial Architecture',
        'slug' => 'solanki-dynasty-architecture',
        'summary' => 'Exploration of 11th-century Chaulukya stone temples, stepwells, and monumental civic structures.',
        'description' => 'Documenting the Maru-Gurjara style characterised by meticulous stone carving, solar geometry, and ceremonial reservoirs.',
        'curator_id' => $userIds['reviewer'],
        'items' => [
            ['idx' => 2, 'order' => 1, 'notes' => 'The Modhera Sun Temple and its 108-shrine Surya Kund.'],
            ['idx' => 0, 'order' => 2, 'notes' => 'Rani ki Vav stepwell commissioning details.']
        ]
    ]
];

$stmtColl = $pdo->prepare("INSERT INTO collections (title, slug, summary, description, curator_id) VALUES (?, ?, ?, ?, ?)");
$stmtCollItem = $pdo->prepare("INSERT INTO collection_items (collection_id, archive_item_id, item_order, curator_notes) VALUES (?, ?, ?, ?)");

foreach ($collections as $c) {
    $stmtColl->execute([
        $c['title'],
        $c['slug'],
        $c['summary'],
        $c['description'],
        $c['curator_id']
    ]);
    $collId = $pdo->lastInsertId();
    foreach ($c['items'] as $ci) {
        $stmtCollItem->execute([
            $collId,
            $itemIds[$ci['idx']],
            $ci['order'],
            $ci['notes']
        ]);
    }
}
echo "Seeded " . count($collections) . " curated collections.\n";

// 7. Audit log initial record
$stmtAudit = $pdo->prepare("INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)");
$stmtAudit->execute([
    $userIds['admin'],
    'system_seed',
    'system',
    1,
    json_encode(['message' => 'Initial database seed completed for Virasat Atlas.'])
]);
echo "Database seeding completed successfully!\n";
