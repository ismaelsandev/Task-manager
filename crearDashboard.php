<?php
    session_start();
    require 'db.php';

    if (!isset($_SESSION['user_id'])) exit;

    $data = json_decode(file_get_contents("php://input"), true);
    $nombre = $data['nombre'] ?? 'Nuevo Dashboard';

    $contenido = json_encode([ 'paneles' => [] ]);

    $conn->begin_transaction();

    $stmt = $conn->prepare(
        "INSERT INTO dashboard (nombre, contenido) VALUES (?, ?)"
    );
    $stmt->bind_param("ss", $nombre, $contenido);
    $stmt->execute();

    $dashboard_id = $stmt->insert_id;
    $user_id = $_SESSION['user_id'];

    $stmt = $conn->prepare(
        "INSERT INTO usuario_dashboard (user_id, dashboard_id, rol)
        VALUES (?, ?, 'owner')"
    );
    $stmt->bind_param("ii", $user_id, $dashboard_id);
    $stmt->execute();

    $conn->commit();

    echo json_encode([
        'id' => $dashboard_id,
        'nombre' => $nombre
    ]);
?>