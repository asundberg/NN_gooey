'use strict';

const express = require('express');
const router = new express.Router();
var child_process = require('child_process');
var path = require('path');
const Training = require('../db/models').Training;
const Selection = require('../db/models').Selection;

//test/:id
router.post('/:id', function(req,res,next){
  console.log("test route reached", req.body);
  var spawn = child_process.spawn;
  var py = spawn('python', ['server/mainPredict.py']);
  var inputTest = req.body.testInputs;
  // for pima
  //var inputs = [6,148,72,35,0,44.6,0.627,50]
  // for soybean
  var inputs = [4, 0, 2, 1, 1, 1, 0, 1, 0, 2, 1, 1, 0, 2, 2, 0, 0, 0, 1, 0, 3, 1, 1, 1, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0];

  var tempTraining = {};
  tempTraining.testType = (Array.isArray(inputTest[0])) ? 'multiple' : 'single';

  console.log("testtype", tempTraining.testType);
  //tempTraining.inputs  = inputTest; //once front end is fixed to have nec amount of columns
  tempTraining.inputs = inputs;
  var modelId = req.params.id;

  Training.findById(modelId)
  .then(foundTraining => {
    tempTraining.config = foundTraining.config;
    tempTraining.weights = foundTraining.weights;
    tempTraining.lib = foundTraining.lib;
    console.log("temptraining: ", tempTraining);
    py.stdin.write(JSON.stringify(tempTraining));
    py.stdin.end();
  })
  .catch(next)

  var predictedOutputs = [];
  py.stdout.on('data', function (data) {
    predictedOutputs.push(JSON.parse(data));
  });

  py.stderr.on('data', function(data) {
    console.log('stdout: ' + data);
  });

  py.stdout.on('end', function () {
    console.log("ended")
    console.log(predictedOutputs)
    res.send(predictedOutputs)
  });

})

module.exports = router;
