let jsonData = {
    nombre: "Dashboard",
    paneles: []
};

let dashboardActivoId = null;
let draggedCard = null;
let tarjetaEditando = null;

function renderDashboard(guardar = true) {
    const dashboard = document.getElementById("dashboard");
    dashboard.innerHTML = "";

    jsonData.paneles.forEach(panel => {
        const panelDiv = document.createElement("div");
        panelDiv.classList.add("panel");
        panelDiv.dataset.panelId = panel.id;

        panelDiv.ondragover = e => e.preventDefault();
        panelDiv.ondrop = () => dropCard(panel.id);

        panelDiv.innerHTML = `
            <h3 ondblclick="renombrarPanel(${panel.id}, this)">${panel.nombre}</h3>
            <button class='btn' onclick="agregarTarjeta(${panel.id})">➕ Añadir Tarjeta</button>
            <button class='btn' style="background:red;" onclick="eliminarPanel(${panel.id})">🗑️ Borrar Panel</button>
        `;

        panel.tarjetas.forEach(card => {
            const cardDiv = document.createElement("div");
            cardDiv.classList.add("card");
            cardDiv.draggable = true;
            cardDiv.dataset.cardId = card.id;
            cardDiv.dataset.panelId = panel.id;

            cardDiv.ondragstart = () => startDrag(card.id, panel.id);

            cardDiv.innerHTML = `
                <strong ondblclick="renombrarTarjeta(${panel.id}, ${card.id}, this)">${card.titulo}</strong>
                <p ondblclick="abrirModalDescripcion(${panel.id}, ${card.id})">${card.descripcion}</p>
                <button class='btn' style="background:crimson;" onclick="eliminarTarjeta(${panel.id}, ${card.id})">❌ Eliminar</button>
            `;
            panelDiv.appendChild(cardDiv);
        });

        dashboard.appendChild(panelDiv);
    });

    if (guardar) guardarJSON();
}

function abrirModalDescripcion(panelId, cardId) {
    const panel = jsonData.paneles.find(p => p.id === panelId);
    if (!panel) return;

    const card = panel.tarjetas.find(t => t.id === cardId);
    if (!card) return;

    tarjetaEditando = { panelId, cardId };

    document.getElementById("descripcionTextarea").value = card.descripcion || "";
    document.getElementById("descripcionModal").classList.remove("oculto");
}

function guardarDescripcion() {
    if (!tarjetaEditando) return;

    const { panelId, cardId } = tarjetaEditando;

    const panel = jsonData.paneles.find(p => p.id === panelId);
    if (!panel) return;

    const card = panel.tarjetas.find(t => t.id === cardId);
    if (!card) return;

    card.descripcion = document.getElementById("descripcionTextarea").value.trim();

    tarjetaEditando = null;
    cerrarModal();
    guardarJSON();
    renderDashboard(false);
}

function cerrarModal() {
    document.getElementById("descripcionModal").classList.add("oculto");
    tarjetaEditando = null;
}

function renombrarDashboard(element) {
    const input = document.createElement("input");
    input.value = jsonData.nombre;

    element.replaceWith(input);
    input.focus();

    input.onblur = () => {
        if (input.value.trim()) {
            jsonData.nombre = input.value.trim();
            guardarJSON();
            cargarDashboardsAside(false);
        }
        renderDashboard(false);
    };

    input.onkeydown = e => {
        if (e.key === "Enter") input.blur();
    };
}

function renombrarPanel(panelId, element) {
    const panel = jsonData.paneles.find(p => p.id === panelId);
    if (!panel) return;

    const input = document.createElement("input");
    input.value = panel.nombre;

    element.replaceWith(input);
    input.focus();

    input.onblur = () => {
        if (input.value.trim()) {
            panel.nombre = input.value.trim();
            guardarJSON();
        }
        renderDashboard(false);
    };

    input.onkeydown = e => {
        if (e.key === "Enter") input.blur();
    };
}

function renombrarTarjeta(panelId, cardId, element) {
    const panel = jsonData.paneles.find(p => p.id === panelId);
    if (!panel) return;

    const card = panel.tarjetas.find(t => t.id === cardId);
    if (!card) return;

    const input = document.createElement("input");
    input.value = card.titulo;

    element.replaceWith(input);
    input.focus();

    input.onblur = () => {
        if (input.value.trim()) {
            card.titulo = input.value.trim();
            guardarJSON();
        }
        renderDashboard(false);
    };

    input.onkeydown = e => {
        if (e.key === "Enter") input.blur();
    };
}

function editarDescripcion(panelId, cardId, element) {
    const panel = jsonData.paneles.find(p => p.id === panelId);
    if (!panel) return;

    const card = panel.tarjetas.find(t => t.id === cardId);
    if (!card) return;

    const textarea = document.createElement("textarea");
    textarea.value = card.descripcion;
    textarea.rows = 3;

    element.replaceWith(textarea);
    textarea.focus();

    textarea.onblur = () => {
        card.descripcion = textarea.value.trim();
        guardarJSON();
        renderDashboard(false);
    };
}

function startDrag(cardId, panelId) {
    draggedCard = { cardId, panelId };
}

function dropCard(targetPanelId) {
    if (!draggedCard) return;

    const { cardId, panelId } = draggedCard;
    if (panelId === targetPanelId) return;

    const fromPanel = jsonData.paneles.find(p => p.id === panelId);
    const toPanel = jsonData.paneles.find(p => p.id === targetPanelId);

    if (!fromPanel || !toPanel) return;

    const index = fromPanel.tarjetas.findIndex(t => t.id === cardId);
    if (index === -1) return;

    const [card] = fromPanel.tarjetas.splice(index, 1);
    toPanel.tarjetas.push(card);

    draggedCard = null;
    guardarJSON();
    renderDashboard(false);
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

function cargarDashboardsAside(autoAbrir = true) {
    fetch("listarDashboards.php")
        .then(res => res.json())
        .then(dashboards => {
            const contenedor = document.getElementById("dashboardList");
            contenedor.innerHTML = "";

            dashboards.forEach(d => {
                const btn = document.createElement("button");
                btn.className = "dashboard-btn";
                btn.textContent = d.nombre;
                btn.dataset.id = d.id;

                btn.onclick = () => cargarDashboard(d.id);
                btn.ondblclick = () => renombrarDashboard(this);

                // botón borrar
                const borrar = document.createElement("span");
                borrar.textContent = " 🗑️";
                borrar.style.float = "right";
                borrar.onclick = e => {
                    e.stopPropagation();
                    borrarDashboard(d.id);
                };

                btn.appendChild(borrar);
                contenedor.appendChild(btn);
            });

            // abrir último dashboard o el primero
            if (autoAbrir) abrirDashboardInicial(dashboards);
        });
}

function cargarDashboard(id) {
    fetch(`cargarDashboard.php?id=${id}`)
        .then(res => res.json())
        .then(data => {
            jsonData = data;
            dashboardActivoId = id;
            localStorage.setItem("dashboardActivo", id);

            marcarDashboardActivo(id);
            renderDashboard(false);
        })
        .catch(err => {
            console.error("Error al cargar dashboard:", err);
            alert("No se pudo cargar el dashboard");
        });
}

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

function marcarDashboardActivo(id) {
    document.querySelectorAll(".dashboard-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.id == id);
    });
}

function abrirDashboardInicial(dashboards) {
    const ultimo = localStorage.getItem("dashboardActivo");

    const existe = dashboards.find(d => d.id == ultimo);

    if (existe) {
        cargarDashboard(ultimo);
    } else if (dashboards.length > 0) {
        cargarDashboard(dashboards[0].id);
    }
}

function borrarDashboard(id) {
    if (!confirm("¿Eliminar este dashboard?")) return;

    fetch(`borrarDashboard.php?id=${id}`)
        .then(() => {
            localStorage.removeItem("dashboardActivo");
            cargarDashboardsAside(true);
        });
}

cargarDashboardsAside();