const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const Participante = sequelize.define('participantes', {
  id_solicitud: DataTypes.INTEGER,
  nombre: DataTypes.STRING,
  edad: DataTypes.INTEGER,
  ci_pasaporte: DataTypes.STRING,
  ciudad: DataTypes.STRING,
  es_lider: DataTypes.BOOLEAN,
  documento_consentimiento: DataTypes.STRING
}, { timestamps: false });

module.exports = Participante;
