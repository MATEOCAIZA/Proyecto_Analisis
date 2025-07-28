const API_URL = "http://localhost:3000/api";

const form = document.getElementById("loginForm");
const mensajeError = document.getElementById("mensajeError");

form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const usuario = form.usuario.value;
  const contrasena = form.contrasena.value;

  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, contrasena })
    });

    if (!res.ok) {
      const text = await res.text();
      mensajeError.textContent = text || "Error al iniciar sesión";
      mensajeError.classList.remove("d-none");
      return;
    }

    const data = await res.json();

    localStorage.setItem("token", data.token);
    localStorage.setItem("rol", data.rol);
    localStorage.setItem("usuario", JSON.stringify(data.usuario));

    window.location.href = "index.html";

  } catch (err) {
    mensajeError.textContent = "Error de conexión con el servidor.";
    mensajeError.classList.remove("d-none");
    console.error(err);
  }
});

const formRegistro = document.getElementById("registerForm");
const mensajeRegistro = document.getElementById("mensajeRegistro");

formRegistro?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(formRegistro);
  const data = Object.fromEntries(formData.entries());

  // Validaciones
  const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  const soloUsuario = /^[a-zA-Z0-9]{4,}$/;
  const soloNumeros = /^[0-9]{10}$/;
  const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!soloLetras.test(data.nombre)) {
    return mostrarError("El nombre solo debe contener letras y espacios.");
  }

  if (!soloLetras.test(data.apellido)) {
    return mostrarError("El apellido solo debe contener letras y espacios.");
  }

  if (!soloUsuario.test(data.usuario)) {
    return mostrarError("El usuario debe tener al menos 4 caracteres (letras o números).");
  }

  if (!correoValido.test(data.correo)) {
    return mostrarError("Ingrese un correo electrónico válido.");
  }

  if (!soloNumeros.test(data.contacto)) {
    return mostrarError("El contacto debe tener exactamente 10 dígitos numéricos.");
  }


  if (data.contrasena.length < 6) {
    return mostrarError("La contraseña debe tener al menos 6 caracteres.");
  }

  try {
    const res = await fetch(`${API_URL}/registro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const texto = await res.text();
      mensajeRegistro.textContent = texto || "Error al registrar usuario";
      mensajeRegistro.classList.remove("d-none");
      return;
    }

    alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
    window.location.href = "login.html";

  } catch (error) {
    mensajeRegistro.textContent = "Error de conexión con el servidor.";
    mensajeRegistro.classList.remove("d-none");
    console.error(error);
  }

  function mostrarError(msg) {
    mensajeRegistro.textContent = msg;
    mensajeRegistro.classList.remove("d-none");
  }
});
