<?php
require_once __DIR__ . '/../jwt/jwtHandler.php';

require_once __DIR__ . '/../auth/validateToken.php';
class AuthMiddleware
{
    private $tokenValidator;

    public function __construct()
    {
        $this->tokenValidator = new TokenValidator();
    }

    public function checkRole($requiredRole)
    {
        $headers = getallheaders();
        $tokenValidation = $this->tokenValidator->validateToken($headers);

        if (!$tokenValidation['status']) {
            http_response_code($tokenValidation['code']);
            echo json_encode(['error' => $tokenValidation['message']]);
            exit;
        }

        $user = $tokenValidation['user'];
        $userRole = $user->data->role ?? '';
        if ($requiredRole === 'admin' && $userRole !== 'admin') {
            sendError('Access denied. Admin privileges required.', 403);
        
        }
        
        if ($requiredRole === 'user' && !in_array($userRole, ['user', 'admin'])) {
            sendError('Access denied. User privileges required.', 403);
        }

        return $user;
    }
}
