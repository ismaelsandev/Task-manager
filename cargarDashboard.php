<?php
    session_start();
    require 'db.php';

    if (!isset($_SESSION['user_id'], $_GET['id'])) {
        http_response_code(403);
        echo json_encode(["error" => "Acceso no autorizado"]);
        exit;
    }

    $user_id = $_SESSION['user_id'];
    $dashboard_id = (int) $_GET['id'];

    $stmt = $conn->prepare("
        SELECT d.contenido, d.updated_at
        FROM dashboard d
        JOIN usuario_dashboard ud 
            ON ud.dashboard_id = d.id
        WHERE d.id = ? 
        AND ud.user_id = ?
    ");

    $stmt->bind_param("ii", $dashboard_id, $user_id);
    $stmt->execute();
    $stmt->bind_result($contenido, $updated_at);

    if ($stmt->fetch()) {

        echo json_encode([
            "contenido"  => json_decode($contenido, true),
            "updated_at" => $updated_at
        ]);

    } else {
        http_response_code(404);
        echo json_encode(["error" => "Dashboard no encontrado"]);
    }

    $stmt->close();
?>