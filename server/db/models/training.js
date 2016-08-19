'use strict';

const db = require('../db');
const Sequelize = db.Sequelize;

module.exports = db.define('training', {
  config: {
    type: Sequelize.BLOB
  },
  weights: {
    type: Sequelize.BLOB
  },
  lib: {
    type: Sequelize.BLOB
  }
});
