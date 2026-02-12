<?php
    session_start();
    require 'db.php';

    $data = json_decode(file_get_contents("php://input"), true);

    $inv_id = $data['id'] ?? null;
    $accion = $data['accion'] ?? null; // aceptar | rechazar
    $user = $_SESSION['user_id'];

    if (!$inv_id || !in_array($accion, ['aceptar','rechazar'])) {
        http_response_code(400);
        exit("Datos inválidos");
    }

    /* Obtener invitación */
    $stmt = $conn->prepare("
        SELECT dashboard_id
        FROM dashboard_invitacion
        WHERE id = ? AND to_user_id = ? AND estado = 'pendiente'
    ");

    $stmt->bind_param("ii", $inv_id, $user);
    $stmt->execute();
    $stmt->bind_result($dashboard_id);
    $stmt->fetch();
    $stmt->close();

    if (!$dashboard_id) {
        http_response_code(403);
        exit("Invitación no válida");
    }

    if ($accion === 'aceptar') {
        // Añadir acceso
        $stmt = $conn->prepare("
            INSERT INTO usuario_dashboard (user_id, dashboard_id, rol)
            VALUES (?, ?, 'editor')
        ");
        $stmt->bind_param("ii", $user, $dashboard_id);
        $stmt->execute();
        $stmt->close();
    }

    /* Actualizar estado */
    $stmt = $conn->prepare("
        UPDATE dashboard_invitacion
        SET estado = ?
        WHERE id = ?
    ");

    $estado = $accion === 'aceptar' ? 'aceptada' : 'rechazada';
    $stmt->bind_param("si", $estado, $inv_id);
    $stmt->execute();
    $stmt->close();

    echo "OK";
?>