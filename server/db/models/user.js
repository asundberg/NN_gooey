'use strict';
// var crypto = require('crypto');
// var _ = require('lodash');
var Sequelize = require('sequelize');

var db = require('../db');

module.exports = db.define('user', {
  name:  {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
});
