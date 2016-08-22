'use strict';

// Require our models. Running each module registers the model into sequelize
// so any other part of the application could call sequelize.model('xxx')
// to get access to the xxx model.

const Training = require('./training');
const Selections = require('./selections');
const User = require('./user');

Training.belongsTo(User);
User.hasMany(Training);

Selections.belongsTo(User);
User.hasMany(Selections);

module.exports = {
  Training: Training,
  Selections: Selections,
  User: User
};
