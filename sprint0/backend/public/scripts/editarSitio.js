const API_URL = "http://localhost:3000/api";
const token = localStorage.getItem("token");
const usuario = JSON.parse(localStorage.getItem("usuario"));

// Mostrar el nombre del usuario en la navbar
document.getElementById("userName").textContent = usuario?.nombre || "";

// Obtener el ID del sitio desde la URL
const params = new URLSearchParams(window.location.search);
const sitioId = params.get("id");

if (!sitioId || !token) {
  alert("Acceso no autorizado.");
  window.location.href = "index.html";
}

// Referencias a campos
const form = document.getElementById("editSitioForm");
const nombreInput = document.getElementById("nombre");
const descripcionInput = document.getElementById("descripcion");
const aforoInput = document.getElementById("aforo");
const estadoSelect = document.getElementById("estado");
const imagenesInput = document.getElementById("imagenes");
const preview = document.getElementById("preview");

// Cargar los datos del sitio
async function cargarDatosSitio() {
  try {
    const res = await fetch(`${API_URL}/sitios/${sitioId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("No se pudo cargar el sitio.");
    const sitio = await res.json();

    nombreInput.value = sitio.nombre || "";
    descripcionInput.value = sitio.descripcion || "";
    aforoInput.value = sitio.aforo_maximo ?? "";
    estadoSelect.value = sitio.estado || "Activo";

    // Mostrar imágenes actuales
    if (Array.isArray(sitio.imagenes)) {
      sitio.imagenes.forEach((ruta) => {
        const img = document.createElement("img");
        img.src = `http://localhost:3000${ruta}`;
        img.style.width = "120px";
        img.classList.add("rounded", "shadow");
        preview.appendChild(img);
      });
    }

  } catch (err) {
    console.error(err);
    alert("Error al cargar los datos del sitio.");
  }
}

// Guardar los cambios
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const datosActualizados = {
    nombre: nombreInput.value.trim(),
    descripcion: descripcionInput.value.trim(),
    aforo_maximo: parseInt(aforoInput.value),
    estado: estadoSelect.value
  };

  try {
    // Actualizar texto y estado del sitio
    const res = await fetch(`${API_URL}/sitios/${sitioId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(datosActualizados)
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Error al actualizar sitio");
    }

    // Subir imágenes si hay nuevas
    if (imagenesInput.files.length > 0) {
      const formData = new FormData();
      for (const file of imagenesInput.files) {
        formData.append("imagenes", file);
      }

      const resImg = await fetch(`${API_URL}/sitios/${sitioId}/imagenes`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (!resImg.ok) throw new Error("Error al subir imágenes");
      console.log("✅ Imágenes subidas correctamente.");
    }

    alert("✅ Sitio actualizado correctamente.");
    window.location.href = "index.html";

  } catch (err) {
    console.error(err);
    alert("❌ No se pudo actualizar el sitio.");
  }
});

cargarDatosSitio();
