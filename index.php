<?php include 'auth.php'; ?>

<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Dharma</title>
		<link rel="stylesheet" href="css/estilos.css?v=<?php echo time(); ?>">
	</head>
	<body>
		<main>
			<aside>
				<h1>Dharma</h1>
				<div class="dashboards-lists">
					<p style="margin-top: 20px;">Your dashboards</p>
					<button class="button-newDashboard" onclick = "newDashboard()">+</button>
				</div>
				<a href="#">Dashboard 1</a>
				<a href="#">Dashboard 2</a>
				<a href="#">Dashboard 3</a>
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