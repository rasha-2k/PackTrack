<?php
header("Content-Type: application/json");
require_once __DIR__ . "/../../../connection/db-conn.php";

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
            ORDER BY MIN(week_num)
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
                AND YEAR(delivered_at) IS NOT NULL
                AND status = 'Delivered'
                GROUP BY YEAR(delivered_at)
                
                UNION ALL
                
                SELECT 'received' as type, YEAR(received_at) as year, COUNT(*) as count
                FROM deliveries 
                WHERE received_at IS NOT NULL 
                AND YEAR(received_at) IS NOT NULL
                AND status = 'Received'
                GROUP BY YEAR(received_at)
            ) as combined_data
            GROUP BY year
            ORDER BY year;
        ";
        break;

    default:
        $sql = "
        select
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

try {
    $stmt = $pdo->query($sql);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($results as &$row) {
        $row['received'] = (int)$row['received'];
        $row['delivered'] = (int)$row['delivered'];
    }
    unset($row);

    echo json_encode($results);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to fetch activity data: " . $e->getMessage()]);
}
