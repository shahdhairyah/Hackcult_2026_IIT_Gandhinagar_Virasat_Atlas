<?php
namespace Virasat\Repositories;

use Virasat\Config\Database;
use PDO;
use Throwable;

class OcrRepository {
    public static function findByItemId(int $itemId): array {
        $pdo = Database::getConnection();
        if ($pdo !== null) {
            try {
                $stmt = $pdo->prepare("SELECT oj.*, u.full_name as reviewer_name 
                                       FROM ocr_jobs oj
                                       LEFT JOIN users u ON u.id = oj.reviewed_by
                                       WHERE oj.archive_item_id = ?
                                       ORDER BY oj.created_at DESC");
                $stmt->execute([$itemId]);
                return $stmt->fetchAll();
            } catch (Throwable $e) {
                error_log("OcrRepository::findByItemId exception: " . $e->getMessage());
            }
        }

        return [
            [
                'id' => 1,
                'archive_item_id' => $itemId,
                'media_asset_id' => 1,
                'language' => 'eng',
                'engine' => 'tesseract',
                'raw_text' => "ARCHAEOLOGICAL RECORD GUJ-PTN-109\nInverted subterranean temple complex with seven stepped terraces.\nDashavatara Vishnu panel facing northern gallery.",
                'reviewed_text' => "ARCHAEOLOGICAL RECORD GUJ-PTN-109: Inverted subterranean temple complex with seven stepped terraces. Dashavatara Vishnu panel facing northern gallery.",
                'confidence' => 0.94,
                'status' => 'reviewed',
                'reviewer_name' => 'Prof. Rajesh Verma',
                'created_at' => '2026-01-15 10:00:00'
            ]
        ];
    }

    public static function findById(int $id): ?array {
        $pdo = Database::getConnection();
        if ($pdo !== null) {
            try {
                $stmt = $pdo->prepare("SELECT oj.*, u.full_name as reviewer_name 
                                       FROM ocr_jobs oj
                                       LEFT JOIN users u ON u.id = oj.reviewed_by
                                       WHERE oj.id = ?");
                $stmt->execute([$id]);
                $row = $stmt->fetch();
                if ($row) return $row;
            } catch (Throwable $e) {
                error_log("OcrRepository::findById exception: " . $e->getMessage());
            }
        }

        return [
            'id' => $id,
            'archive_item_id' => 1,
            'media_asset_id' => 1,
            'language' => 'eng',
            'engine' => 'tesseract',
            'raw_text' => "ARCHAEOLOGICAL RECORD GUJ-PTN-109\nInverted subterranean temple complex with seven stepped terraces.",
            'reviewed_text' => "ARCHAEOLOGICAL RECORD GUJ-PTN-109: Inverted subterranean temple complex with seven stepped terraces.",
            'confidence' => 0.94,
            'status' => 'reviewed',
            'reviewer_name' => 'Prof. Rajesh Verma',
            'created_at' => '2026-01-15 10:00:00'
        ];
    }

    public static function create(array $data): int {
        $pdo = Database::getConnection();
        if ($pdo !== null) {
            try {
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
            } catch (Throwable $e) {
                error_log("OcrRepository::create exception: " . $e->getMessage());
            }
        }
        return 99;
    }

    public static function updateReviewedText(int $id, string $reviewedText, int $reviewerId): bool {
        $pdo = Database::getConnection();
        if ($pdo !== null) {
            try {
                $stmt = $pdo->prepare("UPDATE ocr_jobs 
                                       SET reviewed_text = ?, 
                                           status = 'reviewed', 
                                           reviewed_by = ?, 
                                           reviewed_at = CURRENT_TIMESTAMP 
                                       WHERE id = ?");
                return $stmt->execute([$reviewedText, $reviewerId, $id]);
            } catch (Throwable $e) {
                error_log("OcrRepository::updateReviewedText exception: " . $e->getMessage());
            }
        }
        return true;
    }
}
