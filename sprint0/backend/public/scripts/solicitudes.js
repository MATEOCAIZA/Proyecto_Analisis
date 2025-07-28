const API_URL = "http://localhost:3000/api";
const token = localStorage.getItem("token");

const participantes = [];

document.getElementById("edad")?.addEventListener("input", () => {
  const edad = parseInt(document.getElementById("edad").value);
  document.getElementById("grupoConsentimiento").style.display = edad < 18 ? "block" : "none";
});

function archivoToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

document.getElementById("btnAgregar")?.addEventListener("click", async () => {
  const nombre = document.getElementById("nombre").value.trim();
  const edad = parseInt(document.getElementById("edad").value);
  const ci = document.getElementById("ci").value.trim();
  const ciudad = document.getElementById("ciudad").value.trim();
  const lider = document.getElementById("lider").checked;
  const archivo = document.getElementById("documento").files[0];

  if (!nombre || isNaN(edad) || !ci || !ciudad) {
    alert("Completa todos los datos del participante.");
    return;
  }

  if (lider && edad < 18) {
    alert("Un menor de edad no puede ser líder.");
    return;
  }

  let base64PDF = null;
  if (edad < 18) {
    if (!archivo || archivo.type !== "application/pdf") {
      alert("Debe subir un archivo PDF de consentimiento para menores.");
      return;
    }
    base64PDF = await archivoToBase64(archivo);
  }

  participantes.push({
    nombre,
    edad,
    ci_pasaporte: ci,
    ciudad,
    es_lider: lider,
    documento_consentimiento: base64PDF
  });

  const fila = document.createElement("tr");
  fila.innerHTML = `
    <td>${nombre}</td>
    <td>${edad}</td>
    <td>${lider ? "✔️" : "—"}</td>
  `;
  document.querySelector("#tablaParticipantes tbody").appendChild(fila);

  // Limpiar campos
  ["nombre", "edad", "ci", "ciudad", "documento"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
  document.getElementById("lider").checked = false;
  document.getElementById("grupoConsentimiento").style.display = "none";
});

document.getElementById("formulario")?.addEventListener("submit", async (e) => {
  e.preventDefault(); // Evita validación HTML5 por defecto

  if (participantes.length === 0) {
    alert("Debe agregar al menos un participante.");
    return;
  }

  const tieneLider = participantes.some(p => p.es_lider);
  if (!tieneLider) {
    alert("Debe haber al menos un líder en el grupo.");
    return;
  }

  const liderMenor = participantes.find(p => p.es_lider && p.edad < 18);
  if (liderMenor) {
    alert(`El líder "${liderMenor.nombre}" no puede ser menor de edad.`);
    return;
  }

  const fecha = document.getElementById("fecha").value;
  const contacto = document.getElementById("contacto").value.trim();
  const tipo = document.querySelector('input[name="tipo"]:checked')?.nextElementSibling.textContent.trim();

  const params = new URLSearchParams(window.location.search);
  const id_sitio = params.get("id");
  const id_usuario = JSON.parse(localStorage.getItem("usuario"))?.id;

  if (!fecha || !contacto || !tipo || !id_sitio || !id_usuario) {
    let errores = [];
    if (!fecha) errores.push("Fecha de visita");
    if (!contacto) errores.push("Contacto de emergencia");
    if (!tipo) errores.push("Tipo de visitante");
    if (!id_sitio) errores.push("ID de sitio (no presente en URL)");
    if (!id_usuario) errores.push("Usuario no autenticado");
  
    alert("❌ Faltan los siguientes datos:\n" + errores.join("\n"));
    return;
  }
  

  const data = {
    id_usuario,
    id_sitio: parseInt(id_sitio),
    fecha_visita: fecha,
    contacto_emergencia: contacto,
    tipo_visitante: tipo,
    participantes
  };

  try {
    const res = await fetch(`${API_URL}/solicitudes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const msg = await res.text();
      alert("❌ Error: " + msg);
      return;
    }

    alert("✅ Solicitud enviada con éxito.");
    window.location.href = "index.html";

  } catch (err) {
    console.error("Error:", err);
    alert("Error de red o del servidor.");
  }
});
