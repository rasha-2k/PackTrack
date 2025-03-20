<?php
header("Content-Type: application/json");

require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../jwt/JwtHandler.php';

use Jwt\JwtHandler;

// Get Authorization header
$headers = apache_request_headers();
if (!isset($headers['Authorization'])) {
    sendError("Authorization token is missing", 401);
}

// Extract token from Authorization header
$jwt = str_replace('Bearer ', '', $headers['Authorization']);

// Decode the token using instance method
$jwtHandler = new JwtHandler();
$user = $jwtHandler->decode($jwt);

if (!$user) {
    sendError("Invalid or expired token", 401);
}

// Now you have access to the user data (e.g., $user->sub is the user ID)
echo json_encode([
    "success" => true,
    "message" => "You are authenticated",
    "user_id" => $user->sub
]);
