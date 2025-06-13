<?php
// server/index.php
require_once __DIR__ . '/config/databaseconnect.php';
require_once __DIR__ . '/lib/auth.php';
require_once __DIR__ . '/../vendor/autoload.php';
$router = new AltoRouter();

error_log("API Request Received: " . $_SERVER['REQUEST_URI']);
error_log("REQUEST_METHOD: " . $_SERVER['REQUEST_METHOD']);
error_log("HTTP_ORIGIN: " . ($_SERVER['HTTP_ORIGIN'] ?? 'none'));

// 允许的域名列表
$allowedOrigins = [
    'http://localhost:3000',
    'http://jobpulse.local' // 确保域名已添加到列表
];
// 动态设置跨域头
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Access-Control-Allow-Credentials: true"); // 如果需要携带Cookie
}

// 处理OPTIONS预检请求
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit("true");
}

// API路由
if (preg_match('/^\/api\//', $_SERVER['REQUEST_URI'])) {  
    // API路由映射
    $router->map('POST', '/api/auth/[register|login|refresh|revoke:action]', function($action) {
        $_GET['action'] = $action;
        require __DIR__ . '/api/auth.php';
    });

    // $router->map('GET', '/api/test', function() {
    //     echo json_encode(['message' => 'Test endpoint']);
    //     require __DIR__ . '/api/test_api.php';
    // });

    $router->map('GET', '/api/jobs/[*:id]?', function($id = null) {
        require __DIR__ . '/api/jobs.php';
    });

    $router->map('POST', '/api/jobs', function() {
        require __DIR__ . '/api/jobs.php';
    }, 'jobs_post');

    $router->map('PUT', '/api/jobs/[i:id]/status', function($id) {
        $_GET['job_id'] = $id;
        require __DIR__ . '/api/jobs.php';
    }, 'jobs_status_put');

    $router->map('DELETE', '/api/jobs/[i:id]', function($id) {
        $_GET['job_id'] = $id;
        require __DIR__ . '/api/jobs.php';
    }, 'jobs_delete');

    $router->map('GET', '/api/employer/profile', function() {
        require __DIR__ . '/api/employer.php';
    }, 'employer_profile_get');

    $router->map('PUT', '/api/employer/profile', function() {
        require __DIR__ . '/api/employer.php';
    }, 'employer_profile_put');

    $router->map('POST', '/api/upload', function() {
        require __DIR__ . '/api/upload.php';
    }, 'upload');

    $router->map('GET', '/api/posts', function() {
        require __DIR__ . '/api/posts.php';
    }, 'get_post');

    $router->map('POST', '/api/posts', function() {
        require __DIR__ . '/api/posts.php';
    }, 'create_post');




    $match = $router->match();
    if ($match) {// && is_callable($match['target'])) {
        call_user_func_array($match['target'], $match['params']);
    } else {
        error_log("No route matched for: " . $_SERVER['REQUEST_URI']);
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint not found1']);
    }
   
} else {
    // 添加API路径排除
    if (preg_match('/^\/api\//', $_SERVER['REQUEST_URI'])) {
        http_response_code(404);
        die(json_encode(['error' => 'Endpoint not found2']));
    }
    // 静态文件路由（托管React构建产物）
    $filePath = __DIR__ . '/../public' . $_SERVER['REQUEST_URI'];
    if (file_exists($filePath)) {
        $mimeTypes = [
            '.js' => 'application/javascript',
            '.css' => 'text/css',
            '.png' => 'image/png',
        // 添加更多类型...
        ];
        $ext = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
        if (isset($mimeTypes[$ext])) {
            header('Content-Type: ' . $mimeTypes[$ext]);
        }
        readfile($filePath);
    }

    // $filePath = __DIR__ . '/../public' . $_SERVER['REQUEST_URI'];
    // if (file_exists($filePath)) {
    //     readfile($filePath);
    // } else {
    //     http_response_code(404);
    //     readfile(__DIR__ . '/../public/404.html');
    // }
}
?>