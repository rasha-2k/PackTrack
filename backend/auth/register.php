<?php
header("Content-Type: application/json");

require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../db/db.php';

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../../');
$dotenv->load();

$data = json_decode(file_get_contents("php://input"), true);
$name = trim($data["name"] ?? '');
$email = trim($data["email"] ?? '');
$password = trim($data["password"] ?? '');
$role = trim($data['role'] ?? 'user');
$adminSecret = trim($data['adminSecret'] ?? '');

if ($role === 'admin') {
    if (!$adminSecret || $adminSecret !== $_ENV['ADMIN_SECRET']) {
        sendError("Invalid admin secret key", 403);
    }
}


if (!$name || !$email || !$password) {
    sendError("All fields are required", 400);
}

$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

try {
    // Check if user exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->rowCount() > 0) {
        sendError("Email already registered", 409);
    }

    // Register user
    $stmt = $pdo->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)");

    if ($stmt->execute([$name, $email, $hashedPassword, $role])) {
        sendSuccess("User registered successfully");
    } else {
        sendError("Something went wrong", 500);
    }

} catch (PDOException $e) {
    sendError("Database error: " . $e->getMessage(), 500);
}
?>
