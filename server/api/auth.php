<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/../logs/php_errors.log');
// // server/api/auth.php

// 强制设置JSON响应头
header("Content-Type: application/json; charset=UTF-8");
// echo json_encode(['message' => 'Entered auth.php logic']);
// 统一错误响应格式
function dieWithJsonError($message, $code = 500) {
    http_response_code($code);
    die(json_encode(['error' => $message]));
}

require __DIR__ . '/../config/databaseconnect.php';
require_once __DIR__ . '/../lib/auth.php';
require_once __DIR__ . '/../lib/utils.php';

$db = $dbconnect;
$method = $_SERVER['REQUEST_METHOD'];

// 处理CORS预检请求
if ($method === 'OPTIONS') {
    http_response_code(200);
    exit;
}

switch ($method) {
    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        $action = $_GET['action'] ?? '';

        switch ($action) {
            // 用户注册
            case 'register':
                error_log("DEBUG: Entered registration logic");
                $role = $data['role']; // 'jobseeker' 或 'employer'
                $email = sanitizeInput($data['email']);
                $password = password_hash($data['password'], PASSWORD_DEFAULT);

                // 定义不同角色所需的字段
                $requiredFields = ($role === 'jobseeker')
                    ? ['full_name', 'email', 'password']
                    : ['company_name', 'email', 'password'];

                // 检查逻辑
                $missingFields = checkRequiredFields($data, $requiredFields);
                if (!empty($missingFields)) {
                    sendJsonResponse(false, "Missing fields: " . implode(', ', $missingFields), [], 400);
                }
                error_log("DEBUG: code: 22 Attempting to insert user with email: $email");

                try {
                    $db->beginTransaction();                    

                    // 插入 User 表
                    $stmt = $db->prepare("INSERT INTO User (email, password, user_type) VALUES (?, ?, ?)");
                    $status = $stmt->execute([$email, $password, $role]);
                    $user_id = $db->lastInsertId();
                    
                    error_log("DEBUG: code: 23 Attempting to insert user with email: $email");
                    if (!$status) {
                        error_log("DB Error: " . implode(", ", $stmt->errorInfo()));
                    }

                    // 插入角色表
                    $table = $role === 'jobseeker' ? 'JobSeeker' : 'Employer';
                    $field = $role === 'jobseeker' ? 'full_name' : 'company_name';
                    $stmt = $db->prepare("INSERT INTO $table (user_id, $field) VALUES (?, ?)");
                    $stmt->execute([$user_id, $data[$field]]);

                    $db->commit(); 
                    $stmt = $db->prepare("SELECT * FROM User WHERE email = ?");
                    $stmt->execute([$email]);
                    $user = $stmt->fetch(PDO::FETCH_ASSOC);
                    error_log("User inserted: " . json_encode($user));

                    $token = generateJWT($user_id, $email); // Generate a JWT (You need your function)
                    $response = [
                        "success" => true,
                        "user_id" => $user_id,
                        "token" => $token  // Include the token in the response
                    ];
                    http_response_code(201); // 201 Created (more appropriate than 200)
                    echo json_encode($response);
                    
                } catch (PDOException $e) {
                    error_log("CRITICAL DB ERROR: " . $e->getMessage());
                    $db->rollBack();
                    http_response_code(500);
                    echo json_encode(['error' => 'Registration failed: ' . $e->getMessage()]);
                }
                break;

            case 'login':
                $data = json_decode(file_get_contents("php://input"), true);
                $email = sanitizeInput($data['email'] ?? '');
                $password = $data['password'] ?? '';
                $role = $data['role'] ?? 'jobseeker'; // 新增角色验证

                // 参数验证
                if (empty($email) || empty($password)) {
                    dieWithJsonError('Email and password are required', 400);
                }

                try {
                    // 查询用户并验证角色
                    $stmt = $db->prepare("
                        SELECT u.*, 
                            j.seeker_id AS seeker_id,
                            e.employer_id AS employer_id
                        FROM User u
                        LEFT JOIN JobSeeker j ON u.user_id = j.user_id
                        LEFT JOIN Employer e ON u.user_id = e.user_id
                        WHERE u.email = ? AND u.user_type = ?
                    ");

                    $stmt->execute([$email, $role]);
                    $user = $stmt->fetch(PDO::FETCH_ASSOC);

                    if (!$user || !password_verify($password, $user['password'])) {
                        dieWithJsonError('Invalid credentials', 401);
                    }

                    // 生成JWT（确保auth.php中已正确实现generateJWT函数）
                    $token = generateJWT(
                        $user['user_id'], 
                        $email,
                        [
                            'role' => $role,
                            'role_id' => ($role === 'jobseeker') ? $user['seeker_id'] : $user['employer_id']
                        ]
                    );
            
                    echo json_encode([
                        'token' => $token,
                        'user_type' => $role,
                        'user_id' => $user['user_id']
                    ]);
            
                } catch (PDOException $e) {
                    error_log("Login error: " . $e->getMessage());
                    dieWithJsonError('Login failed', 500);
                }
                break;

            default:
                http_response_code(400);
                echo json_encode(['error' => 'Invalid action']);
                
        }
        break;
    case 'GET':
        http_response_code(200);
        echo json_encode(['message' => 'API is active']);
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
}
?>