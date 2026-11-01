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
}
