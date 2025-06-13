<?php
header("Content-Type: application/json");
require __DIR__ . '/../config/databaseconnect.php';
require_once __DIR__ . '/../lib/auth.php';
require_once __DIR__ . '/../lib/utils.php';

$db = $dbconnect;
$token = getBearerToken();
if (!$token) {
    sendJsonResponse(false, 'Unauthorized', [], 401);
    exit;
}

error_log("Received token: $token");

// 验证 JWT 令牌
$user = validateJWT($token);
if (!$user) {
    error_log("JWT validation failed");
    sendJsonResponse(false, 'Invalid token', [], 401);
    exit;
} else {
    error_log("JWT valid. User ID: {$user->sub}, Role: {$user->role}");
}
$userId = $user->sub;
$role = $user->role ?? '';
error_log("User ID: $userId, Role: $role");
logError("User ID: $userId, Role: $role");

$method = $_SERVER['REQUEST_METHOD'];
switch ($method) {
    case 'POST':
        // 发布新职位（仅企业用户）
        if ($role !== 'employer') {
            sendJsonResponse(false, 'Forbidden: Employer access only', [], 403);
            exit;
        }
        $data = json_decode(file_get_contents("php://input"), true);
        
        // 验证必填字段
        $requiredFields = [
            'title' => $data['jobTitle'], 
            'company' => $data['company'], 
            'location' => $data['location'], 
            'job_description' => $data['jobDescription'],
            'job_type' => $data['jobType']
        ];
        foreach ($requiredFields as $field => $value) {
            if (empty($value)) {
                http_response_code(400);
                die(json_encode(['error' => "Missing required field: $field"]));
            }
        }
        
        // 准备插入数据
        $stmt = $db->prepare("INSERT INTO Job 
            (employer_id, title, company, location, job_type, 
            salary_min, salary_max, currency, experience_level, department,
            reporting_to, start_date, application_deadline, job_description,
            key_responsibilities, required_qualifications, preferred_qualifications,
            benefits, skills, contact_email, contact_phone)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        
        $stmt->execute([
            $user->role_id,
            $data['jobTitle'],
            $data['company'],
            $data['location'],
            $data['jobType'],
            $data['salaryMin'] ?? null,
            $data['salaryMax'] ?? null,
            $data['currency'] ?? 'MYR',
            $data['experienceLevel'] ?? '',
            $data['department'] ?? '',
            $data['reportingTo'] ?? '',
            $data['startDate'] ?? null,
            $data['applicationDeadline'] ?? null,
            $data['jobDescription'],
            $data['keyResponsibilities'] ?? '',
            $data['requiredQualifications'] ?? '',
            $data['preferredQualifications'] ?? '',
            $data['benefits'] ?? '',
            $data['skills'] ?? '',
            $data['contactEmail'] ?? '',
            $data['contactPhone'] ?? ''
        ]);
        
        echo json_encode(['success' => true, 'job_id' => $db->lastInsertId()]);
        break;

    case 'GET':
        // 获取当前雇主的职位
        $stmt = $db->prepare("
            SELECT j.*, COUNT(a.application_id) AS applicants_count
            FROM Job j
            LEFT JOIN Application a ON j.job_id = a.job_id
            WHERE j.employer_id = :employer_id
            GROUP BY j.job_id
        ");
        $stmt->bindParam(':employer_id', $user->role_id);
        $stmt->execute();
        $jobs = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        sendJsonResponse(true, 'Jobs retrieved', $jobs);
        break;

    case 'PUT':
        if ($role !== 'employer') {
            sendJsonResponse(false, 'Forbidden: Employer access only', [], 403);
            exit;
        }
        // 处理更新请求
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

        // 使用正则表达式来匹配 URL 模式并捕获 jobId
        if (preg_match('/^\/api\/jobs\/(\d+)\/status$/', $path, $matches)) {
            $jobId = $matches[1]; 
            
            // 接下来是原有的逻辑
            if (!is_numeric($jobId)) { // 这步其实在正则匹配 (\d+) 成功后已经保证了，但再检查一次也无妨
                sendJsonResponse(false, 'Invalid job ID format', [], 400);
                exit;
            }

            // // 验证当前用户是否有权限修改此职位
            // $stmt = $db->prepare("SELECT employer_id FROM Job WHERE job_id = :job_id");
            // $stmt->bindParam(':job_id', $jobId);
            // $stmt->execute();
            // $job = $stmt->fetch(PDO::FETCH_ASSOC);
            // if (!$job) {
            //     sendJsonResponse(false, 'Job not found', [], 404);
            //     exit;
            // }
            // if ($job['employer_id'] != $user->role_id) {
            //     sendJsonResponse(false, 'Unauthorized to update this job', [], 403);
            //     exit;
            // }
            
            // 解析请求体
            $data = json_decode(file_get_contents("php://input"), true);
            $newStatus = $data['status'] ?? null;
            
            if (!in_array($newStatus, ['active', 'closed'])) {
                sendJsonResponse(false, 'Invalid status value', [], 400);
                exit;
            }
            
            // 验证当前用户是否有权限修改此职位
            $stmt = $db->prepare("SELECT employer_id FROM Job WHERE job_id = :job_id");
            $stmt->bindParam(':job_id', $jobId);
            $stmt->execute();
            $job = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$job) {
                sendJsonResponse(false, 'Job not found', [], 404);
                exit;
            }
            
            if ($job['employer_id'] != $user->role_id) {
                sendJsonResponse(false, 'Unauthorized to update this job', [], 403);
                exit;
            }
            
            // 更新职位状态
            $updateStmt = $db->prepare("UPDATE Job SET status = :status WHERE job_id = :job_id");
            $updateStmt->bindParam(':status', $newStatus);
            $updateStmt->bindParam(':job_id', $jobId);
            $updateStmt->execute();
            
            sendJsonResponse(true, 'Job status updated successfully');

        } else {
            // 如果不匹配 /api/jobs/{id}/status 模式
            sendJsonResponse(false, 'Invalid endpoint or URL format', [], 404);
        }
        break;

    case 'DELETE':
        // 权限验证：确保只有 'employer' 角色才能执行删除操作
        if ($role !== 'employer') {
            sendJsonResponse(false, 'Forbidden: Employer access only', [], 403);
            exit;
        }

        // 处理删除请求
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $jobId = null; // 初始化 jobId
        if (preg_match('/^\/api\/jobs\/(\d+)$/', $path, $matches)) {
            $jobId = $matches[1]; // 正确捕获到数字的 jobId
        }

        // 如果 jobId 没有被成功捕获，或者不是有效的数字
        if (!is_numeric($jobId)) {
            sendJsonResponse(false, 'Invalid job ID or URL format', [], 400);
            exit;
        }
        
        // // 验证当前用户是否有权限删除此职位
        // // 查询数据库以获取该职位的 employer_id
        // $stmt = $db->prepare("SELECT employer_id FROM Job WHERE job_id = :job_id");
        // $stmt->bindParam(':job_id', $jobId);
        // $stmt->execute();
        // $job = $stmt->fetch(PDO::FETCH_ASSOC);
        // // 如果职位不存在
        // if (!$job) {
        //     sendJsonResponse(false, 'Job not found', [], 404);
        //     exit;
        // }
        // // 权限检查：确认当前登录的雇主是该职位的发布者
        // // 假设 $user->role_id 存储了当前登录雇主的 ID
        // if ($job['employer_id'] != $user->role_id) {
        //     sendJsonResponse(false, 'Unauthorized to delete this job', [], 403);
        //     exit;
        // }
        
        // 执行删除职位操作
        $deleteStmt = $db->prepare("DELETE FROM Job WHERE job_id = :job_id");
        $deleteStmt->bindParam(':job_id', $jobId);
        $deleteStmt->execute();
        
        // 返回成功响应
        sendJsonResponse(true, 'Job deleted successfully');
        break;

    case 'DELETE':
        if ($role !== 'employer') {
            sendJsonResponse(false, 'Forbidden: Employer access only', [], 403);
            exit;
        }
        // 处理删除请求
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $pathParts = explode('/', $path);
        $jobId = end($pathParts);
        
        if (!is_numeric($jobId)) {
            sendJsonResponse(false, 'Invalid job ID', [], 400);
            exit;
        }
        
        // 验证当前用户是否有权限删除此职位
        $stmt = $db->prepare("SELECT employer_id FROM Job WHERE job_id = :job_id");
        $stmt->bindParam(':job_id', $jobId);
        $stmt->execute();
        $job = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$job) {
            sendJsonResponse(false, 'Job not found', [], 404);
            exit;
        }
        
        if ($job['employer_id'] != $user->role_id) {
            sendJsonResponse(false, 'Unauthorized to delete this job', [], 403);
            exit;
        }
        
        // 删除职位
        $deleteStmt = $db->prepare("DELETE FROM Job WHERE job_id = :job_id");
        $deleteStmt->bindParam(':job_id', $jobId);
        $deleteStmt->execute();
        
        sendJsonResponse(true, 'Job deleted successfully');
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
}
?>