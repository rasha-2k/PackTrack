<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once __DIR__ . '/../middlewares/authMiddleware.php';

$data = json_decode(file_get_contents("php://input"));
$page = $data->page ?? '';
$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? '';

$authMiddleware = new AuthMiddleware();



try {
    switch ($page) {
        case 'admin-panel':
            $authMiddleware->checkRole('admin');
            echo json_encode(['access' => true]);
            break;
            
        case 'dashboard':
            $authMiddleware->checkRole('user');
            echo json_encode(['access' => true]);
            break;
            
        default:
            http_response_code(400);
            echo json_encode(['error' => 'Invalid page specified']);
    }
} catch (Exception $e) {
    http_response_code(403);
    echo json_encode(['error' => 'Forbidden access: '. $e->getMessage()]);
}
