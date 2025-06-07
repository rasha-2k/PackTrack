<?php
header("Content-Type: application/json");
require_once __DIR__ . "/../../../connection/db-conn.php";

try {
    $sql = "SELECT 
            SUM(CASE WHEN status = 'Received' THEN 1 ELSE 0 END) as received,
            SUM(CASE WHEN status = 'Delivered' THEN 1 ELSE 0 END) as delivered,
            SUM(CASE WHEN status = 'Delayed' THEN 1 ELSE 0 END) as `delayed_count`,
            SUM(CASE WHEN status = 'Cancelled' THEN 1 ELSE 0 END) as cancelled
        FROM deliveries";

    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $results = $stmt->fetch(PDO::FETCH_ASSOC);
    $formattedData = [
        'received' => (int)$results['received'],
        'delivered' => (int)$results['delivered'],
        'delayed' => (int)$results['delayed_count'],
        'cancelled' => (int)$results['cancelled']
    ];

    echo json_encode(['data' => $formattedData]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to fetch status data: " . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "An error occurred: " . $e->getMessage()]);
}
