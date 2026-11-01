<?php
namespace Virasat\Validators;

class ArchiveItemValidator {
    private static array $validTypes = [
        'monument', 'architecture', 'craft', 'document',
        'photograph', 'field_note', 'oral_history', 'other'
    ];

    private static array $validRights = [
        'public_domain', 'cc_by', 'cc_by_sa', 'cc_by_nc',
        'permission_granted', 'permission_pending', 'restricted', 'unknown'
    ];

    public static function validate(array $data, bool $isDraft = false): array {
        $errors = [];

        // Title is always required
        if (empty(trim($data['title'] ?? ''))) {
            $errors['title'] = 'Title is required.';
        } elseif (mb_strlen($data['title']) > 255) {
            $errors['title'] = 'Title cannot exceed 255 characters.';
        }

        // Summary is required
        if (empty(trim($data['summary'] ?? ''))) {
            $errors['summary'] = 'Summary is required.';
        }

        // Item type validation
        if (empty($data['item_type']) || !in_array($data['item_type'], self::$validTypes, true)) {
            $errors['item_type'] = 'A valid item type must be selected.';
        }

        // Region is required
        if (empty(trim($data['region'] ?? ''))) {
            $errors['region'] = 'Region or named place is required.';
        }

        // Source is required
        if (empty(trim($data['source'] ?? ''))) {
            $errors['source'] = 'Source or provenance collection is required.';
        }

        // Rights status validation
        if (empty($data['rights_status']) || !in_array($data['rights_status'], self::$validRights, true)) {
            $errors['rights_status'] = 'A valid rights and permission status must be specified.';
        }

        // If rights is cc_* or permission_granted, attribution text is strongly recommended/required for submission
        if (!$isDraft && in_array($data['rights_status'] ?? '', ['cc_by', 'cc_by_sa', 'cc_by_nc', 'permission_granted'], true)) {
            if (empty(trim($data['attribution_text'] ?? ''))) {
                $errors['attribution_text'] = 'Attribution text is required when a licence or permission is granted.';
            }
        }

        // Coordinates validation if provided
        if (isset($data['latitude']) && $data['latitude'] !== '' && $data['latitude'] !== null) {
            $lat = (float)$data['latitude'];
            if ($lat < -90 || $lat > 90) {
                $errors['latitude'] = 'Latitude must be between -90 and 90 degrees.';
            }
        }

        if (isset($data['longitude']) && $data['longitude'] !== '' && $data['longitude'] !== null) {
            $lon = (float)$data['longitude'];
            if ($lon < -180 || $lon > 180) {
                $errors['longitude'] = 'Longitude must be between -180 and 180 degrees.';
            }
        }

        return $errors;
    }
}

