<?php
header("Content-Type: application/json");

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '../../middlewares/authMiddleware.php';

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../../');
$dotenv->load();


if (!isset($_ENV['JWT_SECRET']) || empty($_ENV['JWT_SECRET'])) {
    header('Location: /PackTrack/frontend/views/errors/500.html');
    exit();
}

$authMiddleware = new AuthMiddleware();
$user = $authMiddleware->checkRole('admin');

sendSuccess("You are authenticated", ["user_id" => $user->sub]);
