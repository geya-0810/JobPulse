<?php
// server/lib/utils.php
// 输入过滤与清理
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

// 统一JSON响应格式
function sendJsonResponse($success, $message = '', $data = [], $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data
    ]);
    exit;
}

// 验证邮箱格式
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// 生成随机令牌（用于密码重置等场景）
function generateRandomToken($length = 32) {
    return bin2hex(random_bytes($length));
}

// 记录错误日志（需确保logs目录存在）
function logError($errorMessage) {
    $logFile = __DIR__ . '/../../logs/error.log';
    $timestamp = date('Y-m-d H:i:s');
    error_log("[$timestamp] $errorMessage\n", 3, $logFile);
}

// 检查必填字段
function checkRequiredFields($data, $requiredFields) {
    $missing = [];
    foreach ($requiredFields as $field) {
        if (empty($data[$field])) {
            $missing[] = $field;
        }
    }
    return $missing;
}

// 防止XSS攻击的输出转义
function escapeOutput($string) {
    return htmlspecialchars($string, ENT_QUOTES, 'UTF-8');
}
?>