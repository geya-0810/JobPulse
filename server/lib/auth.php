<?php
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
    ini_set('log_errors', 1);
    ini_set('error_log', __DIR__ . '/../logs/php_errors.log');
    // server/lib/auth.php
    require_once __DIR__ . '/../../vendor/autoload.php'; // 确保引入自动加载
    use Firebase\JWT\JWT;
    use Firebase\JWT\Key;
    use Dotenv\Dotenv; 

    $dotenv = Dotenv::createImmutable(__DIR__ . '/../config/');
    $dotenv->safeLoad();

    //putenv("JWT_SECRET=your_secure_key_here");

    // function generateJWT($user_id, $email, $claims = []) {
    //     $secretKey = $_ENV['JWT_SECRET'];
    //     //    $secretKey = getenv('JWT_SECRET');

    //     // error_log("JWT_SECRET值: " . (is_string($secretKey) ? "已设置" : "未设置"));
    //     // error_log("当前环境变量: " . print_r($_ENV, true));

    //     // 确保 $secretKey 是一个字符串
    //     if (!is_string($secretKey) || empty($secretKey)) {
    //         error_log('错误：JWT_SECRET 环境变量未设置或为空！');
    //         throw new Exception('服务器配置错误：JWT 密钥无效');
    //     }

    //     $payload = array_merge([
    //         "iat" => time(),
    //         "exp" => time() + 10000, //7200, // 2小时有效期
    //         "sub" => $user_id,
    //         "email" => $email,
    //         "iss" => "jobpulse.api"
    //     ], $claims);
        
    //     return JWT::encode($payload, $secretKey, 'HS256');
    // }

    // 生成 Access Token (1小时有效期)
    function generateAccessToken($user_id, $email, $claims = []) {
        $secretKey = $_ENV['JWT_SECRET'];
        if (!is_string($secretKey) || empty($secretKey)) {
            error_log('错误：JWT_SECRET 环境变量未设置或为空！');
            throw new Exception('服务器配置错误：JWT 密钥无效');
        }

        $payload = array_merge([
            "iat" => time(),
            "exp" => time() + 3600, // 1小时有效期
            "sub" => $user_id,
            "email" => $email,
            "iss" => "jobpulse.api",
            "token_type" => "access"
        ], $claims);
        
        return JWT::encode($payload, $secretKey, 'HS256');
    }

    // 生成 Refresh Token (90天有效期)
    function generateRefreshToken($user_id) {
        $secretKey = $_ENV['JWT_SECRET'];
        if (!is_string($secretKey) || empty($secretKey)) {
            error_log('错误：JWT_SECRET 环境变量未设置或为空！');
            throw new Exception('服务器配置错误：JWT 密钥无效');
        }

        $payload = [
            "iat" => time(),
            "exp" => time() + (90 * 24 * 3600), // 90天有效期
            "sub" => $user_id,
            "iss" => "jobpulse.api",
            "token_type" => "refresh"
        ];
        
        return JWT::encode($payload, $secretKey, 'HS256');
    }

    function validateJWT($token) {
        try {
            $secretKey = $_ENV['JWT_SECRET'];

            // 再次确保 $secretKey 是一个字符串
            if (!is_string($secretKey) || empty($secretKey)) {
                error_log('错误：JWT_SECRET 环境变量未设置或为空！');
                throw new Exception('服务器配置错误：JWT 密钥无效');
            }

            return JWT::decode($token, new Key($secretKey, 'HS256'));
        } catch (Exception $e) {
            error_log("JWT验证失败: " . $e->getMessage());
            return false;
        }
    }

    function getBearerToken() {
        $headers = getallheaders();
        if (isset($headers['Authorization'])) {
                return trim(str_replace('Bearer ', '', $headers['Authorization']));
            }
        return null;
    }
?>
