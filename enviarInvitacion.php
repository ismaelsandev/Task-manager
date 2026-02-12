<?php
    session_start();
    require 'db.php';

    $data = json_decode(file_get_contents("php://input"), true);

    $dashboard_id = $data['dashboard_id'] ?? null;
    $email = $data['email'] ?? null;
    $from_user = $_SESSION['user_id'];

    if (!$dashboard_id || !$email) {
        http_response_code(400);
        exit("Datos incompletos");
    }

    /* Obtener ID del usuario invitado */
    $stmt = $conn->prepare("SELECT id FROM usuario WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->bind_result($to_user);
    $stmt->fetch();
    $stmt->close();

    if (!$to_user) {
        http_response_code(404);
        exit("Usuario no existe");
    }

    /* Insertar invitación */
    $stmt = $conn->prepare("
        INSERT INTO dashboard_invitacion (dashboard_id, from_user_id, to_user_id)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE estado = 'pendiente'
    ");

    $stmt->bind_param("iii", $dashboard_id, $from_user, $to_user);
    $stmt->execute();
    $stmt->close();

    echo "Invitación enviada";
?>