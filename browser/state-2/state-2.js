'use strict';

app.config(function ($stateProvider) {

  $stateProvider.state('state2', {
    url: '/train',
    templateUrl: '/state-2/template.html',
    controller: 'State2Ctrl'
  });
});

app.controller('State2Ctrl', function ($scope, TrainerFactory) {

  d3.selectAll("p").style("color", "blue");

  function Neuron (id) {
    this.id = id;
  }

  function HiddenLayer () {
    this.neurons = [];
    for(var i = 1; i < 6; i++) {
      this.neurons.push(new Neuron(i));
    }
  }

  HiddenLayer.prototype.addToNeurons = function () {
    this.neurons.push(new Neuron(this.neurons.length + 1));
  };

  HiddenLayer.prototype.removeFromNeurons = function () {
    this.neurons.pop();
  };

  $scope.hiddenLayers = [];


  $scope.trainNetwork = function () {
    var finalArr = [];
    $scope.hiddenLayers.forEach(function (layer) {
      finalArr.push(layer.neurons.length);
    });
    TrainerFactory.hiddenLayersArr = finalArr;
    TrainerFactory.train(TrainerFactory);
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

  $scope.addNeurons = function (index) {
    $scope.hiddenLayers[index].addToNeurons();
  };

  $scope.removeNeurons = function (index) {
    $scope.hiddenLayers[index].removeFromNeurons();
  };

});
