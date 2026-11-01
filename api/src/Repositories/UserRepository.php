<?php
namespace Virasat\Repositories;

use Virasat\Config\Database;
use PDO;

class UserRepository {
    public static function findByEmail(string $email): ?array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT id, email, password_hash, full_name, role, organization, created_at FROM users WHERE email = ? LIMIT 1");
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        return $user ?: null;
    }

    public static function findById(int $id): ?array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT id, email, full_name, role, organization, created_at FROM users WHERE id = ? LIMIT 1");
        $stmt->execute([$id]);
        $user = $stmt->fetch();
        return $user ?: null;
    }

    public static function create(array $data): int {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("INSERT INTO users (email, password_hash, full_name, role, organization) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['email'],
            password_hash($data['password'], PASSWORD_BCRYPT),
            $data['full_name'],
            $data['role'] ?? 'researcher',
            $data['organization'] ?? null
        ]);
        return (int)$pdo->lastInsertId();
    }
}

