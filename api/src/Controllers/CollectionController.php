<?php
namespace Virasat\Controllers;

use Virasat\Repositories\CollectionRepository;
use Virasat\Responses\JsonResponse;

class CollectionController {
    public static function index(): void {
        $collections = CollectionRepository::findAllPublished();
        JsonResponse::success($collections);
    }

    public static function show(int $id): void {
        $collection = CollectionRepository::findById($id);
        if (!$collection) {
            JsonResponse::notFound('Collection not found.');
        }
        JsonResponse::success($collection);
    }

    public static function store(): void {
        $user = \Virasat\Middleware\RoleMiddleware::requireRole('reviewer');
        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        if (empty(trim($input['title'] ?? ''))) {
            JsonResponse::error('Title is required.', 'VALIDATION_ERROR', 422);
        }

        $input['curator_id'] = $user['id'];
        $id = CollectionRepository::create($input);

        if (!empty($input['items']) && is_array($input['items'])) {
            CollectionRepository::setItems($id, $input['items']);
        }

        $created = CollectionRepository::findById($id);
        JsonResponse::success($created, null, 201);
    }

    public static function setItems(int $id): void {
        $user = \Virasat\Middleware\RoleMiddleware::requireRole('reviewer');
        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        if (!isset($input['items']) || !is_array($input['items'])) {
            JsonResponse::error('An array of items is required.', 'VALIDATION_ERROR', 422);
        }

        CollectionRepository::setItems($id, $input['items']);
        $updated = CollectionRepository::findById($id);
        JsonResponse::success($updated);
    }
}

