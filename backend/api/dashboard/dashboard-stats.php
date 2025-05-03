<?php
header('Content-Type: application/json');
require_once __DIR__ . "/../../connection/db-conn.php";

try {
    // Current and last month date ranges
    $thisMonthStart = date('Y-m-01');
    $thisMonthEnd = date('Y-m-t');
    $lastMonthStart = date('Y-m-01', strtotime('-1 month'));
    $lastMonthEnd = date('Y-m-t', strtotime('-1 month'));

    function percentChange($current, $previous)
    {
        if ($previous == 0) return $current > 0 ? 100 : 0;
        return round((($current - $previous) / $previous) * 100);
    }

    function countByStatusAndDate($pdo, $status, $dateColumn, $startDate, $endDate)
    {
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM deliveries WHERE status = ? AND DATE($dateColumn) BETWEEN ? AND ?");
        $stmt->execute([$status, $startDate, $endDate]);
        return $stmt->fetchColumn();
    }

    // Total package activity for current and last month
    $activityQuery = "
        SELECT COUNT(DISTINCT id) FROM deliveries
        WHERE 
            DATE(created_at) BETWEEN ? AND ? OR
            DATE(received_at) BETWEEN ? AND ? OR
            DATE(delivered_at) BETWEEN ? AND ? OR
            DATE(updated_at) BETWEEN ? AND ?
    ";

    $stmt = $pdo->prepare($activityQuery);
    $stmt->execute([
        $thisMonthStart, $thisMonthEnd,
        $thisMonthStart, $thisMonthEnd,
        $thisMonthStart, $thisMonthEnd,
        $thisMonthStart, $thisMonthEnd
    ]);
    $total = $stmt->fetchColumn();

    $stmt->execute([
        $lastMonthStart, $lastMonthEnd,
        $lastMonthStart, $lastMonthEnd,
        $lastMonthStart, $lastMonthEnd,
        $lastMonthStart, $lastMonthEnd
    ]);
    $lastMonthTotal = $stmt->fetchColumn();

    // Status breakdowns using correct columns
    $received = countByStatusAndDate($pdo, 'Received', 'received_at', $thisMonthStart, $thisMonthEnd);
    $lastMonthReceived = countByStatusAndDate($pdo, 'Received', 'received_at', $lastMonthStart, $lastMonthEnd);

    $delivered = countByStatusAndDate($pdo, 'Delivered', 'delivered_at', $thisMonthStart, $thisMonthEnd);
    $lastMonthDelivered = countByStatusAndDate($pdo, 'Delivered', 'delivered_at', $lastMonthStart, $lastMonthEnd);

    $delayed = countByStatusAndDate($pdo, 'Delayed', 'updated_at', $thisMonthStart, $thisMonthEnd);
    $lastMonthDelayed = countByStatusAndDate($pdo, 'Delayed', 'updated_at', $lastMonthStart, $lastMonthEnd);

    // Return the JSON result
    echo json_encode([
        'total' => [
            'value' => $total,
            'change' => percentChange($total, $lastMonthTotal)
        ],
        'received' => [
            'value' => $received,
            'change' => percentChange($received, $lastMonthReceived)
        ],
        'delivered' => [
            'value' => $delivered,
            'change' => percentChange($delivered, $lastMonthDelivered)
        ],
        'delayed' => [
            'value' => $delayed,
            'change' => percentChange($delayed, $lastMonthDelayed)
        ]
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
