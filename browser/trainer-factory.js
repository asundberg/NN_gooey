'use strict';

app.factory('TrainerFactory', function ($http) {

    var TrainerFactory = {
      classType: null,
      inputArr: null,
      outputArr: null,
      headerReference: null
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

    TrainerFactory.setData = function(data){
      TrainerFactory.classType = data.classType;
      TrainerFactory.inputArr = data.inputArr;
      TrainerFactory.outputArr = data.outputArr;
      TrainerFactory.headerReference = data.headerReference;
    }

    return TrainerFactory;
});
