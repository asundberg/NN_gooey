'use strict';

const express = require('express');
const router = new express.Router();
var child_process = require('child_process');
var path = require('path');
const Training = require('../db/models').Training;
const Selection = require('../db/models').Selection;


//for /train
router.post('/', function (req,res,next) {
  //put py spawn here

  var spawn = child_process.spawn;
  var py = spawn('python', ['server/main.py']);

  var modelStuffPath = path.join(__dirname, '../../modelStuff');
  var trainingData = req.body;
  var input = trainingData.inputArr;
  var output = trainingData.outputArr;
  var classType = trainingData.classType;
  var hiddenLayer = trainingData.hiddenLayersArr;
  var selectionId = trainingData.selectionId;
  console.log("selectionId", selectionId);
  var data;

  Training.create({})
  .then(newModel =>{
    data = {
      classType: classType,
      input: input,
      output: output,
      hiddenLayer: hiddenLayer,
      modelStuffPath: modelStuffPath,
      modelId: newModel.id
    }

    py.stdin.write(JSON.stringify(data));
    // py.stdin.write(JSON.stringify({'data':[1,2,3,4]}));
    py.stdin.end();

  })
  .catch(next);

  // var data = [input, output];
  var finalArr = [];


  py.stdout.on('data', function (data) {
    finalArr.push(JSON.parse(data));
  });

  py.stderr.on('data', function(data) {
    console.log('stdout: ' + data);
  });

  py.stdout.on('end', function () {
    console.log('ended');
    console.log(finalArr);

    let modelId = finalArr[0].modelId;
    let configPath = modelStuffPath + "/config/" +  modelId + "_config.json";
    let libPath = modelStuffPath + "/lib/" +  modelId + "_lib.json";
    let weightsPath = modelStuffPath + "/weights/" +  modelId + "_model.h5";


    Selection.findById(selectionId)
    .then(foundSelection => {
      return foundSelection.update({
        where: {
          trainingId: modelId
        }
      })
    })

    var promise1 = Training.findById(modelId);
    var promise2 = Selection.findById(selectionId);

    Promise.all([promise1, promise2])
    .then(arr => {
      return [arr[0], arr[1].setTraining(arr[0])]
    })
    .then(arr => {
      return arr[0].update({
        config: configPath,
        weights: weightsPath,
        lib: libPath
      })
    })
    .then(() => {
      res.send(finalArr);
    })

  });


});

module.exports = router;
