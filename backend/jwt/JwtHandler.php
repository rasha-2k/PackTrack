<?php
namespace Jwt;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;


class JwtHandler {

    // Secret key for encoding and decoding JWT
    private static $secretKey = 'YOUR_SECRET_KEY';  // Change this to a strong secret

    public static function generate($userId) {
        $issuedAt = time();
        $expirationTime = $issuedAt + 3600;  // jwt valid for 1 hour from the issued time
        $payload = [
            'iat' => $issuedAt,
            'exp' => $expirationTime,
            'sub' => $userId  // The user's ID is the subject
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
    } catch (\Exception $e) {
        throw new \Exception("Token decoding failed: " . $e->getMessage());
    }
}
}
