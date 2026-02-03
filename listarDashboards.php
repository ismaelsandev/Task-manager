<?php
    session_start();
    require 'db.php';

    if (!isset($_SESSION['user_id'])) {
        http_response_code(403);
        exit;
    }

    $user_id = $_SESSION['user_id'];

    $stmt = $conn->prepare(
        //"SELECT id, nombre FROM dashboard WHERE user_id = ? ORDER BY updated_at DESC"
        "SELECT d.id, d.nombre, ud.rol FROM dashboard d JOIN usuario_dashboard ud ON ud.dashboard_id = d.id WHERE ud.user_id = ?"
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