<?php
header("Content-Type: application/json");
require_once __DIR__ . "/../../../connection/db-conn.php";

try {
    $mode = $_GET['range'] ?? 'month';

    switch ($mode) {
        case 'week':
            $sql = "SELECT 
                    CONCAT('Week ', WEEK(updated_at, 1)) as label,
                    SUM(CASE WHEN status = 'Received' THEN 1 ELSE 0 END) as received,
                    SUM(CASE WHEN status = 'Delivered' THEN 1 ELSE 0 END) as delivered,
                    SUM(CASE WHEN status = 'Delayed' THEN 1 ELSE 0 END) as `delayed_count`,
                    SUM(CASE WHEN status = 'Cancelled' THEN 1 ELSE 0 END) as cancelled
                FROM deliveries
                WHERE updated_at >= DATE_SUB(NOW(), INTERVAL 12 WEEK)
                GROUP BY WEEK(updated_at, 1)
                ORDER BY WEEK(updated_at, 1)
            ";
            break;

        case 'year':
            $sql = "SELECT                    
                    YEAR(updated_at) as label,
                    SUM(CASE WHEN status = 'Received' THEN 1 ELSE 0 END) as received,
                    SUM(CASE WHEN status = 'Delivered' THEN 1 ELSE 0 END) as delivered,
                    SUM(CASE WHEN status = 'Delayed' THEN 1 ELSE 0 END) as `delayed_count`,
                    SUM(CASE WHEN status = 'Cancelled' THEN 1 ELSE 0 END) as cancelled
                FROM deliveries
                WHERE updated_at >= DATE_SUB(NOW(), INTERVAL 3 YEAR)
                GROUP BY YEAR(updated_at)
                ORDER BY YEAR(updated_at)
            ";
            break;

        default: // month
            $sql = "SELECT 
                    DATE_FORMAT(updated_at, '%Y-%m') as label,
                    SUM(CASE WHEN status = 'Received' THEN 1 ELSE 0 END) as received,
                    SUM(CASE WHEN status = 'Delivered' THEN 1 ELSE 0 END) as delivered,
                    SUM(CASE WHEN status = 'Delayed' THEN 1 ELSE 0 END) as `delayed_count`,
                    SUM(CASE WHEN status = 'Cancelled' THEN 1 ELSE 0 END) as cancelled
                FROM deliveries
                WHERE updated_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
                GROUP BY DATE_FORMAT(updated_at, '%Y-%m')
                ORDER BY DATE_FORMAT(updated_at, '%Y-%m')
            ";
            break;
    }

    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Format the data for the chart
    $formattedData = [
        'labels' => [],
        'received' => [],
        'delivered' => [],
        'delayed' => [],
        'cancelled' => []
    ];

    foreach ($results as $row) {
        $formattedData['labels'][] = $row['label'];
        $formattedData['received'][] = (int)$row['received'];
        $formattedData['delivered'][] = (int)$row['delivered'];
        $formattedData['delayed'][] = (int)$row['delayed_count'];
        $formattedData['cancelled'][] = (int)$row['cancelled'];
    }

    echo json_encode(['data' => $formattedData]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to fetch status by time data: " . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "An error occurred: " . $e->getMessage()]);
}
