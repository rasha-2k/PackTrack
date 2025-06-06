<?php
header('Content-Type: application/json');

require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../../');
$dotenv->load();

$host = $_ENV['DB_HOST'] ?? '';
$db   = $_ENV['DB_NAME'] ?? '';
$user = $_ENV['DB_USER'] ?? '';
$pass = $_ENV['DB_PASS'] ?? '';
$port = $_ENV['DB_PORT'] ?? '3306'; //! docker: 3306, local: 3308
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;port=$port;dbname=$db;charset=$charset";

try {
    $pdo = new PDO($dsn, $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // echo json_encode(["success" => true, "message" => "Connected to the database!"]);
} catch (PDOException $e) {
    // sendError("Database connection failed: " . $e->getMessage(), 500);
    header('Location: /PackTrack/public/views/errors/500.html');
    exit();
}
