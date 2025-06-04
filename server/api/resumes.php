<?php
// server/api/resumes.php
header("Content-Type: application/json");
require __DIR__ . '/../config/databaseconnect.php';
require_once __DIR__ . '/../lib/auth.php';
require_once __DIR__ . '/../lib/utils.php';

$db = databaseconnect();
$method = $_SERVER['REQUEST_METHOD'];
$token = getBearerToken();
$user = validateJWT($token);

if (!$user || $user['role'] !== 'jobseeker') {
    http_response_code(401);
    die(json_encode(['error' => 'Unauthorized']));
}

switch ($method) {
    case 'POST':
        // 上传简历文件（假设前端通过 FormData 上传）
        $file = $_FILES['resume'];
        $allowed_types = ['application/pdf', 'application/msword'];
        
        if (!in_array($file['type'], $allowed_types)) {
            http_response_code(400);
            die(json_encode(['error' => 'Invalid file type']));
        }

        $upload_dir = __DIR__ . '/../../public/uploads/';
        $filename = uniqid() . '_' . $file['name'];
        move_uploaded_file($file['tmp_name'], $upload_dir . $filename);

        // 记录到数据库
        $stmt = $db->prepare("INSERT INTO Resume (seeker_id, file_path) VALUES (?, ?)");
        $stmt->execute([$user['seeker_id'], $filename]);
        echo json_encode(['resume_id' => $db->lastInsertId()]);
        break;

    case 'GET':
        // 获取用户所有简历
        $stmt = $db->prepare("SELECT * FROM Resume WHERE seeker_id = ?");
        $stmt->execute([$user['seeker_id']]);
        $resumes = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($resumes);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
}
?>