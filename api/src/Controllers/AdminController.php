<?php
namespace Virasat\Controllers;

use Virasat\Config\Database;
use Virasat\Config\Env;
use Virasat\Responses\JsonResponse;
use Virasat\Middleware\RoleMiddleware;
use Virasat\Repositories\AuditRepository;
use PDO;

class AdminController {
    public static function metrics(): void {
        RoleMiddleware::requireRole('reviewer');
        $pdo = Database::getConnection();

        // Item status counts
        $itemStats = $pdo->query("SELECT status, COUNT(*) as count FROM archive_items GROUP BY status")->fetchAll();
        $stats = ['total' => 0, 'published' => 0, 'pending_review' => 0, 'draft' => 0, 'rejected' => 0];
        foreach ($itemStats as $st) {
            $stats[$st['status']] = (int)$st['count'];
            $stats['total'] += (int)$st['count'];
        }

        // Platform counters
        $usersCount = (int)$pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
        $locsCount = (int)$pdo->query("SELECT COUNT(*) FROM locations")->fetchColumn();
        $colsCount = (int)$pdo->query("SELECT COUNT(*) FROM collections")->fetchColumn();
        $mediaStats = $pdo->query("SELECT COUNT(*) as count, COALESCE(SUM(file_size), 0) as total_size FROM media_assets")->fetch();

        JsonResponse::success([
            'records' => $stats,
            'users_count' => $usersCount,
            'locations_count' => $locsCount,
            'collections_count' => $colsCount,
            'media_assets_count' => (int)$mediaStats['count'],
            'total_storage_bytes' => (int)$mediaStats['total_size'],
            'total_storage_mb' => round((int)$mediaStats['total_size'] / (1024 * 1024), 2)
        ]);
    }

    public static function users(): void {
        RoleMiddleware::requireRole('admin');
        $pdo = Database::getConnection();
        $stmt = $pdo->query("SELECT id, email, full_name, role, organization, created_at FROM users ORDER BY created_at DESC");
        JsonResponse::success($stmt->fetchAll());
    }

    public static function updateUserRole(int $userId): void {
        $admin = RoleMiddleware::requireRole('admin');
        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        $newRole = $input['role'] ?? '';

        if (!in_array($newRole, ['visitor', 'researcher', 'reviewer', 'admin'], true)) {
            JsonResponse::error('Invalid role specified.', 'VALIDATION_ERROR', 422);
        }

        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("UPDATE users SET role = ? WHERE id = ?");
        $stmt->execute([$newRole, $userId]);

        AuditRepository::log($admin['id'], 'user_role_updated', 'user', $userId, ['new_role' => $newRole]);

        JsonResponse::success(['message' => "User role updated to {$newRole}."]);
    }

    public static function auditLogs(): void {
        RoleMiddleware::requireRole('reviewer');
        $pdo = Database::getConnection();

        $page = max(1, (int)($_GET['page'] ?? 1));
        $perPage = min(50, max(1, (int)($_GET['per_page'] ?? 20)));
        $offset = ($page - 1) * $perPage;

        $count = (int)$pdo->query("SELECT COUNT(*) FROM audit_logs")->fetchColumn();

        $sql = "SELECT al.*, u.full_name as actor_name, u.email as actor_email, u.role as actor_role
                FROM audit_logs al
                LEFT JOIN users u ON u.id = al.user_id
                ORDER BY al.created_at DESC
                LIMIT {$perPage} OFFSET {$offset}";
        $stmt = $pdo->query($sql);
        $logs = $stmt->fetchAll();

        // Format details json
        foreach ($logs as &$log) {
            if ($log['details']) {
                $log['details'] = json_decode($log['details'], true);
            }
        }

        JsonResponse::success($logs, [
            'page' => $page,
            'per_page' => $perPage,
            'total' => $count,
            'total_pages' => (int)ceil($count / $perPage)
        ]);
    }

    public static function exportArchive(): void {
        $pdo = Database::getConnection();
        $sql = "SELECT ai.id, ai.title, ai.item_type, ai.summary, ai.description, 
                       ai.region, ai.latitude, ai.longitude, ai.capture_date, ai.historical_period,
                       ai.language, ai.creator, ai.source, ai.rights_status, ai.attribution_text,
                       ai.status, ai.created_at, ai.reviewed_at,
                       l.name as location_name,
                       u.full_name as contributor_name,
                       r.full_name as reviewer_name
                FROM archive_items ai
                LEFT JOIN locations l ON l.id = ai.location_id
                LEFT JOIN users u ON u.id = ai.submitted_by
                LEFT JOIN users r ON r.id = ai.reviewed_by
                WHERE ai.status = 'published' AND ai.visibility = 'public'
                ORDER BY ai.id ASC";
        $stmt = $pdo->query($sql);
        $records = $stmt->fetchAll();

        // Attach media & tags
        foreach ($records as &$rec) {
            $mStmt = $pdo->prepare("SELECT id, original_filename, mime_type, file_size, sha256_checksum, is_primary FROM media_assets WHERE archive_item_id = ?");
            $mStmt->execute([$rec['id']]);
            $rec['media_manifest'] = $mStmt->fetchAll();

            $tStmt = $pdo->prepare("SELECT t.name FROM archive_item_tags ait JOIN tags t ON t.id = ait.tag_id WHERE ait.archive_item_id = ?");
            $tStmt->execute([$rec['id']]);
            $rec['tags'] = $tStmt->fetchAll(PDO::FETCH_COLUMN);
        }

        $format = $_GET['format'] ?? 'json';

        if ($format === 'csv') {
            header('Content-Type: text/csv; charset=utf-8');
            header('Content-Disposition: attachment; filename="virasat_atlas_manifest_' . date('Ymd_His') . '.csv"');
            $out = fopen('php://output', 'w');
            fputcsv($out, ['ID', 'Title', 'Type', 'Region', 'Location', 'Latitude', 'Longitude', 'Period', 'Source', 'Rights', 'Attribution', 'Contributor', 'Reviewer', 'Created_At']);
            foreach ($records as $r) {
                fputcsv($out, [
                    $r['id'],
                    $r['title'],
                    $r['item_type'],
                    $r['region'],
                    $r['location_name'] ?? '',
                    $r['latitude'] ?? '',
                    $r['longitude'] ?? '',
                    $r['historical_period'] ?? '',
                    $r['source'],
                    $r['rights_status'],
                    $r['attribution_text'] ?? '',
                    $r['contributor_name'] ?? '',
                    $r['reviewer_name'] ?? '',
                    $r['created_at']
                ]);
            }
            fclose($out);
            exit;
        }

        header('Content-Type: application/json; charset=utf-8');
        header('Content-Disposition: attachment; filename="virasat_atlas_archive_package_' . date('Ymd_His') . '.json"');
        echo json_encode([
            'archive_standard' => 'OAIS ISO 14721 Manifest',
            'exported_at' => gmdate('c'),
            'record_count' => count($records),
            'records' => $records
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        exit;
    }
}
