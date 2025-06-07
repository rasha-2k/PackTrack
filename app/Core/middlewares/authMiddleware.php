<?php
require_once __DIR__ . '/../jwt/JwtHandler.php';
require_once __DIR__ . '/../../auth/TokenValidator.php';
class AuthMiddleware
{
    private $tokenValidator;

    public function __construct()
    {
        $this->tokenValidator = new TokenValidator();
    }

    public function checkRole($requiredRole)
    {
        try {
            $headers = getallheaders();
            if (!isset($headers['Authorization'])) {
                error_log('No Authorization header found');
                http_response_code(401);
                echo json_encode(['error' => 'No authorization token provided']);
                exit;
            }

            $tokenValidation = $this->tokenValidator->validateToken($headers);

            if (!$tokenValidation['status']) {
                error_log('Token validation failed: ' . $tokenValidation['message']);
                http_response_code($tokenValidation['code']);
                echo json_encode(['error' => $tokenValidation['message']]);
                exit;
            }

            $user = $tokenValidation['user'];
            $userRole = $user->data->role ?? '';
            
            if ($requiredRole === 'admin' && $userRole !== 'admin') {
                error_log('Access denied: User role ' . $userRole . ' attempted admin access');
                sendError('Access denied. Admin privileges required.', 403);
            }
            
            if ($requiredRole === 'user' && !in_array($userRole, ['user', 'admin'])) {
                error_log('Access denied: User role ' . $userRole . ' attempted user access');
                sendError('Access denied. User privileges required.', 403);
            }

            return $user;
        } catch (Exception $e) {
            error_log('Authentication error: ' . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Internal server error during authentication']);
            exit;
        }
    }
}
