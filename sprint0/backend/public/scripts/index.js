import { cargarSitios } from './sitios.js';

const rol = localStorage.getItem("rol");
const usuario = JSON.parse(localStorage.getItem("usuario"));

const loginBtn = document.getElementById("btnLogin");
const registerBtn = document.getElementById("btnRegister");
const userDropdown = document.getElementById("userDropdown");
const userName = document.getElementById("userName");
const userOptions = document.getElementById("userOptions");

if (rol && usuario?.nombre) {
  // Ocultar botones de login/registro
  loginBtn?.classList.add("d-none");
  registerBtn?.classList.add("d-none");

  // Mostrar dropdown y nombre
  userDropdown?.classList.remove("d-none");
  userName.textContent = usuario.nombre;

  // Construir opciones según el rol
  if (rol === "visitante") {
    userOptions.innerHTML = `
      <li><a class="dropdown-item" href="#">Actualizar Perfil</a></li>
      <li><a class="dropdown-item" href="#">Solicitudes</a></li>
      <li><hr class="dropdown-divider"></li>
      <li><a class="dropdown-item text-danger" href="#" onclick="cerrarSesion()">Cerrar Sesión</a></li>
    `;
  } else if (rol === "guardaparque") {
    userOptions.innerHTML = `
      <li><a class="dropdown-item" href="gestionarSolicitudes.html">Gestionar Solicitudes</a></li>
      <li><a class="dropdown-item" href="reporte.html">Reportes</a></li>
      <li><hr class="dropdown-divider"></li>
      <li><a class="dropdown-item text-danger" href="#" onclick="cerrarSesion()">Cerrar Sesión</a></li>
    `;
  }
}

// Función global para cerrar sesión
window.cerrarSesion = function () {
  localStorage.clear();
  window.location.href = "index.html";
};

// Cargar los sitios turísticos
cargarSitios();
