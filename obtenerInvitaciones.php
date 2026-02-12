<?php
    session_start();
    require 'db.php';

    $user = $_SESSION['user_id'];

    $stmt = $conn->prepare("
        SELECT i.id, d.nombre AS dashboard, u.email AS from_email
        FROM dashboard_invitacion i
        JOIN dashboard d ON d.id = i.dashboard_id
        JOIN usuario u ON u.id = i.from_user_id
        WHERE i.to_user_id = ? AND i.estado = 'pendiente'
    ");

    $stmt->bind_param("i", $user);
    $stmt->execute();
    $result = $stmt->get_result();

    $invitaciones = [];
    while ($row = $result->fetch_assoc()) {
        $invitaciones[] = $row;
    }

    echo json_encode($invitaciones);
?>