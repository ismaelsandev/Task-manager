<?php
    session_start();
    require 'db.php';

    if (!isset($_SESSION['user_id'], $_GET['id'])) exit;

    $user_id = $_SESSION['user_id'];
    $dashboard_id = (int) $_GET['id'];

    $stmt = $conn->prepare(
        "DELETE d FROM dashboard d
        JOIN usuario_dashboard ud ON ud.dashboard_id = d.id
        WHERE d.id = ? AND ud.user_id = ? AND ud.rol = 'owner'"
    );
    $stmt->bind_param("ii", $dashboard_id, $user_id);
    $stmt->execute();

    echo "ok";
?>