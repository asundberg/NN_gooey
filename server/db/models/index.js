'use strict';

// Require our models. Running each module registers the model into sequelize
// so any other part of the application could call sequelize.model('xxx')
// to get access to the xxx model.

const Training = require('./training');
const Selections = require('./selections');


module.exports = {
  Training: Training,
  Selections: Selections
};
