<?php
require_once __DIR__ . '/../connection/db-conn.php';
require_once __DIR__ . '/../jwt/JwtHandler.php';
require_once __DIR__ . '/../helpers/response.php';

use Jwt\JwtHandler;

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Parse JWT from Authorization header
$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? '';

if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    sendError("Unauthorized: Missing or invalid token", 401);
    exit;
}

$jwt = new JwtHandler();
$decoded = $jwt->decode($matches[1]);

if (!$decoded || !isset($decoded->sub) || !isset($decoded->data)) {
    sendError("Invalid or expired token", 401);
    exit;
}

$userData = $decoded->data ?? null;
$userId = $decoded->sub;

if (!$userId && isset($userData->id)) {
    $userId = $userData->id;
}

$data = json_decode(file_get_contents('php://input'), true);
if (!$data) {
    sendError("Invalid JSON payload", 400);
    exit;
}

$courier_service = !empty($data['courier_service']) ? $data['courier_service'] : null;
$origin = !empty($data['origin']) ? $data['origin'] : null;
$destination = !empty($data['destination']) ? $data['destination'] : null;
$status = !empty($data['status']) ? $data['status'] : null;
$delivered_at = !empty($data['delivered_at']) ? $data['delivered_at'] : null;
$expected_delivery_date = !empty($data['expected_delivery_date']) ? $data['expected_delivery_date'] : null;
$received_at = !empty($data['received_at']) ? $data['received_at'] : null;
$category = !empty($data['category']) ? $data['category'] : null;

$required = ['courier_service', 'origin', 'destination', 'status'];
foreach ($required as $field) {
    if (empty($data[$field])) {
        sendError("Missing or empty field: $field", 422);
        exit;
    }
}

// Generate unique tracking number
function generateTrackingNumber($pdo)
{
    do {
        $tracking = 'TRK' . mt_rand(100000000, 999999999);
        $stmt = $pdo->prepare("SELECT id FROM deliveries WHERE tracking_number = ?");
        $stmt->execute([$tracking]);
        $result = $stmt->fetch();
    } while ($result);
    return $tracking;
}

$tracking_number = generateTrackingNumber($pdo);

// Insert the delivery into the database
$stmt = $pdo->prepare("
    INSERT INTO deliveries (
        user_id, tracking_number, courier_service, origin, destination, status, 
        delivered_at, expected_delivery_date, received_at, category, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
");

if ($stmt->execute([
    $userId,
    $tracking_number,
    $courier_service,
    $origin,
    $destination,
    $status,
    $delivered_at,
    $expected_delivery_date,
    $received_at,
    $category
])) {

    $mode = $_GET['range'] ?? 'month';

    switch ($mode) {
        case 'week':
            $sql = "
            SELECT 
                combined_label AS label,
                SUM(CASE WHEN type = 'received' THEN count ELSE 0 END) AS received,
                SUM(CASE WHEN type = 'delivered' THEN count ELSE 0 END) AS delivered
            FROM (
                SELECT 
                    'delivered' as type, 
                    CONCAT('Week ', CASE 
                        WHEN WEEK(delivered_at, 1) BETWEEN 1 AND 13 THEN '1-13' 
                        WHEN WEEK(delivered_at, 1) BETWEEN 14 AND 26 THEN '14-26' 
                        WHEN WEEK(delivered_at, 1) BETWEEN 27 AND 39 THEN '27-39' 
                        ELSE '40-53' 
                    END) AS combined_label,
                    WEEK(delivered_at, 1) AS week_num,
                    COUNT(*) as count
                FROM deliveries 
                WHERE delivered_at IS NOT NULL AND status = 'Delivered'
                GROUP BY combined_label, week_num
                
                UNION ALL
                
                SELECT 
                    'received' as type, 
                    CONCAT('Week ', CASE 
                        WHEN WEEK(received_at, 1) BETWEEN 1 AND 13 THEN '1-13' 
                        WHEN WEEK(received_at, 1) BETWEEN 14 AND 26 THEN '14-26' 
                        WHEN WEEK(received_at, 1) BETWEEN 27 AND 39 THEN '27-39' 
                        ELSE '40-53' 
                    END) AS combined_label,
                    WEEK(received_at, 1) AS week_num,
                    COUNT(*) as count
                FROM deliveries 
                WHERE received_at IS NOT NULL AND status = 'Received'
                GROUP BY combined_label, week_num
            ) as combined_data
            GROUP BY combined_label
            ORDER BY MIN(week_num);
            ";
            break;

        case 'year':
            $sql = "
            SELECT 
                year AS label,
                SUM(CASE WHEN type = 'received' THEN count ELSE 0 END) AS received,
                SUM(CASE WHEN type = 'delivered' THEN count ELSE 0 END) AS delivered
            FROM (
                SELECT 'delivered' as type, YEAR(delivered_at) as year, COUNT(*) as count
                FROM deliveries 
                WHERE delivered_at IS NOT NULL 
                AND YEAR(delivered_at) BETWEEN 2021 AND 2024
                AND status = 'Delivered'
                GROUP BY YEAR(delivered_at)
                
                UNION ALL
                
                SELECT 'received' as type, YEAR(received_at) as year, COUNT(*) as count
                FROM deliveries 
                WHERE received_at IS NOT NULL 
                AND YEAR(received_at) BETWEEN 2021 AND 2024
                AND status = 'Received'
                GROUP BY YEAR(received_at)
            ) as combined_data
            GROUP BY year
            ORDER BY year;
            ";
            break;

        default:
            $sql = "
                SELECT
                    month_num,
                    month_label AS label,
                    SUM(CASE WHEN type = 'received' THEN count ELSE 0 END) AS received,
                    SUM(CASE WHEN type = 'delivered' THEN count ELSE 0 END) AS delivered
                FROM (
                    SELECT 
                        'delivered' as type, 
                        MONTH(delivered_at) as month_num, 
                        DATE_FORMAT(delivered_at, '%b') as month_label,
                        COUNT(*) as count
                    FROM deliveries 
                    WHERE delivered_at IS NOT NULL AND status = 'Delivered'
                    GROUP BY MONTH(delivered_at), month_label
                    
                    UNION ALL
                    
                    SELECT 
                        'received' as type, 
                        MONTH(received_at) as month_num, 
                        DATE_FORMAT(received_at, '%b') as month_label,
                        COUNT(*) as count
                    FROM deliveries 
                    WHERE received_at IS NOT NULL AND status = 'Received'
                    GROUP BY MONTH(received_at), month_label
                ) as combined_data
                GROUP BY month_num, month_label
                ORDER BY month_num;
            ";
            break;
    }

    $activityChartData = $pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC);

    $sql = "
    SELECT status, COUNT(*) as count
    FROM deliveries
    GROUP BY status
    ORDER BY FIELD(status,'Pending', 'Delivered', 'Received', 'Delayed', 'Cancelled')
    ";

    $statusChartData = $pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC);


    echo json_encode([
        'success' => true,
        'tracking_number' => $tracking_number,
        'charts' => [
            'activity' => $activityChartData,
            'status' => $statusChartData,
        ]
    ]);
} else {
    sendError("Database error", 500);
}
