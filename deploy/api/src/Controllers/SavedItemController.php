<?php
namespace Virasat\Controllers;

use Virasat\Repositories\SavedItemRepository;
use Virasat\Repositories\ArchiveItemRepository;
use Virasat\Responses\JsonResponse;
use Virasat\Middleware\AuthMiddleware;

class SavedItemController {
    public static function index(): void {
        $user = AuthMiddleware::requireAuth();
        $items = SavedItemRepository::listByUser((int)$user['id']);
        JsonResponse::success($items);
    }

    public static function toggle(int $itemId): void {
        $user = AuthMiddleware::requireAuth();

        $item = ArchiveItemRepository::findById($itemId);
        if (!$item) {
            JsonResponse::notFound('Archive record not found.');
        }

        $isSaved = SavedItemRepository::toggle((int)$user['id'], $itemId);
        JsonResponse::success([
            'saved' => $isSaved,
            'item_id' => $itemId,
            'message' => $isSaved ? 'Record saved to your research library.' : 'Record removed from saved items.'
        ]);
    }

    public static function remove(int $itemId): void {
        $user = AuthMiddleware::requireAuth();
        SavedItemRepository::remove((int)$user['id'], $itemId);
        JsonResponse::success([
            'saved' => false,
            'item_id' => $itemId,
            'message' => 'Record removed from saved items.'
        ]);
    }

    public static function status(int $itemId): void {
        $user = AuthMiddleware::user();
        if (!$user) {
            JsonResponse::success(['saved' => false]);
        }

        $isSaved = SavedItemRepository::isSaved((int)$user['id'], $itemId);
        JsonResponse::success(['saved' => $isSaved]);
    }
}
