<?php
header("Content-Type: application/json");
require_once __DIR__ . "/../../connection/db-conn.php";

$mode = $_GET['range'] ?? 'month';

switch ($mode) {
    case 'week':
        $sql = "
                SELECT 
                CONCAT('Week ', 
                    CASE 
                        WHEN WEEK(created_at, 1) BETWEEN 1 AND 13 THEN '1-13'
                        WHEN WEEK(created_at, 1) BETWEEN 14 AND 26 THEN '14-26'
                        WHEN WEEK(created_at, 1) BETWEEN 27 AND 39 THEN '27-39'
                        ELSE '40-53'
                    END
                ) AS label,
                SUM(CASE WHEN status = 'Received' THEN 1 ELSE 0 END) AS received,
                SUM(CASE WHEN status = 'Delivered' THEN 1 ELSE 0 END) AS delivered
            FROM deliveries
            GROUP BY label
            ORDER BY MIN(WEEK(created_at, 1))
        ";
        break;

    case 'year':
        $sql = "
            SELECT 
                YEAR(created_at) AS label,
                SUM(CASE WHEN status = 'Received' THEN 1 ELSE 0 END) AS received,
                SUM(CASE WHEN status = 'Delivered' THEN 1 ELSE 0 END) AS delivered
            FROM deliveries
            WHERE YEAR(created_at) BETWEEN 2021 AND 2024
            GROUP BY YEAR(created_at)
            ORDER BY YEAR(created_at)
        ";
        break;

    default:
        $sql = "
            SELECT 
                DATE_FORMAT(created_at, '%b') AS label,
                SUM(CASE WHEN status = 'Received' THEN 1 ELSE 0 END) AS received,
                SUM(CASE WHEN status = 'Delivered' THEN 1 ELSE 0 END) AS delivered
            FROM deliveries
            GROUP BY MONTH(created_at)
            ORDER BY MONTH(created_at)
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
