const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('Reserva', 'postgres', '12345', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false
});

module.exports = sequelize;
