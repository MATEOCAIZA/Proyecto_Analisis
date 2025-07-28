const API_URL = "http://localhost:3000/api";
const rol = localStorage.getItem("rol");

export async function cargarSitios() {
  try {
    const res = await fetch(`${API_URL}/sitios`);
    const sitios = await res.json();

    const container = document.getElementById("sitiosContainer");
    container.innerHTML = "";

    sitios.forEach((sitio) => {
      const card = document.createElement("div");
      card.className = "col-md-4";

      let botones = "";

      if (rol === "visitante") {
        botones = `<a href="solicitudes.html?id=${sitio.id}" class="btn btn-success">Solicitar Ingreso</a>`;
      } else if (rol === "guardaparque") {
        botones = `<button class="btn btn-warning" onclick="editarSitio(${sitio.id})">✏️ Editar</button>`;
      }

      const imagenUrl = sitio.imagenes?.[0]
        ? `http://localhost:3000${sitio.imagenes[0]}`
        : `https://source.unsplash.com/400x250/?nature,${sitio.id}`;

      card.innerHTML = `
        <div class="card shadow-sm h-100">
          <img src="${imagenUrl}" class="card-img-top" alt="${sitio.nombre}" />
          <div class="card-body d-flex flex-column justify-content-between">
            <div>
              <h5 class="card-title">${sitio.nombre}</h5>
              <p class="card-text">${sitio.descripcion}</p>
              <p class="mb-1"><strong>Aforo:</strong> ${sitio.aforo_maximo ?? "N/D"}</p>
              <p class="mb-2"><strong>Estado:</strong> ${sitio.estado ?? "Desconocido"}</p>
            </div>
            <div class="d-grid gap-2">
              ${botones}
            </div>
          </div>
        </div>
      `;

      container.appendChild(card);
    });
  } catch (error) {
    console.error("Error al cargar sitios:", error);
  }
}

window.editarSitio = function (id) {
  window.location.href = `editarSitio.html?id=${id}`;
};
