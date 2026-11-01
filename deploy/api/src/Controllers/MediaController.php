<?php
namespace Virasat\Controllers;

use Virasat\Repositories\ArchiveItemRepository;
use Virasat\Repositories\MediaRepository;
use Virasat\Repositories\AuditRepository;
use Virasat\Responses\JsonResponse;
use Virasat\Middleware\AuthMiddleware;
use Virasat\Middleware\RoleMiddleware;
use Virasat\Config\Env;
use finfo;

class MediaController {
    private static array $allowedMimes = [
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/webp' => 'webp',
        'image/svg+xml' => 'svg',
        'application/pdf' => 'pdf'
    ];

    public static function upload(int $itemId): void {
        $user = RoleMiddleware::requireRole('researcher');

        $item = ArchiveItemRepository::findById($itemId);
        if (!$item) {
            JsonResponse::notFound('Archive record not found.');
        }

        $isOwner = ((int)$user['id'] === (int)$item['submitted_by']);
        $isReviewer = RoleMiddleware::hasRole($user, 'reviewer');
        if (!$isOwner && !$isReviewer) {
            JsonResponse::forbidden('You do not have permission to attach media to this record.');
        }

        if (empty($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
            $errorCode = $_FILES['file']['error'] ?? UPLOAD_ERR_NO_FILE;
            $errorMsg = match ($errorCode) {
                UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE => 'File exceeds maximum upload size (20MB).',
                UPLOAD_ERR_PARTIAL => 'File was only partially uploaded.',
                UPLOAD_ERR_NO_FILE => 'No file was provided in the upload request.',
                default => 'Upload failed due to a server error.'
            };
            JsonResponse::error($errorMsg, 'UPLOAD_ERROR', 400);
        }

        $file = $_FILES['file'];
        $maxBytes = (int)Env::get('MAX_UPLOAD_MB', 20) * 1024 * 1024;
        if ($file['size'] > $maxBytes) {
            JsonResponse::error('File exceeds maximum upload size (20MB).', 'FILE_TOO_LARGE', 422);
        }

        // Verify MIME type using fileinfo
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $detectedMime = $finfo->file($file['tmp_name']);

        // Fallback for SVG if detected as text/xml or text/plain
        $originalExt = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if ($originalExt === 'svg' && in_array($detectedMime, ['text/xml', 'text/plain', 'image/svg+xml'])) {
            $detectedMime = 'image/svg+xml';
        }

        if (!array_key_exists($detectedMime, self::$allowedMimes)) {
            JsonResponse::error(
                "Unsupported file type ({$detectedMime}). Supported formats: JPEG, PNG, WebP, SVG, PDF.",
                'INVALID_FILE_TYPE',
                422
            );
        }

        $ext = self::$allowedMimes[$detectedMime];
        $storageKey = bin2hex(random_bytes(16)) . '.' . $ext;
        $storageDir = Env::get('MEDIA_STORAGE_PATH', __DIR__ . '/../../storage/uploads');

        if (!is_dir($storageDir) && !mkdir($storageDir, 0755, true)) {
            JsonResponse::error('Failed to initialise storage directory.', 'STORAGE_ERROR', 500);
        }

        $targetPath = $storageDir . '/' . $storageKey;
        if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
            JsonResponse::error('Failed to write uploaded file to private storage.', 'STORAGE_ERROR', 500);
        }

        $sha256 = hash_file('sha256', $targetPath);
        $isPrimary = empty($item['media']) ? 1 : (isset($_POST['is_primary']) && $_POST['is_primary'] ? 1 : 0);

        $mediaId = MediaRepository::create([
            'archive_item_id' => $itemId,
            'storage_key' => $storageKey,
            'original_filename' => basename($file['name']),
            'mime_type' => $detectedMime,
            'file_size' => filesize($targetPath),
            'sha256_checksum' => $sha256,
            'alt_text' => $_POST['alt_text'] ?? null,
            'caption' => $_POST['caption'] ?? null,
            'is_primary' => $isPrimary
        ]);

        AuditRepository::log($user['id'], 'media_uploaded', 'media_asset', $mediaId, [
            'item_id' => $itemId,
            'filename' => basename($file['name'])
        ]);

        $created = MediaRepository::findById($mediaId);
        JsonResponse::success($created, null, 201);
    }

    public static function view(int $id): void {
        $media = MediaRepository::findById($id);
        if (!$media) {
            JsonResponse::notFound('Media asset not found.');
        }

        $item = ArchiveItemRepository::findById($media['archive_item_id']);
        if (!$item) {
            JsonResponse::notFound('Associated archive item not found.');
        }

        // Access control
        if ($item['status'] !== 'published' || $item['visibility'] !== 'public') {
            $user = AuthMiddleware::user();
            if (!$user) {
                JsonResponse::notFound('Media asset not found.');
            }
            $isOwner = ((int)$user['id'] === (int)$item['submitted_by']);
            $isReviewer = RoleMiddleware::hasRole($user, 'reviewer');
            if (!$isOwner && !$isReviewer) {
                JsonResponse::forbidden('You do not have permission to view this media asset.');
            }
        }

        $storageDir = Env::get('MEDIA_STORAGE_PATH', __DIR__ . '/../../storage/uploads');
        $filePath = $storageDir . '/' . $media['storage_key'];

        if (!file_exists($filePath)) {
            JsonResponse::notFound('Media file is missing from storage.');
        }

        header('Content-Type: ' . $media['mime_type']);
        header('Content-Length: ' . filesize($filePath));
        header('Content-Disposition: inline; filename="' . addslashes($media['original_filename']) . '"');
        header('X-Content-Type-Options: nosniff');
        header('Cache-Control: public, max-age=86400');

        readfile($filePath);
        exit;
    }

    public static function destroy(int $id): void {
        $user = RoleMiddleware::requireRole('researcher');

        $media = MediaRepository::findById($id);
        if (!$media) {
            JsonResponse::notFound('Media asset not found.');
        }

        $item = ArchiveItemRepository::findById($media['archive_item_id']);
        if (!$item) {
            JsonResponse::notFound('Archive item not found.');
        }

        $isOwner = ((int)$user['id'] === (int)$item['submitted_by']);
        $isReviewer = RoleMiddleware::hasRole($user, 'reviewer');
        if (!$isOwner && !$isReviewer) {
            JsonResponse::forbidden('You do not have permission to delete this media asset.');
        }

        $storageDir = Env::get('MEDIA_STORAGE_PATH', __DIR__ . '/../../storage/uploads');
        $filePath = $storageDir . '/' . $media['storage_key'];
        if (file_exists($filePath)) {
            unlink($filePath);
        }

        MediaRepository::delete($id);
        AuditRepository::log($user['id'], 'media_deleted', 'media_asset', $id);

        JsonResponse::success(['message' => 'Media deleted successfully.']);
    }
}

