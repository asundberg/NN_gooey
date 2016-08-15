'use strict';

app.factory('TrainerFactory', function ($http) {

    var TrainerFactory = {
      numInputs: 10,
      classType: null
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

    return TrainerFactory;
});
