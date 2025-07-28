const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const Sitio = sequelize.define('sitios_turisticos', {
  nombre: DataTypes.STRING,
  descripcion: DataTypes.STRING,
  aforo_maximo: DataTypes.INTEGER,
  estado: DataTypes.STRING,
  imagenes: DataTypes.ARRAY(DataTypes.STRING),
  id_guardaparque: DataTypes.INTEGER
}, { timestamps: false });

module.exports = Sitio;
