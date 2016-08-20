'use strict';
const db = require('./db');

// Require our models. Running each module registers the model into sequelize
// so any other part of the application can simply call sequelize.model('User')
// to get access to the User model.
require('./models');

// Syncing all the models at once.
var syncedDbPromise = db.sync(); 
// {force: true}

syncedDbPromise.then(function () {
  console.log('Sequelize models synced to PostgreSQL');
});

module.exports = syncedDbPromise;
