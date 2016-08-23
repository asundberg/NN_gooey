'use strict';

app.factory('TrainerFactory', function ($http) {

    var TrainerFactory = {
      classType: null,
      inputArr: null,
      outputArr: null,
      headerReference: null,
      hiddenLayersArr: [], // array of numbers, each indicating number of neurons in that layer
      selectionId: null
    };

    TrainerFactory.setData = function (data) {
      TrainerFactory.classType = data.classType;
      TrainerFactory.inputArr = data.inputArr;
      TrainerFactory.outputArr = data.outputArr;
      TrainerFactory.headerReference = data.headerReference;
      TrainerFactory.selectionId = data.selectionId
    };

    TrainerFactory.train = function () {
      return $http.post('/train', TrainerFactory)
      .then(function (response) {
        return response.data;
      });
    };

    TrainerFactory.getModel = function (id) {
      return $http.get('/train/' + id)
      .then(function (response) {
        return response.data;
      });
    };

    TrainerFactory.addUserId = function (id, data) {
      return $http.put('/train/' + id, data)
      .then(function (response) {
        return response.data;
      });
    };

    return TrainerFactory;
});
