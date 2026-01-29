let jsonData = {
    "dashboard": { "paneles": [] }
};

function renderDashboard() {
    const dashboard = document.getElementById("dashboard");
    dashboard.innerHTML = "";

    jsonData.dashboard.paneles.forEach(panel => {
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

    guardarJSON();
}

function agregarPanel() {
    const nuevoPanel = {
        id: Date.now(),
        nombre: "Nuevo Panel",
        tarjetas: []
    };
    jsonData.dashboard.paneles.push(nuevoPanel);
    renderDashboard();
}

function agregarTarjeta(panelId) {
    const panel = jsonData.dashboard.paneles.find(p => p.id === panelId);
    if (panel) {
        const nuevaTarjeta = {
            id: Date.now(),
            titulo: "Nueva Tarjeta",
            descripcion: "Descripción pendiente"
        };
        panel.tarjetas.push(nuevaTarjeta);
        renderDashboard();
    }
}

function eliminarPanel(panelId) {
    jsonData.dashboard.paneles = jsonData.dashboard.paneles.filter(p => p.id !== panelId);
    renderDashboard();
}

function eliminarTarjeta(panelId, tarjetaId) {
    const panel = jsonData.dashboard.paneles.find(p => p.id === panelId);
    if (panel) {
        panel.tarjetas = panel.tarjetas.filter(t => t.id !== tarjetaId);
        renderDashboard();
    }
}

function guardarJSON() {
    /*localStorage.setItem("dashboardData", JSON.stringify(jsonData));
    console.log("JSON Actualizado:", jsonData);*/

    fetch('guardarDashboard.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonData) //Convierte un objeto JS en una cadena con formato JSON.
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
            renderDashboard(); // Renderizamos el dashboard en la interfaz
        })
        .catch(error => {
            console.error("Error al cargar el dashboard:", error);
            alert("No se pudo cargar el dashboard. Reintenta más tarde.");
            //Comprobar si está vacío o realmente es un error.
        });
}

cargarJSON();

function newDashboard() {
    let nombre = prompt("Introduce el nombre del nuevo dashboard:");
    
}