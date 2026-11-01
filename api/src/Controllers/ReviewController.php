<?php
namespace Virasat\Controllers;

use Virasat\Repositories\ArchiveItemRepository;
use Virasat\Repositories\AuditRepository;
use Virasat\Responses\JsonResponse;
use Virasat\Middleware\RoleMiddleware;

class ReviewController {
    public static function queue(): void {
        RoleMiddleware::requireRole('reviewer');
        $items = ArchiveItemRepository::findPendingReview();
        JsonResponse::success($items);
    }

    public static function review(int $id): void {
        $reviewer = RoleMiddleware::requireRole('reviewer');

        $item = ArchiveItemRepository::findById($id);
        if (!$item) {
            JsonResponse::notFound('Archive record not found.');
        }

        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        $action = $input['action'] ?? '';
        $reason = trim($input['reason'] ?? '');

        if (!in_array($action, ['approve', 'reject', 'return'], true)) {
            JsonResponse::error('Action must be one of: approve, reject, return.', 'INVALID_ACTION', 422);
        }

        if (in_array($action, ['reject', 'return'], true) && empty($reason)) {
            JsonResponse::error('A reason must be provided when rejecting or returning a submission.', 'REASON_REQUIRED', 422);
        }

        // If approving, verify required rights status
        if ($action === 'approve') {
            if (empty($item['rights_status']) || $item['rights_status'] === 'unknown') {
                JsonResponse::error('Cannot publish record without a verified rights and permission status.', 'RIGHTS_UNVERIFIED', 422);
            }
            $newStatus = 'published';
        } else {
            $newStatus = 'rejected';
        }

        ArchiveItemRepository::updateStatus($id, $newStatus, (int)$reviewer['id'], $reason ?: null);

        AuditRepository::log($reviewer['id'], "item_{$action}d", 'archive_item', $id, [
            'action' => $action,
            'reason' => $reason
        ]);

        $updated = ArchiveItemRepository::findById($id);
        JsonResponse::success($updated);
    }
}
