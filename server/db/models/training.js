'use strict';

const db = require('../db');
const Sequelize = db.Sequelize;

//the sequelize 'Training' model will store the path names to the file
//of lib.json, config.json, and model.h5. The folder with these files
//are in a directory called "modelStuff"
//this is a much more elegant solution than trying to save model information in the database as a Sequelize.BLOB, which later makes our life harder when we want to load models in keras. i.e. keras expects a .h5 file than a .json of the contents of .h5 (.h5 stores the weights)
//
module.exports = db.define('training', {
  name: {
    type: Sequelize.STRING
  },
  config: {
    type: Sequelize.STRING
  },
  weights: {
    type: Sequelize.STRING
  },
  lib: {
    type: Sequelize.STRING
  }
});
