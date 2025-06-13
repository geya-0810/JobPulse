<?php
// server/api/posts.php
header("Access-Control-Allow-Origin: http://jobpulse.local");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

require_once __DIR__ . '/../lib/auth.php';
require_once __DIR__ . '/../lib/utils.php';
require __DIR__ . '/../config/databaseconnect.php';

require_once __DIR__ . '/../../vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../config');
$dotenv->safeLoad();

// 获取认证信息
$token = getBearerToken();
if (!$token) {
    sendJsonResponse(false, 'Unauthorized', [], 401);
    exit;
}

$decoded = validateJWT($token);
if (!$decoded) {
    sendJsonResponse(false, 'Invalid token', [], 401);
    exit;
}

$userId = $decoded->sub;
$role = $decoded->role ?? '';

// 确保用户是企业角色
if ($role !== 'employer') {
    sendJsonResponse(false, 'Forbidden: Employer access only', [], 403);
    exit;
}

$conn = $dbconnect;

// 获取企业ID
$stmt = $conn->prepare("
    SELECT employer_id 
    FROM Employer 
    WHERE user_id = :user_id
");
$stmt->bindParam(':user_id', $userId);
$stmt->execute();
$employer = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$employer) {
    sendJsonResponse(false, 'Employer profile not found', [], 404);
    exit;
}

$employerId = $employer['employer_id'];

// 从环境变量获取配置
$baseUrl = $_ENV['BASE_URL'] ?? 'http://jobpulse.local';
$uploadsBaseDir = $_ENV['UPLOADS_DIR'] ?? __DIR__ . '/../../public/uploads';
$postsUploadDir = $uploadsBaseDir . '/posts';

// 处理POST请求
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // 获取表单数据
        $title = sanitizeInput($_POST['title'] ?? '');
        $content = sanitizeInput($_POST['content'] ?? '');
        $category = sanitizeInput($_POST['category'] ?? 'news_announcements');
        
        if (empty($title)) {
            sendJsonResponse(false, 'Post title is required');
            exit;
        }
        
        // 创建新帖子
        $stmt = $conn->prepare("
            INSERT INTO Post (
                publisher_type, 
                employer_id, 
                title, 
                content, 
                category
            ) VALUES (
                'employer',
                :employer_id,
                :title,
                :content,
                :category
            )
        ");
        
        $stmt->execute([
            ':employer_id' => $employerId,
            ':title' => $title,
            ':content' => $content,
            ':category' => $category
        ]);
        
        $postId = $conn->lastInsertId();
        
        // 处理上传的媒体文件
        $mediaFiles = [];
        // 检查 $_FILES['media'] 是否存在且是一个数组，并且它的 'name' 键也是一个数组
        if (isset($_FILES['media']) && is_array($_FILES['media']['name'])) {
            // 确保上传目录存在
            if (!is_dir($postsUploadDir)) {
                if (!mkdir($postsUploadDir, 0777, true)) {
                    throw new Exception('Failed to create upload directory');
                }
            }

            foreach ($_FILES['media']['name'] as $index => $name) {
                // 确保当前文件没有错误
                if (isset($_FILES['media']['error'][$index]) && $_FILES['media']['error'][$index] === UPLOAD_ERR_OK) {
                    $tmpName = $_FILES['media']['tmp_name'][$index];

                    $extension = pathinfo($name, PATHINFO_EXTENSION);
                    $newFilename = uniqid('post_') . '.' . $extension;
                    $filePath = $postsUploadDir . '/' . $newFilename;

                    if (move_uploaded_file($tmpName, $filePath)) {
                        // 确定媒体类型
                        $mediaType = 'document';
                        $mimeType = mime_content_type($filePath);

                        if (strpos($mimeType, 'image/') === 0) {
                            $mediaType = 'image';
                        } elseif (strpos($mimeType, 'video/') === 0) {
                            $mediaType = 'video';
                        }

                        // 计算相对路径（从public目录开始）
                        $relativePath = '/uploads/posts/' . $newFilename;
                        $fullUrl = $baseUrl . $relativePath;

                        // 保存到PostMedia表
                        $mediaStmt = $conn->prepare("
                            INSERT INTO PostMedia (
                                post_id,
                                media_type,
                                file_path
                            ) VALUES (
                                :post_id,
                                :media_type,
                                :file_path
                            )
                        ");

                        $mediaStmt->execute([
                            ':post_id' => $postId,
                            ':media_type' => $mediaType,
                            ':file_path' => $relativePath  // 存储相对路径
                        ]);

                        $mediaFiles[] = [
                            'type' => $mediaType,
                            'path' => $relativePath,
                            'url' => $fullUrl  // 返回完整URL给前端
                        ];
                    }
                }
            }
        }
        // 如果只上传了一个文件，并且$_FILES['media']['name']是一个字符串，处理这种情况
        // 这种处理方式假设如果没有多个文件，$_FILES['media']['name'] 会是一个字符串，而不是一个包含一个元素的数组
        else if (isset($_FILES['media']) && is_string($_FILES['media']['name']) && $_FILES['media']['error'] === UPLOAD_ERR_OK) {
            // 确保上传目录存在
            if (!is_dir($postsUploadDir)) {
                if (!mkdir($postsUploadDir, 0777, true)) {
                    throw new Exception('Failed to create upload directory');
                }
            }

            $name = $_FILES['media']['name'];
            $tmpName = $_FILES['media']['tmp_name'];

            $extension = pathinfo($name, PATHINFO_EXTENSION);
            $newFilename = uniqid('post_') . '.' . $extension;
            $filePath = $postsUploadDir . '/' . $newFilename;

            if (move_uploaded_file($tmpName, $filePath)) {
                $mediaType = 'document';
                $mimeType = mime_content_type($filePath);

                if (strpos($mimeType, 'image/') === 0) {
                    $mediaType = 'image';
                } elseif (strpos($mimeType, 'video/') === 0) {
                    $mediaType = 'video';
                }

                $relativePath = '/uploads/posts/' . $newFilename;
                $fullUrl = $baseUrl . $relativePath;

                $mediaStmt = $conn->prepare("
                    INSERT INTO PostMedia (
                        post_id,
                        media_type,
                        file_path
                    ) VALUES (
                        :post_id,
                        :media_type,
                        :file_path
                    )
                ");

                $mediaStmt->execute([
                    ':post_id' => $postId,
                    ':media_type' => $mediaType,
                    ':file_path' => $relativePath
                ]);

                $mediaFiles[] = [
                    'type' => $mediaType,
                    'path' => $relativePath,
                    'url' => $fullUrl
                ];
            }
        }
        
        sendJsonResponse(true, 'Post created successfully', [
            'post_id' => $postId,
            'title' => $title,
            'media' => $mediaFiles
        ]);
        
    } catch (PDOException $e) {
        error_log("Database error: " . $e->getMessage());
        sendJsonResponse(false, 'Database error: ' . $e->getMessage());
    } catch (Exception $e) {
        error_log("Error: " . $e->getMessage());
        sendJsonResponse(false, 'Error: ' . $e->getMessage());
    }
} else if($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // 查询当前企业的所有帖子
        $stmt = $conn->prepare("
            SELECT 
                p.post_id, 
                p.title, 
                p.content, 
                p.category,
                p.posted_at,
                pm.media_id,
                pm.media_type,
                pm.file_path
            FROM Post p
            LEFT JOIN PostMedia pm ON p.post_id = pm.post_id
            WHERE p.employer_id = :employer_id
            ORDER BY p.posted_at DESC
        ");
        $stmt->bindParam(':employer_id', $employerId);
        $stmt->execute();
        $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // 重组数据，将媒体文件按帖子分组
        $groupedPosts = [];
        foreach ($posts as $row) {
            $postId = $row['post_id'];
            if (!isset($groupedPosts[$postId])) {
                $groupedPosts[$postId] = [
                    'post_id' => $postId,
                    'title' => $row['title'],
                    'content' => $row['content'],
                    'category' => $row['category'],
                    'posted_at' => $row['posted_at'],
                    'media' => []
                ];
            }
            
            // 如果有媒体文件
            if ($row['media_id']) {
                $mediaUrl = $baseUrl . $row['file_path'];
                $groupedPosts[$postId]['media'][] = [
                    'media_id' => $row['media_id'],
                    'type' => $row['media_type'],
                    'url' => $mediaUrl,
                    'path' => $row['file_path']
                ];
            }
        }
        
        // 转换为索引数组
        $result = array_values($groupedPosts);
        sendJsonResponse(true, 'Posts retrieved', $result);
    } catch (PDOException $e) {
        error_log("Database error: " . $e->getMessage());
        sendJsonResponse(false, 'Database error: ' . $e->getMessage());
    } catch (Exception $e) {
        error_log("Error: " . $e->getMessage());
        sendJsonResponse(false, 'Error: ' . $e->getMessage());
    }
} else {
    sendJsonResponse(false, 'Method not allowed', [], 405);
}
?>