let jsonData = {
    paneles: []
};

let dashboardActivoId = null;

function renderDashboard(guardar = true) {
    const dashboard = document.getElementById("dashboard");
    dashboard.innerHTML = "";

    jsonData.paneles.forEach(panel => {
        const panelDiv = document.createElement("div");
        panelDiv.classList.add("panel");
        panelDiv.innerHTML = `
            <h3>${panel.nombre}</h3>
            <button class='btn' onclick="agregarTarjeta(${panel.id})">➕ Añadir Tarjeta</button>
            <button class='btn' style="background:red;" onclick="eliminarPanel(${panel.id})">🗑️ Borrar Panel</button>
        `
        panel.tarjetas.forEach(card => {
            const cardDiv = document.createElement("div");
            cardDiv.classList.add("card");
            cardDiv.innerHTML = `
                <strong>${card.titulo}</strong>
                <p>${card.descripcion}</p>
                <button class='btn' style="background:crimson;" onclick="eliminarTarjeta(${panel.id}, ${card.id})">❌ Eliminar</button>
            `;
            panelDiv.appendChild(cardDiv);
        });
        dashboard.appendChild(panelDiv);
    });

    if (guardar) guardarJSON();
}

function agregarPanel() {
    const nuevoPanel = {
        id: Date.now(),
        nombre: "Nuevo Panel",
        tarjetas: []
    };
    jsonData.paneles.push(nuevoPanel);
    renderDashboard(true);
}

function agregarTarjeta(panelId) {
    const panel = jsonData.paneles.find(p => p.id === panelId);
    if (panel) {
        const nuevaTarjeta = {
            id: Date.now(),
            titulo: "Nueva Tarjeta",
            descripcion: "Descripción pendiente"
        };
        panel.tarjetas.push(nuevaTarjeta);
        renderDashboard(true);
    }
}

function eliminarPanel(panelId) {
    jsonData.paneles = jsonData.paneles.filter(p => p.id !== panelId);
    renderDashboard(true);
}

function eliminarTarjeta(panelId, tarjetaId) {
    const panel = jsonData.paneles.find(p => p.id === panelId);
    if (panel) {
        panel.tarjetas = panel.tarjetas.filter(t => t.id !== tarjetaId);
        renderDashboard(true);
    }
}

function guardarJSON() {

    if (!dashboardActivoId) {
        console.warn("No hay dashboard activo");
        return;
    }

    fetch('guardarDashboard.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            dashboard_id: dashboardActivoId,
            contenido: jsonData
        })
    })
    .then(res => res.text())
    .then(mensaje => console.log(mensaje))
    .catch(err => console.error('Error al guardar:', err));
}

function cargarJSON() {
    /*const data = localStorage.getItem("dashboardData");
    if (data) jsonData = JSON.parse(data);
    renderDashboard();*/

    fetch('cargarDashboard.php')
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al obtener el dashboard");
            }
            return response.json();
        })
        .then(data => {
            jsonData = data; // Asignamos el contenido recibido al objeto global
            console.log(data);
            renderDashboard(false); // Renderizamos el dashboard en la interfaz
        })
        .catch(error => {
            console.error("Error al cargar el dashboard:", error);
            alert("No se pudo cargar el dashboard. Reintenta más tarde.");
            //Comprobar si está vacío o realmente es un error.
        });
}

function cargarDashboardsAside() {
    fetch("listarDashboards.php")
        .then(res => res.json())
        .then(dashboards => {
            const contenedor = document.getElementById("dashboardList");
            contenedor.innerHTML = "";

            dashboards.forEach(dashboard => {
                const btn = document.createElement("button");
                btn.className = "dashboard-btn";
                btn.textContent = dashboard.nombre;

                btn.onclick = () => cargarDashboard(dashboard.id);

                contenedor.appendChild(btn);
            });
        })
        .catch(err => console.error("Error cargando dashboards:", err));
}

function cargarDashboard(id) {
    fetch(`cargarDashboard.php?id=${id}`)
        .then(res => res.json())
        .then(data => {
            jsonData = data;
            dashboardActivoId = id;
            renderDashboard(false);
        })
        .catch(err => {
            console.error("Error al cargar dashboard:", err);
            alert("No se pudo cargar el dashboard");
        });
}

cargarDashboardsAside();

function newDashboard() {
    const nombre = prompt("Nombre del dashboard:");
    if (!nombre) return;

    fetch("crearDashboard.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre })
    })
    .then(res => res.json())
    .then(dashboard => {
        cargarDashboardsAside(false);
        cargarDashboard(dashboard.id);
    });
}