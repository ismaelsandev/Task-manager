<?php
    session_start();
    require_once 'db.php';

    if (isset($_GET['registro']) && $_GET['registro'] === 'ok') {
        $mensaje = "Usuario registrado con éxito. Por favor, inicia sesión.";
        echo "<p style='color: green;'>".$mensaje."</p>";
    }

    $error = '';

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $useremail = trim($_POST['useremail']);
        $password = $_POST['password'];

        $stmt = $conn->prepare("SELECT id, password FROM usuario WHERE email = ?");
        $stmt->bind_param("s", $useremail);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows === 1) {
            $stmt->bind_result($id, $hashed_password);
            $stmt->fetch();

            if (password_verify($password, $hashed_password)) {
                $_SESSION['user_id'] = $id;
                $_SESSION['useremail'] = $useremail;
                header("Location: index.php");
                exit;
            } else {
                $error = "Contraseña incorrecta.";
            }
        } else {
            $error = "Usuario no encontrado.";
        }

        $stmt->close();
    }
?>

<!DOCTYPE html>
<html>
    <head>
        <title>Login task manager</title>
        <link rel="stylesheet" href="css/stylesLoginRegistry.css">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
    </head>
    <body>
        <h1 class="app-title">Task Manager</h1>
        <h2 class="login-title">Iniciar sesión</h2>

        <?php if ($error): ?>
            <p class="error"><?= $error ?></p>
        <?php endif; ?>

        <form method="POST" action="login.php">
            <label>Usuario</label>
            <input type="text" name="useremail" required>

            <label>Contraseña</label>
            <input type="password" name="password" required>

            <button type="submit">Entrar</button>

            <p class="register-link">
                ¿No tienes cuenta?
                <a href="register.php">Regístrate</a>
            </p>
        </form>
    </body>
</html>
