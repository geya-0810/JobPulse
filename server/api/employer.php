<?php
// server/api/employer.php
header("Access-Control-Allow-Origin: http://jobpulse.local");
header("Access-Control-Allow-Methods: GET, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

require_once __DIR__ . '/../lib/auth.php';
require_once __DIR__ . '/../lib/utils.php';
require __DIR__ . '/../config/databaseconnect.php';

// 加载环境变量
require_once __DIR__ . '/../../vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../config');
$dotenv->safeLoad();

header('Content-Type: application/json');

error_log("API: employer.php accessed");
error_log("Request method: " . $_SERVER['REQUEST_METHOD']);

// 获取认证信息
$token = getBearerToken();
if (!$token) {
    sendJsonResponse(false, 'Unauthorized', [], 401);
    exit;
}

error_log("Received token: $token");
$decoded = validateJWT($token);
if (!$decoded) {
    error_log("JWT validation failed");
    sendJsonResponse(false, 'Invalid token', [], 401);
    exit;
} else {
    error_log("JWT valid. User ID: {$decoded->sub}, Role: {$decoded->role}");
}

$userId = $decoded->sub;
$role = $decoded->role ?? '';
error_log("User ID: $userId, Role: $role");
logError("User ID: $userId, Role: $role");

// 确保用户是企业角色
if ($role !== 'employer') {
    sendJsonResponse(false, 'Forbidden: Employer access only', [], 403);
    exit;
}

$conn = $dbconnect; // 使用 PDO 连接

// 根据请求方法处理
$method = $_SERVER['REQUEST_METHOD'];
switch ($method) {
    case 'GET':
        // 获取企业资料
        $stmt = $conn->prepare("
            SELECT 
                u.user_id, u.email,
                e.employer_id, e.company_name, e.registration_id, 
                e.company_phone AS phone, e.company_address AS address,
                e.website, e.industry_type, e.company_size, e.founded_year,
                e.company_description, e.profile_image, e.cover_image
            FROM User u
            JOIN Employer e ON u.user_id = e.user_id
            WHERE u.user_id = :user_id
        ");
        $stmt->bindParam(':user_id', $userId);
        error_log("Executing profile query for user: $userId");
        $stmt->execute();
        $profile = $stmt->fetch(PDO::FETCH_ASSOC); // 使用 fetch() 获取单行结果
        
        if ($profile) {
            sendJsonResponse(true, 'Profile retrieved', $profile);
        } else {
            sendJsonResponse(false, 'Profile not found', [], 404);
        }
        break;
        
    case 'PUT':
        // 更新企业资料
        $data = json_decode(file_get_contents('php://input'), true);
        
        // 基本字段更新
        $updateFields = [
            'company_name' => $data['company_name'] ?? '',
            'registration_id' => $data['registration_id'] ?? '',
            'company_phone' => $data['phone'] ?? '',
            'company_address' => $data['address'] ?? '',
            'website' => $data['website'] ?? '',
            'industry_type' => $data['industry_type'] ?? '',
            'company_size' => $data['company_size'] ?? '',
            'founded_year' => $data['founded_year'] ?? '',
            'company_description' => $data['company_description'] ?? '',
            'profile_image' => $data['profile_image'] ?? '',
            'cover_image' => $data['cover_image'] ?? ''
        ];
        
        // 构建更新SQL
        $sql = "UPDATE Employer SET ";
        $params = [];
        
        foreach ($updateFields as $field => $value) {
            if ($value !== null && $value !== '') {
                $sql .= "$field = :$field, ";
                $params[":$field"] = sanitizeInput($value);
            }
        }
        
        // 特殊处理密码更新
        if (!empty($data['password'])) {
            $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
            $userSql = "UPDATE User SET password = :password WHERE user_id = :user_id";
            $userStmt = $conn->prepare($userSql);
            $userStmt->execute([':password' => $hashedPassword, ':user_id' => $userId]);
            
            if ($userStmt->rowCount() === 0) { // 使用 rowCount() 检查影响的行数
                sendJsonResponse(false, 'Failed to update password: ' . $conn->errorInfo()[2]);
                exit;
            }
        }
        
        // 如果没有其他字段更新，直接返回成功
        if (empty($params)) {
            sendJsonResponse(true, 'Profile updated successfully');
            exit;
        }
        
        $sql = rtrim($sql, ', ') . " WHERE user_id = :user_id";
        $params[':user_id'] = $userId;
        
        $stmt = $conn->prepare($sql);
        error_log("SQL: $sql");
        error_log("Params: " . print_r($params, true));
        if ($stmt->execute($params)) {
            sendJsonResponse(true, 'Profile updated successfully');
        } else {
            sendJsonResponse(false, 'Failed to update profile: ' . $stmt->errorInfo()[2]); // 使用 errorInfo() 获取 PDO 错误信息
        }
        break;
        
    default:
        sendJsonResponse(false, 'Method not allowed', [], 405);
        break;
}
?>