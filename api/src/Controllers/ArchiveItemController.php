<?php
namespace Virasat\Controllers;

use Virasat\Repositories\ArchiveItemRepository;
use Virasat\Repositories\AuditRepository;
use Virasat\Repositories\LocationRepository;
use Virasat\Validators\ArchiveItemValidator;
use Virasat\Responses\JsonResponse;
use Virasat\Middleware\AuthMiddleware;
use Virasat\Middleware\RoleMiddleware;
use Virasat\Config\Database;

class ArchiveItemController {
    public static function index(): void {
        $params = $_GET;
        $result = ArchiveItemRepository::findPublishedWithFilters($params);

        JsonResponse::success($result['items'], [
            'page' => $result['page'],
            'per_page' => $result['per_page'],
            'total' => $result['total'],
            'total_pages' => $result['total_pages']
        ]);
    }

    public static function show(int $id): void {
        $item = ArchiveItemRepository::findById($id);
        if (!$item) {
            JsonResponse::notFound('Archive record not found.');
        }

        // Access control:
        // Only published + public items are visible anonymously.
        // Drafts, pending_review, or rejected items are visible only to the author or reviewer/admin.
        if ($item['status'] !== 'published' || $item['visibility'] !== 'public') {
            $user = AuthMiddleware::user();
            if (!$user) {
                JsonResponse::notFound('Archive record not found.');
            }

            $isOwner = ((int)$user['id'] === (int)$item['submitted_by']);
            $isReviewer = RoleMiddleware::hasRole($user, 'reviewer');

            if (!$isOwner && !$isReviewer) {
                JsonResponse::forbidden('You do not have permission to view this record.');
            }
        }

        JsonResponse::success($item);
    }

    public static function store(): void {
        $user = RoleMiddleware::requireRole('researcher');

        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        $isDraft = ($input['status'] ?? 'draft') === 'draft';

        $errors = ArchiveItemValidator::validate($input, $isDraft);
        if (!empty($errors)) {
            JsonResponse::validationError('Validation failed. Please correct the highlighted fields.', $errors);
        }

        $input['submitted_by'] = $user['id'];
        $input['status'] = in_array($input['status'] ?? '', ['draft', 'pending_review'], true) 
            ? $input['status'] 
            : 'draft';

        $itemId = ArchiveItemRepository::create($input);

        // Sync tags if provided
        if (!empty($input['tags']) && is_array($input['tags'])) {
            ArchiveItemRepository::syncTags($itemId, $input['tags']);
        }

        AuditRepository::log(
            $user['id'], 
            $input['status'] === 'pending_review' ? 'item_submitted' : 'item_created_draft', 
            'archive_item', 
            $itemId,
            ['title' => $input['title']]
        );

        $created = ArchiveItemRepository::findById($itemId);
        JsonResponse::success($created, null, 201);
    }

    public static function update(int $id): void {
        $user = RoleMiddleware::requireRole('researcher');

        $item = ArchiveItemRepository::findById($id);
        if (!$item) {
            JsonResponse::notFound('Archive record not found.');
        }

        $isOwner = ((int)$user['id'] === (int)$item['submitted_by']);
        $isReviewer = RoleMiddleware::hasRole($user, 'reviewer');

        if (!$isOwner && !$isReviewer) {
            JsonResponse::forbidden('You can only edit your own submissions.');
        }

        // If not a reviewer, only draft or rejected records can be edited
        if (!$isReviewer && !in_array($item['status'], ['draft', 'rejected', 'pending_review'], true)) {
            JsonResponse::forbidden('Published or archived records cannot be edited directly.');
        }

        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        $isDraft = ($input['status'] ?? $item['status']) === 'draft';

        $errors = ArchiveItemValidator::validate($input, $isDraft);
        if (!empty($errors)) {
            JsonResponse::validationError('Validation failed. Please check the fields.', $errors);
        }

        ArchiveItemRepository::update($id, $input);

        // Sync tags if provided
        if (isset($input['tags']) && is_array($input['tags'])) {
            ArchiveItemRepository::syncTags($id, $input['tags']);
        }

        AuditRepository::log($user['id'], 'item_updated', 'archive_item', $id, ['title' => $input['title']]);

        $updated = ArchiveItemRepository::findById($id);
        JsonResponse::success($updated);
    }

    public static function myWorkspace(): void {
        $user = RoleMiddleware::requireRole('researcher');
        $items = ArchiveItemRepository::findByUser((int)$user['id']);
        JsonResponse::success($items);
    }

    public static function locations(): void {
        $locations = LocationRepository::findAll();
        JsonResponse::success($locations);
    }

    public static function tags(): void {
        $pdo = Database::getConnection();
        $stmt = $pdo->query("SELECT id, name, slug FROM tags ORDER BY name ASC");
        JsonResponse::success($stmt->fetchAll());
    }
}
