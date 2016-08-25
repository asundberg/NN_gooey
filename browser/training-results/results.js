'use strict';

app.config(function ($stateProvider) {
  $stateProvider.state('results', {
    url: '/results',
    templateUrl: '/training-results/template.html',
    controller: 'ResultsCtrl'
  });
});

app.controller('ResultsCtrl', function ($rootScope, $scope, TrainerFactory, AuthService, $cookieStore, $state) {
  $rootScope.state = 'results';
  $rootScope.homeButtonStatus();
  var cookieStoreItems = $cookieStore.get('view');
  var data = [];
  if (cookieStoreItems) {
    $scope.view = cookieStoreItems;
    TrainerFactory.getModel($scope.view.modelId)
    .then(function (response) {
      $scope.model = response;
      setPage();
    })
  } else {
    TrainerFactory.train()
    .then(trainResult => {
      $scope.view = {
        modelId: trainResult[0].modelId,
        accuracyGraph: trainResult[0].accuracy,
        maxAcc: Math.round(Math.max.apply(null,trainResult[0].accuracy) * 100),
        linkToTest: '#/test/' + trainResult[0].modelId,
      };
      $scope.model = trainResult[0];
      $cookieStore.put('view', $scope.view);
      $scope.view.predicted = trainResult[0].predicted;
      setPage();
    });
  }

  function setPage() {
      setResults();
      drawClassCircles();
      console.log(TrainerFactory);
      console.log(TrainerFactory.headerReference)
      $scope.currentSample = null;
      $scope.headerReference = TrainerFactory.headerReference;
      $scope.headerKeys = Object.keys($scope.headerReference);
      $scope.outputIndex = $scope.headerKeys.length - 1;
      $scope.inputArr = TrainerFactory.inputArr;
      $scope.outputArr = TrainerFactory.outputArr;
  }

  function setResults () {
    if ($scope.view.accuracyGraph && $scope.view.accuracyGraph.length) {
      $scope.showResult = true;

    }
    setData($scope.view.accuracyGraph);
  }

  $scope.showResult = false;
  $scope.user = null;

  var setUser = function () {
    AuthService.getLoggedInUser().then(function (user) {
      $scope.user = user;
    });
  };

  setUser();

  // cookie store stuff:
  $scope.showSaveForm = false;
  $scope.showAlert = false;

  $scope.enterName = function () {
    $scope.showSaveForm = true;
  };

  function clearView () {
    $scope.view = {};
    $cookieStore.put('view', undefined);
  }

  $scope.dontSave = function () {
    $scope.showAlert = true;
    clearView();
  };

  $scope.$on('resetCookie', clearView);

  //ADDING AND REMOVING ITEMS
  $scope.saveModel = function (model) {
    model.userId = $scope.user.id;
    // Find out if model is already in the savedModelsArr that comes from the cookie.
    // The 'find' method returns the item it looks for from the array or undefined.
    TrainerFactory.addUserId(model.modelId, model)
    .then(function () {
      $state.go('user', {id: $scope.user.id});
    });
  };

  // graph stuff:
  function setData (dataArr) {
    for(var i = 0; i < dataArr.length; i++) {
      data.push({accuracy: dataArr[i], epoch: i * 5});
    }
    var margin = {
      top: 30,
      right: 20,
      bottom: 30,
      left: 50
    };

    var width = 600 - margin.left - margin.right;
    var height = 350 - margin.top - margin.bottom;

    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().domain([0, 1]).range([height, 0]);

    var svg = d3.select('graph')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var xAxis = d3.axisBottom().scale(x) // How frequent marks on x-axis
        .ticks(5);

    var yAxis = d3.axisLeft().scale(y) // How frequent marks on y-axis
        .ticks(10);

    var valueline = d3.line()
        .x(function (d) {
          return x(d.epoch);
        })
        .y(function (d) {
          return [y(d.accuracy)];
      });
    // Scale the range of the data
    x.domain(d3.extent(data, function (d) {
      return d.epoch;
    }));
    y.domain([0, d3.max(data, function (d) {
      return d.accuracy;
    })]);

    svg.append('path') // Add the valueline path.
    .attr('d', valueline(data));

    svg.append('g') // Add the X Axis
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis);

    svg.append('g') // Add the Y Axis
    .attr('class', 'y axis')
    .call(yAxis);
  }


  // circle stuff:
  function classifier () {
    var classes = $scope.view.predicted;
    // var classes = [1, 1, 2, 1, 5, 4, 4, 3, 2, 3, 4, 5]
    var classified = {};
    classes.forEach(function(yClass, index) {
      if(!classified[yClass]) classified[yClass] = [];
      classified[yClass].push(index)
    });
    $scope.allClasses = classified;
  }

  function drawClassCircles() {
    classifier();
    $scope.allClassesArr = Object.keys($scope.allClasses);
    var numClasses = $scope.allClassesArr.length;
    var bigRadius = 150;
    var lilRadius = 5;
    var width = bigRadius * 2 * numClasses;
    var height = 400;

    var colors = ['66CD00', 'FF7F50', 'FFB90F', 'FF69B4', 'E066FF'];

    var bigCircles = [];
    var smallCircles = [];

    function drawBigCircles (numClasses) {
      var colorIndex = 0;
      var circle;
      for(var i = 0; i < numClasses; i++) {
        if (i >= colors.length) {
          colorIndex = 0;
        }
        circle = { "x_axis": bigRadius + (bigRadius * 2 * i), "y_axis": height / 2 + 50, "radius": bigRadius, "color" : colors[colorIndex] };
        bigCircles.push(circle);
        colorIndex++;
      }
    }

    function drawSmallCircles (allClasses) {
      var circle, point, i = 0;
      for(var key in allClasses) {
        allClasses[key].forEach(function (sampleIndex) {
          point = randomPoint(bigRadius);
          point.x += bigRadius + (bigRadius * 2 * i);

          point.y += height / 2 + 50;
          circle = { "x_axis": point.x, "y_axis": point.y, "radius": lilRadius, "color" : "848484", sampleIndex: sampleIndex };
          smallCircles.push(circle);
        })
        i++;
      }
    }

    function randomPoint(radius) {
      var point = {};
      var angle = Math.random()*Math.PI*2;
      point.x = Math.random(0, 1)*Math.cos(angle)*radius*0.9;
      point.y = Math.random(0, 1)*Math.sin(angle)*radius*0.9;
      return point;
    }

    drawBigCircles(numClasses);
    drawSmallCircles($scope.allClasses);

    var canvas = d3.select("#circles")
          .append("svg")
          .attr("width", width)
          .attr("height", height);
    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .html(function(d) { return "sample #" + d.sampleIndex; })
    canvas.call(tip);

    var headers = canvas.append("g")
          .attr("class", "result-headers")
          .selectAll("text")
          .data($scope.allClassesArr)
          .enter()
          .append("text")
          .text(function (d) { return d; })
          .data(bigCircles)
          .attr("class", "result-header")
          .attr("x", function (d) { return d.x_axis; })
          .attr("y", "50")
          .attr("text-anchor", "middle");

    var yClass = canvas.append("g")
          .attr("class", "yClass");

    var yCircles = yClass.selectAll("circle")
          .data(bigCircles)
          .enter()
          .append("circle");

    var yCircleAttributes = yCircles
         .attr("cx", function (d) { return d.x_axis; })
         .attr("cy", function (d) { return d.y_axis; })
         .attr("r", function (d) { return d.radius; })
         .style("fill", function(d) { return d.color; });

    var sample = canvas.append("g")
                  .attr("class", "sample");
    var samples = sample.selectAll("circle")
                  .data(smallCircles)
                  .enter()
                  .append("circle");

    var sampleAttributes = samples
           .attr("cx", function (d) { return d.x_axis; })
           .attr("cy", function (d) { return d.y_axis; })
           .attr("r", function (d) { return d.radius; })
           .attr("value", function(d) {return d.sampleIndex})
           .style("fill", function(d) { return d.color; })
           .on('click', function(d) { onSampleClick(d.sampleIndex)});

    var mouseover = sampleAttributes
           .on('mouseover', tip.show)
           .on('mouseout', tip.hide);

  }

  function onSampleClick(sample) {
    $scope.currentSample = sample;
    $scope.$digest();
    console.log("sample", sample);
  }

});
