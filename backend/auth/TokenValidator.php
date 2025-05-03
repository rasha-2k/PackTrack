<?php
require_once __DIR__ . '/../jwt/jwtHandler.php';
use Jwt\JwtHandler;
class TokenValidator
{
    private $jwtHandler;

    public function __construct()
    {
        $this->jwtHandler = new JwtHandler();
    }

    public function validateToken($headers)
    {
        if (!isset($headers['Authorization'])) {
            return ['status' => false, 'message' => 'Authorization token is missing', 'code' => 401];
        }

        $jwt = str_replace('Bearer ', '', $headers['Authorization']);

        try {
            $user = $this->jwtHandler->decode($jwt);
            return ['status' => true, 'user' => $user];
        } catch (Exception $e) {
            return ['status' => false, 'message' => 'Invalid or expired token: ' . $e->getMessage(), 'code' => 401];
        }
    }
}
