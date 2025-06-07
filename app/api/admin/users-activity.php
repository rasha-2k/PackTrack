<?php
header("Content-Type: application/json");
require_once __DIR__ . "/../../connection/db-conn.php";

try {
    $stmt = $pdo->prepare("
            SELECT 
                u.name,
                u.email,
                a.action,
                a.created_at AS last_login,
                (
                    SELECT COUNT(*) 
                    FROM deliveries d 
                    WHERE d.user_id = u.id
                ) AS active_packages
            FROM user_activity_logs a
            JOIN users u ON u.id = a.user_id
            ORDER BY a.created_at DESC
            LIMIT 20
        ");
    $stmt->execute();
    $logs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "data" => $logs]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Error fetching activity logs", "error" => $e->getMessage()]);
}