<?php
// server/api/jobs.php
header("Content-Type: application/json");
require_once __DIR__ . '/../config/databaseconnect.php';
require_once __DIR__ . '/../lib/auth.php';
require_once __DIR__ . '/../lib/utils.php'; 

$db = databaseconnect();
$method = $_SERVER['REQUEST_METHOD'];
$token = getBearerToken();

// 验证 JWT 令牌
$user = validateJWT($token);
if (!$user) {
    http_response_code(401);
    die(json_encode(['error' => 'Unauthorized']));
}

switch ($method) {
    case 'GET':
        // 搜索职位
        $keyword = $_GET['q'] ?? '';
        $location = $_GET['location'] ?? '';
        $min_salary = $_GET['min_salary'] ?? 0;

        $sql = "SELECT * FROM Job 
                WHERE title LIKE :keyword 
                AND location LIKE :location 
                AND (SUBSTRING_INDEX(salary_range, '-', 1) >= :min_salary)";

        $stmt = $db->prepare($sql);
        $stmt->execute([
            ':keyword' => "%$keyword%",
            ':location' => "%$location%",
            ':min_salary' => $min_salary
        ]);
        $jobs = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($jobs);
        break;

    case 'POST':
        // 发布新职位（仅企业用户）
        if ($user['role'] !== 'employer') {
            http_response_code(403);
            die(json_encode(['error' => 'Forbidden']));
        }

        $data = json_decode(file_get_contents("php://input"), true);
        $stmt = $db->prepare("INSERT INTO Job 
            (employer_id, title, description, salary_range, location) 
            VALUES (?, ?, ?, ?, ?)");

        $stmt->execute([
            $user['employer_id'],
            $data['title'],
            $data['description'],
            $data['salary_range'],
            $data['location']
        ]);
        echo json_encode(['job_id' => $db->lastInsertId()]);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
}
?>