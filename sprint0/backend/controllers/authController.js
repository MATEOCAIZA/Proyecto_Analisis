const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

exports.registro = async (req, res) => {
  const { usuario, nombre, apellido, ci_pasaporte, nacionalidad, correo, contacto, contrasena } = req.body;

  if (!usuario || !nombre || !apellido || !ci_pasaporte || !nacionalidad || !correo || !contacto || !contrasena) {
    return res.status(400).send("Todos los campos son obligatorios");
  }

  try {
    const hashedPass = await bcrypt.hash(contrasena, 10);

    await Usuario.create({
      usuario,
      nombre,
      apellido,
      ci_pasaporte,
      nacionalidad,
      correo,
      contacto,
      contrasena: hashedPass,
      rol: 'visitante'
    });

    res.status(201).send("Registrado correctamente como visitante");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al registrar usuario");
  }
};

exports.login = async (req, res) => {
  const { usuario, contrasena } = req.body;

  try {
    const user = await Usuario.findOne({ where: { usuario } });
    if (!user) return res.status(401).send("Usuario no encontrado");

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
