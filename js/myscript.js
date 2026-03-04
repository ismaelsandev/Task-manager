let jsonData = {
    nombre: "Dashboard",
    paneles: []
};

let dashboardActivoId = null;
let draggedCard = null;
let tarjetaEditando = null;
let dashboardConfigId = null;
let lastUpdateTimestamp = null;
let pollingInterval = null;

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
            <h3 onclick="renombrarPanel(${panel.id}, this)">${panel.nombre}</h3>
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
                <strong onclick="renombrarTarjeta(${panel.id}, ${card.id}, this)">${card.titulo}</strong>
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

                const settings = document.createElement("span");
                settings.textContent = " ⚙️";
                settings.style.float = "right";
                settings.onclick = e => {
                    e.stopPropagation();
                    abrirConfiguracionDashboard(d.id);
                };

                btn.appendChild(settings);

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

            //alert("Tienes invitaciones pendientes");
            cargarInvitaciones()
        });
}

function cargarDashboard(id) {
    fetch(`cargarDashboard.php?id=${id}`)
        .then(res => res.json())
        .then(data => {

            jsonData = data.contenido || { paneles: [] };
            dashboardActivoId = id;

            lastUpdateTimestamp = data.updated_at || null;

            localStorage.setItem("dashboardActivo", id);

            marcarDashboardActivo(id);
            renderDashboard(false);

            iniciarPolling();

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

function abrirConfiguracionDashboard(dashboardId) {
    dashboardConfigId = dashboardId;

    fetch(`obtenerDashboardConfig.php?id=${dashboardId}`)

        .then(res => res.json())
        .then(data => {
            let nombreDashboard = document.getElementById("nombreDashboard");
            nombreDashboard.innerText = data.nombre;
            nombreDashboard.onclick = renombrarDashboard;

            renderUsuariosDashboard(data.usuarios);
        });

    document.getElementById("settingsModal").classList.remove("oculto");    
}

function renombrarDashboard() {

    const titulo = document.getElementById("nombreDashboard");

    // Evita crear múltiples inputs
    if (titulo.querySelector("input")) return;

    const nombreOriginal = titulo.innerText.trim();

    const input = document.createElement("input");
    input.type = "text";
    input.value = nombreOriginal;
    input.style.width = "100%";
    input.style.fontSize = "1.2rem";
    input.style.fontWeight = "bold";

    titulo.innerHTML = "";
    titulo.appendChild(input);

    input.focus();
    input.select();

    // ENTER guarda
    input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            input.blur();
        }

        if (e.key === "Escape") {
            restaurarNombre(nombreOriginal);
        }
    });

    // BLUR guarda automáticamente
    input.addEventListener("blur", function () {

        const nuevoNombre = input.value.trim();

        if (!nuevoNombre) {
            restaurarNombre(nombreOriginal);
            return;
        }

        fetch("renombrarDashboard.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                dashboard_id: dashboardConfigId,
                nombre: nuevoNombre
            })
        })
        .then(res => {
            if (!res.ok) throw new Error("Sin permisos");
            return res.text();
        })
        .then(() => {

            titulo.innerText = nuevoNombre;
            titulo.onclick = renombrarDashboard;

            // Actualiza lista lateral
            cargarDashboardsAside(false);

        })
        .catch(() => {
            alert("No tienes permisos para renombrar este dashboard");
            restaurarNombre(nombreOriginal);
        });

    });
}

function restaurarNombre(nombre) {
    const titulo = document.getElementById("nombreDashboard");
    titulo.innerText = nombre;
    titulo.onclick = renombrarDashboard;
}

function renderUsuariosDashboard(usuarios) {
    const ul = document.getElementById("listaUsuarios");
    ul.innerHTML = "";

    usuarios.forEach(u => {
        const li = document.createElement("li");
        li.textContent = u.email;

        const borrar = document.createElement("button");
        borrar.textContent = "❌";
        borrar.onclick = () => quitarUsuario(u.id);

        li.appendChild(borrar);
        ul.appendChild(li);
    });
}

function invitarUsuario() {
    const input = document.getElementById("invitarEmailInput");
    const email = input.value.trim();

    if (!email) {
        alert("Introduce un email válido");
        return;
    }

    if (!dashboardConfigId) {
        alert("No hay dashboard seleccionado");
        return;
    }

    fetch("enviarInvitacion.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            dashboard_id: dashboardConfigId,
            email: email
        })
    })
    .then(res => {
        if (!res.ok) throw new Error("Error al enviar invitación");
        return res.text();
    })
    .then(msg => {
        console.log(msg);
        input.value = "";
        cargarUsuariosInvitados(dashboardConfigId); // refresca lista
        alert("Invitación enviada");
    })
    .catch(err => {
        console.error(err);
        alert("No se pudo enviar la invitación");
    });
}

function cerrarSettingsModal() {
    document.getElementById("settingsModal").classList.add("oculto");
}

//Revisar!!
function cargarUsuariosInvitados(dashboardId) {
    fetch(`obtenerDashboardConfig.php?id=${dashboardId}`)
        .then(res => res.json())
        .then(data => {
            const lista = document.getElementById("listaInvitados");
            lista.innerHTML = "";

            data.usuarios.forEach(u => {
                const div = document.createElement("div");
                div.innerHTML = `
                    ${u.email}
                    <button onclick="quitarUsuario(${dashboardId}, ${u.id})">❌</button>
                `;
                lista.appendChild(div);
            });
        });
}

function cargarInvitaciones() {
    fetch("obtenerInvitaciones.php")
        .then(res => res.json())
        .then(invitaciones => {
            const cont = document.getElementById("notificaciones");
            cont.innerHTML = "";

            invitaciones.forEach(i => {
                const div = document.createElement("div");
                div.className = "inv-item";
                div.innerHTML = `
                    <p><strong>${i.from_email}</strong> te invita a <b>${i.dashboard}</b></p>
                    <button onclick="responderInv(${i.id}, 'aceptar')">Aceptar</button>
                    <button onclick="responderInv(${i.id}, 'rechazar')">Rechazar</button>
                `;
                cont.appendChild(div);
            });
        });
}

function responderInv(id, accion) {
    fetch("responderInvitacion.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, accion })
    })
    .then(() => {
        cargarInvitaciones();
        cargarDashboardsAside(true);
    });
}

function iniciarPolling() {

    // Evita múltiples intervalos
    if (pollingInterval) {
        clearInterval(pollingInterval);
    }

    pollingInterval = setInterval(() => {

        if (!dashboardActivoId) return;

        fetch(`checkDashboardUpdate.php?id=${dashboardActivoId}`)
            .then(res => res.json())
            .then(data => {

                if (!data.updated_at) return;

                // Si otro usuario modificó el dashboard
                if (lastUpdateTimestamp && data.updated_at !== lastUpdateTimestamp) {

                    console.log("Actualización detectada, recargando...");

                    lastUpdateTimestamp = data.updated_at;

                    cargarDashboard(dashboardActivoId);
                }

            })
            .catch(err => console.error("Error polling:", err));

        // También revisamos invitaciones
        cargarInvitaciones();

    }, 5000); // cada 5 segundos
}

cargarDashboardsAside();