<?php
    session_start();
    require 'db.php';

    if (!isset($_SESSION['user_id'])) {
        http_response_code(403);
        exit;
    }

    $user_id = $_SESSION['user_id'];

    $stmt = $conn->prepare(
        "SELECT id, nombre FROM dashboard WHERE user_id = ? ORDER BY updated_at DESC"
    );
    $stmt->bind_param("i", $user_id);
    $stmt->execute();

    $result = $stmt->get_result();
    $dashboards = [];

    while ($row = $result->fetch_assoc()) {
        $dashboards[] = $row;
    }

    echo json_encode($dashboards);
?>