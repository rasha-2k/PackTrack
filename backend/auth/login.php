<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../connection/db-conn.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../jwt/JwtHandler.php';

use Jwt\JwtHandler;
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../../');
$dotenv->load();


$data = json_decode(file_get_contents("php://input"), true);
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
