<?php
    session_start();
    require 'db.php';

    if (!isset($_SESSION['user_id'])) {
        http_response_code(403);
        exit;
    }

    $dashboard_id = $_GET['id'] ?? null;

    if (!$dashboard_id) {
        http_response_code(400);
        exit;
    }

    $stmt = $conn->prepare("
        SELECT updated_at 
        FROM dashboard 
        WHERE id = ?
    ");

    $stmt->bind_param("i", $dashboard_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();

    echo json_encode([
        "updated_at" => $row['updated_at']
    ]);
?>