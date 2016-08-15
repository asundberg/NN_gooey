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

  function HiddenLayer () {
    this.neurons = Array(30);
  }

  $scope.numInputs = inputs;

  $scope.hiddenLayers = [];

  $scope.trainNetwork = function () {
    $scope.greeting = 'The network is being trained!!!';
    // show some kind of 'loading' graphic
  };

  $scope.addLayers = function () {
    $scope.hiddenLayers.push(new HiddenLayer());
  };

  $scope.removeLayers = function () {
    if ($scope.hiddenLayers.length) {
      $scope.hiddenLayers.pop();
    }
  };

  // $scope.addNeurons = function () {

  // };

});
