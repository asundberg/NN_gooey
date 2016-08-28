// 'use strict';
// const Sequelize = require('sequelize');
// const path = require('path');
// const DATABASE_URI = require(path.join(__dirname, '../env')).DATABASE_URI;

// console.log('Opening connection to PostgreSQL');

// // create the database instance
// module.exports = new Sequelize(DATABASE_URI, {
//   logging: false, // set to console.log to see the raw SQL queries
//   native: true // lets Sequelize know we can use pg-native for ~30% more speed
// });

var path = require('path');
var Sequelize = require('sequelize');

var env = require(path.join(__dirname, '../env'));
//change to URL when deploying with Heroku:
// var db = new Sequelize(env.DATABASE_URL, { logging: env.LOGGING });
var db = new Sequelize(env.DATABASE_URI, { logging: false, native: true });

module.exports = db;
