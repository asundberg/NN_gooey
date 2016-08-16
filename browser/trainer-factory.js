'use strict';

app.factory('TrainerFactory', function ($http) {

    var TrainerFactory = {
      numInputs: 10,
      classType: null,
      inputArr: [],
      outputArr: []
    };

    TrainerFactory.setInputs = function (num) {
      this.numInputs = num;
    };

    TrainerFactory.getInputs = function () {
      return this.numInputs;
    };

    TrainerFactory.setClassType = function (classType) {
      this.classType = classType;
    };

    TrainerFactory.getClassType = function () {
      return this.classType;
    };

    TrainerFactory.setData = function(userInput){
      TrainerFactory.numInputs = userInput.numInputs;
      TrainerFactory.classType = userInput.classType;
      TrainerFactory.inputArr = userInput.input;
      TrainerFactory.outputArr = userInput.output;
    }

    return TrainerFactory;
});
