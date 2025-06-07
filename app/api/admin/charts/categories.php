<?php
header("Content-Type: application/json");
require_once __DIR__."/../../../connection/db-conn.php";

try {
    $mode = $_GET['range'] ?? 'month';

    switch ($mode) {
        case 'week':
            $sql = "
                SELECT 
                    category,
                    COUNT(*) as count
                FROM deliveries
                WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 WEEK)
                GROUP BY category
                ORDER BY count DESC
            ";
            break;

        case 'year':
            $sql = "
                SELECT 
                    category,
                    COUNT(*) as count
                FROM deliveries
                WHERE created_at >= DATE_SUB(NOW(), INTERVAL 3 YEAR)
                GROUP BY category
                ORDER BY count DESC
            ";
            break;

        default: // month
            $sql = "
                SELECT 
                    category,
                    COUNT(*) as count
                FROM deliveries
                WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
                GROUP BY category
                ORDER BY count DESC
            ";
            break;
    }

    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Format the data for the chart
    $formattedData = [
        'labels' => [],
        'counts' => []
    ];

    foreach ($results as $row) {
        $formattedData['labels'][] = $row['category'];
        $formattedData['counts'][] = (int)$row['count'];
    }

    echo json_encode(['data' => $formattedData]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to fetch category data: " . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "An error occurred: " . $e->getMessage()]);
}
