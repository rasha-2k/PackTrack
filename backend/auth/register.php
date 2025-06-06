<?php
header("Content-Type: application/json");


header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../connection/db-conn.php';
require_once __DIR__ . '/../jwt/JwtHandler.php';


use Dotenv\Dotenv;
use Jwt\JwtHandler;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../../');
$dotenv->load();

try {
    $data = json_decode(file_get_contents("php://input"), true);
    $name = trim($data["name"] ?? '');
    $email = trim($data["email"] ?? '');
    $password = trim($data["password"] ?? '');
    $role = trim($data['role'] ?? 'user');
    $adminSecret = trim($data['adminSecret'] ?? '');

    if ($role === 'admin') {
        if (!$adminSecret || $adminSecret !== $_ENV['ADMIN_SECRET']) {
            sendError("Invalid admin secret key", 403);
            exit;
        }
    }

    if (!$name || !$email || !$password) {
        sendError("All fields are required", 400);
        exit;
    }

    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->rowCount() > 0) {
        sendError("Email already registered", 409);
        exit;
    }

    $stmt = $pdo->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)");
    if ($stmt->execute([$name, $email, $hashedPassword, $role])) {

        $userId = $pdo->lastInsertId();
        $stmt = $pdo->prepare("SELECT id, name, email, role FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        $jwt = new JwtHandler();

        $userId = $pdo->lastInsertId();
        $token = $jwt->generate($userId, [
            'name' => $user['name'],
            'email' => $user['email'],
            'role' => $user['role']
        ]);

        // Log user registration
        $logStmt = $pdo->prepare("INSERT INTO user_activity_logs (user_id, action) VALUES (?, ?)");
        $logStmt->execute([$user['id'], 'register']);

        echo json_encode([
            'success' => true,
            'message' => 'User registered successfully',
            'token' => $token,
            'user' => [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'role' => $user['role']
            ]
        ]);
    } else {
        // sendError("Registration failed", 500);
        header('Location: /PackTrack/public/views/errors/500.html');
        exit();
    }
} catch (PDOException $e) {
    // sendError("Database error: " . $e->getMessage(), 500);
    header('Location: /PackTrack/public/views/errors/500.html');
    exit();
} catch (Exception $e) {
    // sendError("Server error: " . $e->getMessage(), 500);
    header('Location: /PackTrack/public/views/errors/500.html');
    exit();
}
