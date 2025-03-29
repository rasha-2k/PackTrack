<?php
header("Content-Type: application/json");

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../jwt/JwtHandler.php';
require_once __DIR__ . '../middlewares/authMiddleware.php';

use Dotenv\Dotenv;
use Jwt\JwtHandler;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../../');
$dotenv->load();


if (!isset($_ENV['JWT_SECRET']) || empty($_ENV['JWT_SECRET'])) {
    sendError("JWT secret key is not set in the environment!", 500);
}


$headers = apache_request_headers();
if (!isset($headers['Authorization'])) {
    sendError("Authorization token is missing", 401);
}

$jwt = str_replace('Bearer ', '', $headers['Authorization']);

$jwtHandler = new JwtHandler();
try {
    $user = $jwtHandler->decode($jwt);
} catch (Exception $e) {
    sendError("Invalid or expired token: " . $e->getMessage(), 401);
}

if (!$user) {
    sendError("Invalid or expired token", 401);
}

sendSuccess("You are authenticated", ["user_id" => $user->sub]);
