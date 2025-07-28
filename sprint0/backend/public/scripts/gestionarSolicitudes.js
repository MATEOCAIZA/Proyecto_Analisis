const API_URL = "http://localhost:3000/api";
const token = localStorage.getItem("token");

let solicitudSeleccionada = null;

// Cargar solicitudes pendientes
async function cargarSolicitudes() {
  try {
    const res = await fetch(`${API_URL}/solicitudes/Pendiente`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const solicitudes = await res.json();

    const tbody = document.getElementById("tablaSolicitudes");
    tbody.innerHTML = "";

    solicitudes.forEach((s) => {
      const nombreUsuario = s.nombre_usuario || "Desconocido";
      const nombreSitio = s.nombre_sitio || "Sitio";

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${nombreUsuario}</td>
        <td>${s.fecha_visita}</td>
        <td>${nombreSitio}</td>
        <td><button class="btn btn-outline-success btn-sm" onclick="verDetalle(${s.id})">Ver Detalle</button></td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Error al cargar solicitudes:", err);
  }
}

// Ver detalle de la solicitud
window.verDetalle = async function (idSolicitud) {
  solicitudSeleccionada = idSolicitud;

  try {
    const res = await fetch(`${API_URL}/solicitudes/${idSolicitud}/participantes`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const participantes = await res.json();
    const tbody = document.getElementById("tablaParticipantes");
    tbody.innerHTML = "";

    participantes.forEach((p) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${p.nombre}</td>
        <td>${p.edad}</td>
        <td>${p.ci_pasaporte}</td>
        <td>${p.ciudad}</td>
        <td>${p.es_lider ? "✔️" : ""}</td>
        <td>
          ${
            p.edad < 18
              ? p.documento_consentimiento
                ? `<a href="data:application/pdf;base64,${p.documento_consentimiento}" download="consentimiento_${p.nombre}.pdf" class="btn btn-sm btn-outline-primary">📄 Descargar</a>`
                : `<span class="text-danger">❌ Sin PDF</span>`
              : "-"
          }
        </td>
      `;
      tbody.appendChild(fila);
    });

    new bootstrap.Modal(document.getElementById("modalDetalle")).show();
  } catch (err) {
    console.error("Error al cargar participantes:", err);
  }
};

// Aceptar o Rechazar
async function actualizarEstado(estado) {
  if (!solicitudSeleccionada) return;

  try {
    const comentario = document.getElementById("comentario").value;

    const res = await fetch(`${API_URL}/solicitudes/${solicitudSeleccionada}/estado`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ estado, comentario_guardaparque: comentario }),
    });

    if (!res.ok) throw new Error("Error al actualizar");

    alert("Solicitud " + estado + " correctamente.");
    document.getElementById("comentario").value = "";
    bootstrap.Modal.getInstance(document.getElementById("modalDetalle")).hide();
    cargarSolicitudes();
  } catch (err) {
    console.error("Error:", err);
    alert("Error al actualizar la solicitud");
  }
}

document.getElementById("btnAceptar").addEventListener("click", () => actualizarEstado("Aceptada"));
document.getElementById("btnRechazar").addEventListener("click", () => actualizarEstado("Rechazada"));

// Iniciar carga
cargarSolicitudes();
