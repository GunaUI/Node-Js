const Sequelize = require('sequelize');

const sequelizeConnector = new Sequelize('node-complete', 'root', 'CiscoBgl#6788', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelizeConnector;
