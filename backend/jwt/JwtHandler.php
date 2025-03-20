<?php
namespace Jwt;
header('Content-Type: application/json');
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../helpers/response.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Dotenv\Dotenv;
use \Exception;

$dotenv = Dotenv::createImmutable(__DIR__.'/../../');
$dotenv->load();

class JwtHandler {

    private static $secretKey;
    public function __construct() {

            self::$secretKey = $_ENV['JWT_SECRET'] ?? null;
    
            if (empty(self::$secretKey)) {
                sendError("JWT secret key not set in .env", 500);
            }
    }
    


    public static function generate($userId) {
        $issuedAt = time();
        $expirationTime = $issuedAt + 3600;  // jwt valid for 1 hour from the issued time
        $payload = [
            'iat' => $issuedAt,
            'exp' => $expirationTime,
            'sub' => $userId 
        ];

        return JWT::encode($payload, self::$secretKey, 'HS256');
    }

    public function encode($payload)
    {
        return JWT::encode($payload, self::$secretKey, 'HS256');
    }

    public function decode($token)
    {
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
