<?php
namespace Virasat\Controllers;

use Virasat\Repositories\LocationRepository;
use Virasat\Responses\JsonResponse;

class LocationController {
    public static function index(): void {
        $locations = LocationRepository::getPublicLocationsWithCounts();
        JsonResponse::success($locations);
    }
}
