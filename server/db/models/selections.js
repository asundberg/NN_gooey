'use strict';

const db = require('../db');
const Sequelize = db.Sequelize;

module.exports = db.define('selections', {
  headers: {
    type: Sequelize.ARRAY(Sequelize.STRING)
  },
  rows: {
    type: Sequelize.BLOB // array of arrays
  }
});
