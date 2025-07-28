const sequelize = require('./sequelize');
const Usuario = require('./Usuario');
const Sitio = require('./Sitio');
const Solicitud = require('./Solicitud');
const Participante = require('./Participante');

// Relaciones
Usuario.hasMany(Solicitud, { foreignKey: 'id_usuario' });
Solicitud.belongsTo(Usuario, { foreignKey: 'id_usuario' });

Sitio.hasMany(Solicitud, { foreignKey: 'id_sitio' });
Solicitud.belongsTo(Sitio, { foreignKey: 'id_sitio' });

Solicitud.hasMany(Participante, { foreignKey: 'id_solicitud' });
Participante.belongsTo(Solicitud, { foreignKey: 'id_solicitud' });

module.exports = {
  sequelize,
  Usuario,
  Sitio,
  Solicitud,
  Participante
};
