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

  $scope.numInputs = function(){
    let numInputsArray = [];
    for (var i = 0; i < inputs; i++) {
      numInputsArray.push(i);
    }
    return numInputsArray;
  };

  console.log($scope.numInputs());

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

  $scope.addNeurons = function (index) {
    $scope.hiddenLayers[index].addToNeurons();
  };

  $scope.removeNeurons = function (index) {
    $scope.hiddenLayers[index].removeFromNeurons();
  };

  function initializeHidden(){
    $scope.addLayers();
    console.log($scope.hiddenLayers);
    var network = d3.select("#network");
    //input layer

    //hidden layers
    network
    .selectAll("div")
    .data($scope.hiddenLayers[0].neurons)
    .enter()
    .append("div")
    .attr("id", function(d){
      console.log("d",d);
      return "canvas-"+d.id;
    })
    .attr("class", "canvas")
    .style("position", "absolute")
    .style("left", "300px")
    .style("top", function(d,i){
      return i * 55 + 3 + "px";
    })
    .html('<div style="width: 30px; height: 30px; position: relative; top: 0px; left: 0px;">'
            + '<canvas width="10" height="10" style="width: 30px; height: 30px; position: absolute; top: 0px; left: 0px;"></canvas>'
        +'</div>')



    //add neurons plus minus buttons
    network
    .data($scope.hiddenLayers)
    .append("div")
    .attr("class", "plus-minus-neurons")
    .style("left", function(d,i){
      console.log("i here", i);
      return 285 * (i+1) + "px";
    })
    .html('<div class="ui-numNodes1">'
            +'<button class="mdl-button mdl-js-button mdl-button--icon"><i class="material-icons">add</i></button>'
            +'<button class="mdl-button mdl-js-button mdl-button--icon"><i class="material-icons">remove</i></button>'
        +'</div>')
    .append("div")
    .text(function(d){
      return d.neurons.length + " neurons";
    })
        //+'<div class="numNeuronsLabel">5 neurons</div>')

    console.log("network", network);



  }

  initializeHidden();

});
