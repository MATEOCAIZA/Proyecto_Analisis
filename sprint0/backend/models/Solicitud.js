const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const Solicitud = sequelize.define('solicitudes', {
  id_usuario: DataTypes.INTEGER,
  id_sitio: DataTypes.INTEGER,
  fecha_visita: DataTypes.DATEONLY,
  contacto_emergencia: DataTypes.STRING,
  tipo_visitante: DataTypes.STRING,
  estado: DataTypes.STRING,
  comentario_guardaparque: DataTypes.STRING
}, { timestamps: false });

module.exports = Solicitud;
