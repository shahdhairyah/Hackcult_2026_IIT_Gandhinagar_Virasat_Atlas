<?php
namespace Virasat\Repositories;

use Virasat\Config\Database;
use PDO;
use Throwable;

class LocationRepository {
    private static function getFallbackLocations(): array {
        return [
            [
                'id' => 1,
                'name' => "Rani ki Vav (The Queen's Stepwell)",
                'region' => 'Patan',
                'state' => 'Gujarat',
                'country' => 'India',
                'latitude' => '23.8589000',
                'longitude' => '72.1018000',
                'is_approximate' => 0,
                'notes' => 'UNESCO World Heritage site on the banks of the Saraswati River.',
                'item_count' => 2
            ],
            [
                'id' => 2,
                'name' => 'Adalaj Stepwell (Rudabai Stepwell)',
                'region' => 'Gandhinagar',
                'state' => 'Gujarat',
                'country' => 'India',
                'latitude' => '23.1667000',
                'longitude' => '72.5801000',
                'is_approximate' => 0,
                'notes' => 'Five-story octagonal stepwell built in 1498 by Queen Rudadevi.',
                'item_count' => 1
            ],
            [
                'id' => 3,
                'name' => 'Sun Temple, Modhera',
                'region' => 'Mehsana',
                'state' => 'Gujarat',
                'country' => 'India',
                'latitude' => '23.5836000',
                'longitude' => '72.1332000',
                'is_approximate' => 0,
                'notes' => '11th century Solanki dynasty temple complex dedicated to the solar deity Surya.',
                'item_count' => 1
            ],
            [
                'id' => 4,
                'name' => 'Lothal Archaeological Maritime Site',
                'region' => 'Ahmedabad',
                'state' => 'Gujarat',
                'country' => 'India',
                'latitude' => '22.5218000',
                'longitude' => '72.2494000',
                'is_approximate' => 0,
                'notes' => 'Ancient Indus Valley Civilization port city featuring tidal dockyard.',
                'item_count' => 1
            ]
        ];
    }

    public static function findAll(): array {
        $pdo = Database::getConnection();
        if ($pdo !== null) {
            try {
                $stmt = $pdo->query("SELECT id, name, region, state, country, latitude, longitude, is_approximate, notes FROM locations ORDER BY name ASC");
                return $stmt->fetchAll();
            } catch (Throwable $e) {
                error_log("LocationRepository::findAll exception: " . $e->getMessage());
            }
        }
        return self::getFallbackLocations();
    }

    public static function findById(int $id): ?array {
        $pdo = Database::getConnection();
        if ($pdo !== null) {
            try {
                $stmt = $pdo->prepare("SELECT id, name, region, state, country, latitude, longitude, is_approximate, notes FROM locations WHERE id = ?");
                $stmt->execute([$id]);
                $loc = $stmt->fetch();
                if ($loc) return $loc;
            } catch (Throwable $e) {
                error_log("LocationRepository::findById exception: " . $e->getMessage());
            }
        }
        foreach (self::getFallbackLocations() as $loc) {
            if ($loc['id'] === $id) return $loc;
        }
        return null;
    }

    public static function getPublicLocationsWithCounts(): array {
        $pdo = Database::getConnection();
        if ($pdo !== null) {
            try {
                $sql = "SELECT l.id, l.name, l.region, l.state, l.country, l.latitude, l.longitude, l.is_approximate, 
                               COUNT(ai.id) as item_count
                        FROM locations l
                        INNER JOIN archive_items ai ON ai.location_id = l.id
                        WHERE ai.status = 'published' AND ai.visibility = 'public' AND l.latitude IS NOT NULL AND l.longitude IS NOT NULL
                        GROUP BY l.id, l.name, l.region, l.state, l.country, l.latitude, l.longitude, l.is_approximate
                        ORDER BY item_count DESC";
                $stmt = $pdo->query($sql);
                return $stmt->fetchAll();
            } catch (Throwable $e) {
                error_log("LocationRepository::getPublicLocationsWithCounts exception: " . $e->getMessage());
            }
        }
        return self::getFallbackLocations();
    }
}
