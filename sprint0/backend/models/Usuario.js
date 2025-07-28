const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const Usuario = sequelize.define('usuarios', {
  usuario: DataTypes.STRING,
  nombre: DataTypes.STRING,
  apellido: DataTypes.STRING,
  ci_pasaporte: DataTypes.STRING,
  nacionalidad: DataTypes.STRING,
  correo: DataTypes.STRING,
  contacto: DataTypes.STRING,
  contrasena: DataTypes.STRING,
  rol: DataTypes.STRING
}, { timestamps: false });

module.exports = Usuario;
