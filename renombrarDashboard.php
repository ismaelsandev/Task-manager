<?php
    session_start();
    require 'db.php';

    if (!isset($_SESSION['user_id'])) {
        http_response_code(403);
        exit("No autorizado");
    }

    $user_id = $_SESSION['user_id'];

    $data = json_decode(file_get_contents("php://input"), true);
    $dashboard_id = $data['dashboard_id'] ?? null;
    $nombre = trim($data['nombre'] ?? '');

    if (!$dashboard_id || !$nombre) {
        http_response_code(400);
        exit("Datos inválidos");
    }

    /* VALIDAR QUE ES OWNER */
    $stmt = $conn->prepare("
        SELECT 1 FROM usuario_dashboard
        WHERE user_id = ? AND dashboard_id = ?
        AND rol = 'owner'
    ");

    $stmt->bind_param("ii", $user_id, $dashboard_id);
    $stmt->execute();

    if (!$stmt->get_result()->num_rows) {
        http_response_code(403);
        exit("Sin permisos");
    }
    $stmt->close();

    /* ACTUALIZAR NOMBRE */
    $stmt = $conn->prepare("
        UPDATE dashboard
        SET nombre = ?
        WHERE id = ?
    ");

    $stmt->bind_param("si", $nombre, $dashboard_id);
    $stmt->execute();
    $stmt->close();

    echo "Nombre actualizado";
?>