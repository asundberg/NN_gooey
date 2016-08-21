'use strict';

const express = require('express');
const router = new express.Router();
const Training = require('./db/models').Training;

router.post('/train', function (req,res,next) {
  //put py spawn here
  var spawn = child_process.spawn;
  var py = spawn('python', ['server/main.py']);
  var modelStuffPath = path.join(__dirname, '../modelStuff');
  var trainingData = req.body;
  var input = trainingData.inputArr;
  var output = trainingData.outputArr;
  var classType = trainingData.classType;
  var hiddenLayer = trainingData.hiddenLayersArr;
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

  py.stdout.on('end', function () {
    console.log('ended');
    console.log(finalArr);

    let modelId = finalArr[0].modelId;
    let configPath = modelStuffPath + "/config/" +  modelId + "_config.json";
    let libPath = modelStuffPath + "/lib/" +  modelId + "_lib.json";
    let weightsPath = modelStuffPath + "/weights/" +  modelId + "_model.h5";

    Training.findById(modelId)
    .then(foundModel => {
      return foundModel.update({
        config: configPath,
        weights: weightsPath,
        lib: libPath
      })
    })
    .then(() => {
      res.send(finalArr);
      //res.send(finalArr[0].accuracy);
    })
    .catch(next);
  });


});

module.exports = router;
