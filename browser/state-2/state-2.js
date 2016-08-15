'use strict';

app.config(function ($stateProvider) {

  $stateProvider.state('state2', {
    url: '/train',
    templateUrl: '/state-2/template.html',
    controller: 'State2Ctrl',
    resolve: {
      inputs: function (TrainerFactory) {
        return TrainerFactory.getInputs();
      }
    }
  });
});

app.controller('State2Ctrl', function ($scope, TrainerFactory, inputs) {

  d3.selectAll("p").style("color", "blue");

  $scope.numInputs = inputs;

  $scope.hiddenLayers = 1;

  $scope.trainNetwork = function () {
    $scope.greeting = 'The network is being trained!!!';
  };

  $scope.addLayers = function () {
    $scope.hiddenLayers++;
  };

  $scope.removeLayers = function () {
    if ($scope.hiddenLayers >= 0) {
      $scope.hiddenLayers--;
    }
  };

});
