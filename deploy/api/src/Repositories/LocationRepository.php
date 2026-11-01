<?php
namespace Virasat\Repositories;

use Virasat\Config\Database;
use PDO;

class LocationRepository {
    public static function findAll(): array {
        $pdo = Database::getConnection();
        $stmt = $pdo->query("SELECT id, name, region, state, country, latitude, longitude, is_approximate, notes FROM locations ORDER BY name ASC");
        return $stmt->fetchAll();
    }

    public static function findById(int $id): ?array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT id, name, region, state, country, latitude, longitude, is_approximate, notes FROM locations WHERE id = ?");
        $stmt->execute([$id]);
        $loc = $stmt->fetch();
        return $loc ?: null;
    }

    public static function getPublicLocationsWithCounts(): array {
        $pdo = Database::getConnection();
        $sql = "SELECT l.id, l.name, l.region, l.state, l.country, l.latitude, l.longitude, l.is_approximate, 
                       COUNT(ai.id) as item_count
                FROM locations l
                INNER JOIN archive_items ai ON ai.location_id = l.id
                WHERE ai.status = 'published' AND ai.visibility = 'public' AND l.latitude IS NOT NULL AND l.longitude IS NOT NULL
                GROUP BY l.id, l.name, l.region, l.state, l.country, l.latitude, l.longitude, l.is_approximate
                ORDER BY item_count DESC";
        $stmt = $pdo->query($sql);
        return $stmt->fetchAll();
    }
}

