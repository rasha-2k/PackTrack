<?php
header("Content-Type: application/json");
require_once __DIR__."/../../connection/db-conn.php";

$sql = "
    SELECT status, COUNT(*) as count
    FROM deliveries
    GROUP BY status
    ORDER BY FIELD(status, 'Delivered', 'Received', 'Pending', 'Cancelled')
";

try {
    $stmt = $pdo->query($sql);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($results);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to fetch status data: " . $e->getMessage()]);
}
?>
