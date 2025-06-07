<?php
header("Content-Type: application/json");
require_once __DIR__."/../../../connection/db-conn.php";

try {
    $mode = $_GET['range'] ?? 'month';

    switch ($mode) {
        // case 'week':
        //     $sql = "SELECT 
        //             WEEK(created_at, 1) as week_num,
        //             MIN(CONCAT('Week ', WEEK(created_at, 1))) as label,
        //             COUNT(*) as total_packages,
        //             SUM(CASE WHEN status = 'Delivered' THEN 1 ELSE 0 END) as delivered,
        //             SUM(CASE WHEN status = 'Received' THEN 1 ELSE 0 END) as received,
        //             SUM(CASE WHEN status = 'Delayed' THEN 1 ELSE 0 END) as `delayed_count`
        //         FROM deliveries
        //         WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 WEEK)
        //         GROUP BY week_num
        //         ORDER BY week_num";
        //     break;

        case 'year':
            $sql = "SELECT 
                    YEAR(created_at) as year_num,
                    MIN(YEAR(created_at)) as label,
                    COUNT(*) as total_packages,
                    SUM(CASE WHEN status = 'Delivered' THEN 1 ELSE 0 END) as delivered,
                    SUM(CASE WHEN status = 'Received' THEN 1 ELSE 0 END) as received,
                    SUM(CASE WHEN status = 'Delayed' THEN 1 ELSE 0 END) as `delayed_count`
                FROM deliveries
                WHERE created_at >= DATE_SUB(NOW(), INTERVAL 3 YEAR)
                GROUP BY year_num
                ORDER BY year_num";
            break;

        default: // month
            $sql = "SELECT 
                    DATE_FORMAT(created_at, '%Y-%m') as month_date,
                    MIN(DATE_FORMAT(created_at, '%b')) as label,
                    COUNT(*) as total_packages,
                    SUM(CASE WHEN status = 'Delivered' THEN 1 ELSE 0 END) as delivered,
                    SUM(CASE WHEN status = 'Received' THEN 1 ELSE 0 END) as received,
                    SUM(CASE WHEN status = 'Delayed' THEN 1 ELSE 0 END) as `delayed_count`
                FROM deliveries
                WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
                GROUP BY month_date
                ORDER BY MIN(DATE_FORMAT(created_at, '%m'));";
            break;
    }

    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Format the data for the chart
    $formattedData = [
        'labels' => [],
        'total' => [],
        'delivered' => [],
        'received' => [],
        'delayed' => []
    ];

    foreach ($results as $row) {
        $formattedData['labels'][] = $row['label'];
        $formattedData['total'][] = (int)$row['total_packages'];
        $formattedData['delivered'][] = (int)$row['delivered'];
        $formattedData['received'][] = (int)$row['received'];
        $formattedData['delayed'][] = (int)$row['delayed_count'];
    }

    echo json_encode(['data' => $formattedData]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to fetch trend data: " . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "An error occurred: " . $e->getMessage()]);
}
