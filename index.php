<?php include 'auth.php'; ?>

<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Task-manager</title>
		<link rel="stylesheet" href="css/estilos.css?v=<?php echo time(); ?>">
	</head>
	<body>
		<main>
			<aside>
				<h1>Task-manager</h1>
				<button class="button-newDashboard" onclick = "newDashboard()">Crear dashboard</button>
				
				<p>Your dashboards:</p>
				<nav id="dashboardList"></nav>

				<p>Invitaciones:</p>
				<div id="notificaciones" class="notificaciones-panel"></div>
				
				<a href="logout.php" class="logout">Salir</a>
			</aside>
			<section>
				<div id="dashboard" class="kanban-board"></div>
				<button class="add-button" onclick="agregarPanel()">+</button>
			</section>
		</main>

		<div id="descripcionModal" class="modal modal-descripcion oculto">
			<div class="modal-content modal-descripcion-content">
				<h3 class="modal-title">Editar descripción</h3>

				<textarea id="descripcionTextarea" class="descripcion-textarea" rows="6"></textarea>

				<div class="modal-actions modal-actions-descripcion">
					<button class="btn-primary" onclick="guardarDescripcion()">💾 Guardar</button>
					<button class="btn-secondary" onclick="cerrarModal()">❌ Cancelar</button>
				</div>
			</div>
		</div>

		<div id="settingsModal" class="modal oculto">
			<div class="modal-content">
				<h2>Configuración del dashboard</h2>

				<label>
					<h3 id="nombreDashboard">Nombre del dashboard</h3>
				</label>

				<hr>

				<h3>Usuarios con acceso</h3>
				<ul id="listaUsuarios"></ul>

				<input id="invitarEmailInput" type="email" placeholder="Email del usuario">
				<button onclick="invitarUsuario()">Invitar</button>

				<div id="listaInvitados"></div>

				<div class="modal-actions">
					<button onclick="cerrarSettingsModal()">Cerrar</button>
				</div>
			</div>
		</div>

		<script src = "js/myscript.js"></script>
	</body>
</html>
