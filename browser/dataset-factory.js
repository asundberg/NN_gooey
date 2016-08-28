'use strict';

app.factory('DatasetFactory', function ($http) {

    var DatasetFactory = {};

    DatasetFactory.getDataset = function (dataset) {
      return $http.get('/datasets' + dataset)
      .then(function (response) {
        return response.data;
      });
    };

    return DatasetFactory;
});
