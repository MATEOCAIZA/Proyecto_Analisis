const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db/connection');

exports.registro = async (req, res) => {
  const {
    usuario,
    nombre,
    apellido,
    ci_pasaporte,
    nacionalidad,
    correo,
    contacto,
    contrasena
  } = req.body;

  if (!usuario || !nombre || !apellido || !ci_pasaporte || !nacionalidad || !correo || !contacto || !contrasena) {
    return res.status(400).send("Todos los campos son obligatorios");
  }

  try {
    const hashedPass = await bcrypt.hash(contrasena, 10);
    const rol = 'visitante'; // se asigna automáticamente

    await pool.query(
      "INSERT INTO usuarios(usuario, nombre, apellido, ci_pasaporte, nacionalidad, correo, contacto, contrasena, rol) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
      [usuario, nombre, apellido, ci_pasaporte, nacionalidad, correo, contacto, hashedPass, rol]
    );

    res.status(201).send("Registrado correctamente como visitante");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al registrar usuario");
  }
};

exports.login = async (req, res) => {
  const { usuario, contrasena } = req.body;

  try {
    const result = await pool.query("SELECT * FROM usuarios WHERE usuario = $1", [usuario]);
    if (result.rows.length === 0) return res.status(401).send("Usuario no encontrado");

    const user = result.rows[0];
    const valido = await bcrypt.compare(contrasena, user.contrasena);
    if (!valido) return res.status(403).send("Contraseña incorrecta");

    const token = jwt.sign({ id: user.id, rol: user.rol }, "secreto", { expiresIn: "1h" });
    res.json({
      token,
      rol: user.rol,
      usuario: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        rol: user.rol
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al iniciar sesión");
  }
};
