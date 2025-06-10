const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../db.sqlite'),
  logging: false
});

const Ticket = sequelize.define('Ticket', {
  title:      { type: Sequelize.STRING, allowNull: false },
  description:{ type: Sequelize.TEXT },
  status:     { type: Sequelize.ENUM('open','in_progress','closed'), defaultValue: 'open' }
}, {
  timestamps: true // agrega createdAt y updatedAt
});

module.exports = { sequelize, Ticket };
