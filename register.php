<?php
    require_once 'db.php';

    $mensaje = '';

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $useremail = trim($_POST['useremail']);
        $password = $_POST['password'];
        $confirm_password = $_POST['confirm_password'];

        if ($password !== $confirm_password) {
            $mensaje = "Las contraseñas no coinciden.";
        } else {

            $stmt = $conn->prepare("SELECT id FROM usuario WHERE email = ?");
            $stmt->bind_param("s", $useremail);
            $stmt->execute();
            $stmt->store_result();

            if ($stmt->num_rows > 0) {
                $mensaje = "El nombre de usuario ya está registrado.";
            } else {

                $hash = password_hash($password, PASSWORD_DEFAULT);
                $stmt = $conn->prepare("INSERT INTO usuario (email, password) VALUES (?, ?)");
                $stmt->bind_param("ss", $useremail, $hash);
                if ($stmt->execute()) {
                    //$mensaje = "Usuario registrado correctamente.";
                    header("Location: login.php?registro=ok");
                    exit;
                } else {
                    $mensaje = "Error al registrar el usuario.";
                }
            }

            $stmt->close();
        }
    }
?>

<!DOCTYPE html>
<html>
    <head>
        <title>Registro - CRM</title>
    </head>
    <body>
        <h2>Registrar nuevo usuario</h2>
        <?php if ($mensaje): ?>
            <p style="color: <?= strpos($mensaje, 'correctamente') !== false ? 'green' : 'red' ?>"><?= $mensaje ?></p>
        <?php endif; ?>
        <form method="POST" action="register.php">
            <label>E-mail de usuario:</label>
            <input type="text" name="useremail" required><br><br>
            <label>Contraseña:</label>
            <input type="password" name="password" required><br><br>
            <label>Confirmar contraseña:</label>
            <input type="password" name="confirm_password" required><br><br>
            <button type="submit">Registrar</button>
        </form>
    </body>
</html>
