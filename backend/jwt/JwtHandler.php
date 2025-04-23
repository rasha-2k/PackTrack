<?php

namespace Jwt;

header('Content-Type: application/json');
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../helpers/response.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Dotenv\Dotenv;
use \Exception;

class JwtHandler
{
    private static $secretKey;

    public function __construct()
    {
        if (!isset($_ENV['JWT_SECRET'])) {
            $dotenv = Dotenv::createImmutable(__DIR__ . '/../../');
            $dotenv->load();
        }

        self::$secretKey = $_ENV['JWT_SECRET'] ?? null;

        if (empty(self::$secretKey)) {
            // sendError("JWT secret key not set in .env", 500);
            header('Location: /PackTrack/frontend/views/errors/500.html');
            exit();
        }
    }

    public static function generate($userId, $userData = [])
    {
        if (!isset(self::$secretKey)) {
            (new self());
        }

        $issuedAt = time();
        $expirationTime = $issuedAt + 604800; // token valid for 7 days
        $payload = [
            'iat' => $issuedAt,
            'exp' => $expirationTime,
            'sub' => $userId,
            'data' => $userData
        ];

        return JWT::encode($payload, self::$secretKey, 'HS256');
    }

    public function encode($payload)
    {
        return JWT::encode($payload, self::$secretKey, 'HS256');
    }

    public function decode($token)
    {
        if (!isset(self::$secretKey)) {
            (new self());
        }

        try {
            return JWT::decode($token, new Key(self::$secretKey, 'HS256'));
        } catch (\Firebase\JWT\ExpiredException $e) {
            sendError("Token has expired: " . $e->getMessage(), 401);
        } catch (\Firebase\JWT\SignatureInvalidException $e) {
            sendError("Invalid token signature: " . $e->getMessage(), 401);
        } catch (\Exception $e) {
            sendError("Token decoding failed: " . $e->getMessage(), 401);
        }
    }
}
