<?php
    session_start();
    require 'db.php';

    if (!isset($_SESSION['user_id'])) {
        http_response_code(403);
        echo "Acceso no autorizado.";
        exit;
    }

    //Convierte un string en formato JSON a una estructura de datos de PHP.
    //En este caso, un array asociativo.
    //Este paso no es del todo necesario, a no ser que se tenga que cambiar un valor
    //antes de volver a convertir la estructura en una cadena JSON.
    $data = json_decode(file_get_contents("php://input"), true);

    //Convierte un array u objeto de PHP a cadena JSON.
    $contenido = json_encode($data);

    $user_id = $_SESSION['user_id'];

    // Verifica si ya hay un dashboard guardado
    $stmt = $conn->prepare("SELECT user_id FROM usuario_dashboard WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        // Actualizar
        echo "Actualizar\n";
        echo $contenido;
        //$stmt = $conn->prepare("UPDATE dashboard SET contenido = ? WHERE user_id = ?");
        $stmt = $conn->prepare("UPDATE dashboard d JOIN usuario_dashboard ud ON ud.dashboard_id = d.id SET d.contenido = ? WHERE d.id = ? AND ud.user_id = ? 
        AND ud.rol IN ('owner', 'editor');");
        $stmt->bind_param("si", $contenido, $user_id);
    } else {
        // Insertar
        echo "Insertar";
        $nombre = "Otro dashboard";
        $stmt = $conn->prepare("INSERT INTO dashboard (nombre, contenido) VALUES (?, ?)");
        $stmt->bind_param("ss", $nombre, $contenido);
    }
    $stmt->execute();
    $stmt->close();
?>