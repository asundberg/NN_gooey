'use strict';

app.factory('TrainerFactory', function ($http) {

    var TrainerFactory = {
      classType: null,
      inputArr: null,
      outputArr: null,
      headerReference: null
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

    TrainerFactory.train = function (dataObj) {
      console.log('The network is being trained! (Cool graphic is showing...)', TrainerFactory);
      return $http.post('/train', dataObj)
      .then(function (response) {
        var resultObj = response.data;
        return resultObj;
      });
    };

    return TrainerFactory;
});
