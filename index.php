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
				
				<a href="logout.php" class="logout">Salir</a>
			</aside>
			<section>
				<div id="dashboard" class="kanban-board"></div>
				<button class="add-button" onclick="agregarPanel()">+</button>
			</section>
		</main>
		<script src = "js/myscript.js"></script>
	</body>
</html>