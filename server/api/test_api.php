<!--?php
header('Content-Type: application/json');
echo json_encode(['message' => 'API is working!']);
?-->
<?php
// ... (你的其他 PHP 代码，包括引入必要的库和定义 validateJWT() 函数)

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $token = getBearerToken(); // 从 Authorization header 获取 token

    if (!$token) {
        http_response_code(401);
        echo json_encode(['error' => 'No token provided']);
        exit;
    }

    $decoded = validateJWT($token);

    if (!$decoded) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid token']);
        exit;
    }

    // JWT 验证成功，你可以访问 $decoded 中的用户信息
    echo json_encode(['message' => 'Protected resource accessed successfully', 'user' => $decoded]);
}
?>