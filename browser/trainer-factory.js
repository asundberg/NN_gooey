'use strict';

app.factory('TrainerFactory', function ($http) {

    var TrainerFactory = {
      numInputs: 10,
      classType: null,
      inputArr: [],
      outputArr: [],
      hiddenLayersArr: []
    };

    TrainerFactory.setData = function (userInput){
      TrainerFactory.numInputs = userInput.numInputs;
      TrainerFactory.classType = userInput.classType;
      TrainerFactory.inputArr = userInput.input;
      TrainerFactory.outputArr = userInput.output;
    };

    TrainerFactory.getData = function () {
      return TrainerFactory;
    };

    TrainerFactory.train = function (dataObj) {
      console.log('The network is being trained! (Cool graphic is showing...)');
      return $http.post('/train', dataObj)
      .then(function (response) {
        var resultObj = response.data;
        return resultObj;
      });
    };

    return TrainerFactory;
});
