<?php
    session_start();
    require 'db.php';

    $id = $_GET['id'];
    $user = $_SESSION['user_id'];

    $stmt = $conn->prepare("
      SELECT d.nombre
      FROM dashboard d
      JOIN usuario_dashboard ud ON ud.dashboard_id = d.id
      WHERE d.id = ? AND ud.user_id = ?
    ");

    $stmt->bind_param("ii", $id, $user);
    $stmt->execute();
    $stmt->bind_result($nombre);
    $stmt->fetch();
    $stmt->close();

    $stmt = $conn->prepare("
      SELECT u.id, u.email
      FROM usuario_dashboard ud
      JOIN usuario u ON u.id = ud.user_id
      WHERE ud.dashboard_id = ?
    ");

    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    $usuarios = [];
    while ($row = $result->fetch_assoc()) {
        $usuarios[] = $row;
    }

    echo json_encode([
        "nombre" => $nombre,
        "usuarios" => $usuarios
    ]);
?>