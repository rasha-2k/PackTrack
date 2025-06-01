<?php
require_once __DIR__ . '/../connection/db-conn.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../jwt/JwtHandler.php';

header("Content-Type: application/json");

use Jwt\JwtHandler;

try {
    $headers = getallheaders();
    if (!isset($headers['Authorization'])) {
        echo json_encode(["success" => false, "message" => "No Authorization header."]);
        exit;
    }

    $authHeader = $headers['Authorization'];
    list($token) = sscanf($authHeader, 'Bearer %s');

    if (!$token) {
        echo json_encode(["success" => false, "message" => "Malformed Authorization header."]);
        exit;
    }

    $jwtHandler = new JwtHandler();
    $decoded = $jwtHandler->decode($token);

    if (!isset($decoded->sub)) {
        echo json_encode(["success" => false, "message" => "Invalid token payload."]);
        exit;
    }
    $userId = $decoded->sub;

    $stmt = $pdo->prepare("INSERT INTO user_activity_logs (user_id, action) VALUES (?, ?)");
    $stmt->execute([$userId, 'logout']);

    echo json_encode(["success" => true, "message" => "Logged out successfully."]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Logout failed.", "error" => $e->getMessage()]);
}
