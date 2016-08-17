'use strict';

app.config(function ($stateProvider) {
  $stateProvider.state('results', {
    url: '/results',
    templateUrl: '/training-results/template.html',
    controller: 'ResultsCtrl'
  });
});

app.controller('ResultsCtrl', function ($scope) {

  // example:
  $scope.accuracyGraph = [0.75, 0.80, 0.81, 0.85, 0.88, 0.90, 0.92, 0.93, 0.94, 0.95, 0.99];
  $scope.lossGraph = [1.1, 0.95, 0.8, 0.65, 0.5, 0.46, 0.33, 0.3, 0.29, 0.25, 0.15];

  var margin = {
    top: 30,
    right: 20,
    bottom: 30,
    left: 50
  };

  var width = 600 - margin.left - margin.right;
  var height = 270 - margin.top - margin.bottom;

  // var parseDate = d3.time.format("%d-%b-%y").parse;

  var x = d3.time.scale().range([0, width]);
  var y = d3.scale.linear().range([height, 0]);

  var xAxis = d3.svg.axis().scale(x)
      .orient("bottom").ticks(5);

  var yAxis = d3.svg.axis().scale(y)
      .orient("left").ticks(5);

  var valueline = d3.svg.line()
      .x(function (d) {
        return x(d.epoch);
      })
      .y(function (d) {
        return y(d.accuracy);
      });

  var svg = d3.select("body")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var data = [];

  function setData (dataArr) {
    for(var i = 0; i < dataArr.length; i++) {
      data.push({accuracy: dataArr[i], epoch: i});
    }
  }

  setData($scope.accuracyGraph);

  // Scale the range of the data
  x.domain(d3.extent(data, function (d) {
    return d.epoch;
  }));
  y.domain([0, d3.max(data, function (d) {
    return d.accuracy;
  })]);

  svg.append("path") // Add the valueline path.
  .attr("d", valueline(data));

  svg.append("g") // Add the X Axis
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis);

  svg.append("g") // Add the Y Axis
  .attr("class", "y axis")
  .call(yAxis);

});
