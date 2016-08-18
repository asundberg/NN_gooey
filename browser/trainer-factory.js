'use strict';

app.factory('TrainerFactory', function ($http) {

    var TrainerFactory = {
      classType: null,
      inputArr: null,
      outputArr: null,
      headerReference: null,
      hiddenLayersArr: [], // array of numbers, each indicating number of neurons in that layer
      resultObj: null
    };

    TrainerFactory.setData = function(data){
      TrainerFactory.classType = data.classType;
      TrainerFactory.inputArr = data.inputArr;
      TrainerFactory.outputArr = data.outputArr;
      TrainerFactory.headerReference = data.headerReference;
    }

    TrainerFactory.train = function () {
      console.log('The network is being trained! (Cool graphic is showing...)', TrainerFactory);
      return $http.post('/train', TrainerFactory)
      .then(function (response) {
        // this.resultObj = response.data;
        console.log("response",response.toString('utf8'))
      });
    };

    return TrainerFactory;
});
