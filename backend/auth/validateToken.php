<?php
require_once __DIR__ . '../vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? '';

if (strpos($authHeader, "Bearer ") === 0) {
    $token = str_replace("Bearer ", "", $authHeader);
    $secret_key = "your_super_secret_key";

    try {
        $decoded = JWT::decode($token, new Key($secret_key, 'HS256'));
        echo json_encode([
            "status" => 1,
            "message" => "Token valid",
            "user" => $decoded->data
        ]);
    } catch (Exception $e) {
        echo json_encode(["status" => 0, "message" => "Token invalid", "error" => $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => 0, "message" => "Authorization header missing"]);
}
