'use strict';

// Require our models. Running each module registers the model into sequelize
// so any other part of the application could call sequelize.model('xxx')
// to get access to the xxx model.

const Training = require('./training');
const Selection = require('./selection');
const User = require('./user');

Training.belongsTo(User);
User.hasMany(Training);
Selection.belongsTo(Training);
Training.hasOne(Selection);


module.exports = {
  Training: Training,
  Selection: Selection,
  User: User
};
