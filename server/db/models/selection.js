'use strict';

const db = require('../db');
const Sequelize = db.Sequelize;

module.exports = db.define('selection', {
  headers: {
    type: Sequelize.ARRAY(Sequelize.STRING),
    defaultValue: []
  },
  rows: {
    type: Sequelize.JSON // array of arrays
  },
  numColumns: {
    type: Sequelize.INTEGER
  }
});
