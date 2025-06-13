<?php
// server/api/upload.php
require_once __DIR__ . '/../lib/auth.php';
require_once __DIR__ . '/../lib/utils.php';
require __DIR__ . '/../config/databaseconnect.php';

// 加载环境变量
require_once __DIR__ . '/../../vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../config');
$dotenv->safeLoad();

header('Content-Type: application/json');

// 认证验证
$token = getBearerToken();
if (!$token) {
    sendJsonResponse(false, 'Unauthorized', [], 401);
    exit;
}
error_log("Received token: $token");

$decoded = validateJWT($token);
if (!$decoded) {
    sendJsonResponse(false, 'Invalid token', [], 401);
    exit;
}

// 只允许企业用户上传
if ($decoded->role !== 'employer') {
    sendJsonResponse(false, 'Forbidden', [], 403);
    exit;
}

$baseUrl = $_ENV['BASE_URL'] ?? 'http://jobpulse.local';
$uploadsBaseDir = $_ENV['UPLOADS_DIR'] ?? __DIR__ . '/../../public/uploads';
$uploadDir = $uploadsBaseDir . '/company';


// 确保上传目录存在
if (!is_dir($uploadDir)) {
    if (!mkdir($uploadDir, 0777, true)) {
        sendJsonResponse(false, 'Failed to create upload directory');
        exit;
    }
}

$response = [];
$userId = $decoded->sub;

// 支持的图片类型
$allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
$maxFileSize = 5 * 1024 * 1024; // 5MB

$conn = $dbconnect;
$stmt = $conn->prepare("SELECT profile_image, cover_image FROM Employer WHERE user_id = :user_id");
$stmt->bindParam(':user_id', $userId);
$stmt->execute();
$oldImages = $stmt->fetch(PDO::FETCH_ASSOC);

foreach ($_FILES as $field => $file) {
    if ($file['error'] !== UPLOAD_ERR_OK) {
        $response[$field] = [
            'error' => 'Upload error: ' . $file['error']
        ];
        continue;
    }
    
    // 验证文件类型
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
    
    if (!in_array($mime, $allowedTypes)) {
        $response[$field] = [
            'error' => 'Invalid file type. Only JPG, PNG, GIF and WEBP are allowed.'
        ];
        continue;
    }
    
    // 验证文件大小
    if ($file['size'] > $maxFileSize) {
        $response[$field] = [
            'error' => 'File too large. Max size is 5MB.'
        ];
        continue;
    }
    
    // 生成唯一文件名
    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = "{$userId}_" . uniqid() . '.' . $ext;
    $targetPath = $uploadDir . '/' . $filename;
    
    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        // 删除旧照片（如果存在）
        if ($field === 'profileImage' && !empty($oldImages['profile_image'])) {
            $oldPath = $uploadDir . '/' . basename($oldImages['profile_image']);
            if (file_exists($oldPath)) {
                unlink($oldPath);
            }
        }
        
        if ($field === 'coverImage' && !empty($oldImages['cover_image'])) {
            $oldPath = $uploadDir . '/' . basename($oldImages['cover_image']);
            if (file_exists($oldPath)) {
                unlink($oldPath);
            }
        }
        
        $response[$field] = [
            'url' => $baseUrl . '/uploads/company/' . $filename,
            'filename' => $filename
        ];
    } else {
        $response[$field] = [
            'error' => 'Failed to move uploaded file'
        ];
    }
}

// foreach ($_FILES as $field => $file) {
//     if ($file['error'] !== UPLOAD_ERR_OK) {
//         $response[$field] = [
//             'error' => 'Upload error: ' . $file['error']
//         ];
//         continue;
//     }
    
//     // 验证文件类型
//     $finfo = finfo_open(FILEINFO_MIME_TYPE);
//     $mime = finfo_file($finfo, $file['tmp_name']);
//     finfo_close($finfo);
    
//     if (!in_array($mime, $allowedTypes)) {
//         $response[$field] = [
//             'error' => 'Invalid file type. Only JPG, PNG, GIF and WEBP are allowed.'
//         ];
//         continue;
//     }
    
//     // 验证文件大小
//     if ($file['size'] > $maxFileSize) {
//         $response[$field] = [
//             'error' => 'File too large. Max size is 5MB.'
//         ];
//         continue;
//     }
    
//     // 生成唯一文件名
//     $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
//     $filename = "{$userId}_" . uniqid() . '.' . $ext;
//     $targetPath = $uploadDir . '/' . $filename;
    
//     if (move_uploaded_file($file['tmp_name'], $targetPath)) {
//         $response[$field] = [
//             'url' => $baseUrl . '/uploads/company/' . $filename,
//             'filename' => $filename
//         ];
//     } else {
//         $response[$field] = [
//             'error' => 'Failed to move uploaded file'
//         ];
//     }
// }

if (!empty($response)) {
    sendJsonResponse(true, 'Files uploaded', $response);
} else {
    sendJsonResponse(false, 'No files uploaded');
}