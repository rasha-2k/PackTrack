<?php
header("Content-Type: application/json");

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '../../Core/middlewares/authMiddleware.php';

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../../');
$dotenv->load();

if (!isset($_ENV['JWT_SECRET']) || empty($_ENV['JWT_SECRET'])) {
    http_response_code(500);
    echo json_encode(['error' => 'Server configuration error: JWT_SECRET not set']);
    header('Location: public/views/errors/500.html');
    exit();
}

$authMiddleware = new AuthMiddleware();
$user = $authMiddleware->checkRole('admin');

sendSuccess("You are authenticated", ["user_id" => $user->sub]);
