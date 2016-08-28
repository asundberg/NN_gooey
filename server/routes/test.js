'use strict';

const express = require('express');
const router = new express.Router();
var child_process = require('child_process');
var path = require('path');
const db = require('../db');
const Training = db.model('training');
const Selection = db.model('selection');

router.post('/selection', function(req,res,next){
  console.log("reached here", req.body);
  Selection.create(req.body)
  .then(createdSelection => {
    res.send(createdSelection);
  })
  .catch(next);
})

router.get('/selection/:id', function(req,res,next){
  Selection.findOne({
    where: {
      trainingId: req.params.id
    }
  })
  .then(foundSelection => {
    console.log("foundSelection", foundSelection);
    res.send(foundSelection);
  })
  .catch(next);
})

//test/:id
router.post('/:id', function(req,res,next){
  console.log("test route reached", req.body);
  var spawn = child_process.spawn;
  var py = spawn('python', ['server/mainPredict.py']);
  var inputTest = req.body.testInputs;
  // for pima
  //var inputs = [6,148,72,35,0,44.6,0.627,50]
  // for soybean
  // var inputs = [4, 0, 2, 1, 1, 1, 0, 1, 0, 2, 1, 1, 0, 2, 2, 0, 0, 0, 1, 0, 3, 1, 1, 1, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0];

  var tempTraining = {};
  tempTraining.testType = (Array.isArray(inputTest[0])) ? 'multiple' : 'single';
  console.log("inputTest", inputTest);
  console.log("testtype", tempTraining.testType);
  tempTraining.inputs  = inputTest; //once front end is fixed to have nec amount of columns
  //tempTraining.inputs = inputs;
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
