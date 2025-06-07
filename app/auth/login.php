<?php
require_once __DIR__ . '/../connection/db-conn.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../Core/jwt/JwtHandler.php';

use Jwt\JwtHandler;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!$data) {
        throw new Exception("Invalid request data");
    }

    $email = $data['email'] ?? '';
    $role = $data['role'] ?? 'user';
    $password = $data['password'] ?? '';

    if (!$email || !$password) {
        sendError("Email and password are required", 400);
    }

    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? AND role = ?");
    $stmt->execute([$email, $role]);

    if ($stmt->rowCount() === 0) {
        sendError("Invalid email or password", 401);
    }

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!password_verify($password, $user['password'])) {
        sendError("Invalid email or password", 401);
    }

    $jwtHandler = new JwtHandler();
    $token = $jwtHandler->generate($user['id'], [
        "name" => $user['name'],
        "email" => $user['email'],
        "role" => $user['role']
    ]);

    // Log user login
    $logStmt = $pdo->prepare("INSERT INTO user_activity_logs (user_id, action) VALUES (?, ?)");
    $logStmt->execute([$user['id'], 'login']);

    echo json_encode([
        "success" => true,
        "message" => "Login successful",
        "token" => $token,
        "user" => [
            "id" => $user['id'],
            "name" => $user['name'],
            "email" => $user['email'],
            "role" => $user['role']
        ]
    ]);

} catch (Exception $e) {
    error_log("Login error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "An error occurred during login.",
        "error" => $e->getMessage()
    ]);
}

?>