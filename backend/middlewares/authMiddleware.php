<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../jwt/JwtHandler.php';
use Jwt\JwtHandler;

function validateToken($token) {
    if (!$token) return false;
    $jwt = new JwtHandler();
    $decoded = $jwt->decode($token);
    return $decoded ?? false;
}

// 1. Get the Authorization header
$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? '';

// 2. Check if Bearer token exists
if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
    sendError("Unauthorized: Missing token", 401);
}

// 3. Extract token from header
$token = trim(str_replace('Bearer', '', $authHeader));

// 4. Decode the token
$jwt = new JwtHandler();
$decoded = $jwt->decode($token);

// 5. Check if token is valid
if (!$decoded || !isset($decoded['data']) || !isset($decoded['data']->id)) {
    sendError("Unauthorized: Invalid or expired token", 401);
}

// 6. Make user data available in this file
$authUser = [
    'id'    => $decoded['data']->id,
    'name'  => $decoded['data']->name ?? '',
    'email' => $decoded['data']->email ?? '',
    'role'  => $decoded['data']->role ?? ''
];

?>