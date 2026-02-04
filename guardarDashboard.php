<?php
    session_start();
    require 'db.php';

    if (!isset($_SESSION['user_id'])) {
        http_response_code(403);
        echo "Acceso no autorizado.";
        exit;
    }

    $user_id = $_SESSION['user_id'];

    $data = json_decode(file_get_contents("php://input"), true);
    $contenido = json_encode($data['contenido'] ?? []);
    $dashboard_id = $data['dashboard_id'] ?? null;

    if (!$dashboard_id) {
        http_response_code(400);
        echo "dashboard_id requerido";
        exit;
    }

    // ACTUALIZAR dashboard existente (con permisos)
    $stmt = $conn->prepare("
        UPDATE dashboard d
        JOIN usuario_dashboard ud ON ud.dashboard_id = d.id
        SET d.contenido = ?
        WHERE d.id = ?
        AND ud.user_id = ?
        AND ud.rol IN ('owner', 'editor')
    ");

    $stmt->bind_param("sii", $contenido, $dashboard_id, $user_id);
    $stmt->execute();

    if ($stmt->affected_rows === 0) {
        http_response_code(403);
        echo "Sin permisos o dashboard inexistente";
    } else {
        echo "Dashboard actualizado";
    }

    $stmt->close();
?>