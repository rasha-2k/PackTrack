<?php
require_once __DIR__ . '/../jwt/jwtHandler.php';

use Jwt\JwtHandler;

class AuthMiddleware
{
    public function checkRole($requiredRole)
    {
        $headers = array_change_key_case(getallheaders(), CASE_LOWER);

        if (!isset($headers['authorization'])) {
            http_response_code(401);
            echo json_encode(['error' => 'No token provided']);
            exit;
        }

        $token = trim(str_replace('Bearer', '', $headers['authorization']));

        if (empty($token)) {
            http_response_code(401);
            echo json_encode(['error' => 'Empty token provided']);
            exit;
        }
        try {
            $jwt = new JwtHandler();
            $decoded = $jwt->decode($token);

            $userRole = $decoded->data->role ?? '';

            if ($requiredRole === 'admin' && $userRole !== 'admin') {
                http_response_code(403);
                echo json_encode(['error' => 'Access denied. Admin privileges required.']);
                exit;
            }

            if ($requiredRole === 'user' && !in_array($userRole, ['user', 'admin'])) {
                http_response_code(403);
                echo json_encode(['error' => 'Access denied. User privileges required.']);
                exit;
            }

            echo json_encode(['access' => true]);
            exit;
        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid token: ' . $e->getMessage()]);
            exit;
        }
    }
}
