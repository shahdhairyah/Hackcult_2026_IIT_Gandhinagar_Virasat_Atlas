<?php
namespace Virasat\Repositories;

use Virasat\Config\Database;
use PDO;

class OcrRepository {
    public static function findByItemId(int $itemId): array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT oj.*, u.full_name as reviewer_name 
                               FROM ocr_jobs oj
                               LEFT JOIN users u ON u.id = oj.reviewed_by
                               WHERE oj.archive_item_id = ?
                               ORDER BY oj.created_at DESC");
        $stmt->execute([$itemId]);
        return $stmt->fetchAll();
    }

    public static function findById(int $id): ?array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT oj.*, u.full_name as reviewer_name 
                               FROM ocr_jobs oj
                               LEFT JOIN users u ON u.id = oj.reviewed_by
                               WHERE oj.id = ?");
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public static function create(array $data): int {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("INSERT INTO ocr_jobs 
            (archive_item_id, media_asset_id, language, engine, raw_text, reviewed_text, confidence, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['archive_item_id'],
            $data['media_asset_id'] ?? null,
            $data['language'] ?? 'eng',
            $data['engine'] ?? 'tesseract',
            $data['raw_text'] ?? null,
            $data['reviewed_text'] ?? null,
            $data['confidence'] ?? 0.85,
            $data['status'] ?? 'completed'
        ]);
        return (int)$pdo->lastInsertId();
    }

    public static function updateReviewedText(int $id, string $reviewedText, int $reviewerId): bool {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("UPDATE ocr_jobs 
                               SET reviewed_text = ?, 
                                   status = 'reviewed', 
                                   reviewed_by = ?, 
                                   reviewed_at = CURRENT_TIMESTAMP 
                               WHERE id = ?");
        return $stmt->execute([$reviewedText, $reviewerId, $id]);
    }
}

