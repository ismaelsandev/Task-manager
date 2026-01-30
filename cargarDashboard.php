<?php
    session_start();
    require 'db.php';

    if (!isset($_SESSION['user_id'], $_GET['id'])) {
        http_response_code(403);
        echo "Acceso no autorizado.";
        exit;
    }

    $user_id = $_SESSION['user_id'];
    $dashboard_id = (int) $_GET['id'];

    $stmt = $conn->prepare("SELECT contenido FROM dashboard WHERE id = ? and user_id = ?");
    $stmt->bind_param("ii", $dashboard_id, $user_id);
    $stmt->execute();
    $stmt->bind_result($contenido);
    $stmt->fetch();
    $stmt->close();

    echo $contenido ? $contenido : json_encode([]);
?>