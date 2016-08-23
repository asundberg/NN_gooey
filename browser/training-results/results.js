'use strict';

app.config(function ($stateProvider) {
  $stateProvider.state('results', {
    url: '/results',
    templateUrl: '/training-results/template.html',
    controller: 'ResultsCtrl',
    resolve: {
      trainResult: function (TrainerFactory){
        return TrainerFactory.train()
        .then(result => {
          return result;
        });
      }
    }
  });
});

app.controller('ResultsCtrl', function ($scope, TrainerFactory, trainResult, AuthService, $cookieStore, $state) {

  var cookieStoreItems = $cookieStore.get('view');

  if (trainResult) {
    $scope.view = {
      modelId: trainResult[0].modelId,
      accuracyGraph: trainResult[0].accuracy,
      maxAcc: Math.round(Math.max.apply(null,trainResult[0].accuracy) * 100),
      linkToTest: '#/test/' + trainResult[0].modelId
    };
    $scope.model = trainResult[0];
    $cookieStore.put('view', $scope.view);
  } else if (cookieStoreItems) {
    $scope.view = cookieStoreItems;
    TrainerFactory.getModel($scope.view.modelId)
    .then(function (response) {
      $scope.model = response;
    });
  }

  $scope.showResult = false;
  $scope.user = null;

  var setUser = function () {
    AuthService.getLoggedInUser().then(function (user) {
      $scope.user = user;
    });
  };

  setUser();

  if ($scope.view.accuracyGraph && $scope.view.accuracyGraph.length) {
    $scope.showResult = true;
  }

  // cookie store stuff:
  $scope.showSaveForm = false;
  $scope.showAlert = false;

  $scope.enterName = function () {
    $scope.showSaveForm = true;
  };

  function emptyModelStorage () {
    $scope.storage = {};
    $cookieStore.put('view', $scope.view);
  }

  $scope.dontSave = function () {
    $scope.showAlert = true;
    emptyModelStorage();
  };

  $scope.$on('resetStorage',function () {
      emptyModelStorage();
      $cookieStore.put('view', $scope.view);
  });

  //ADDING AND REMOVING ITEMS
  $scope.saveModel = function (model) {
    model.userId = $scope.user.id;
    console.log('userId: ', model.userId, 'model id: ', model.modelId);
    // Find out if model is already in the savedModelsArr that comes from the cookie.
    // The 'find' method returns the item it looks for from the array or undefined.
    TrainerFactory.addUserId(model.modelId, model)
    .then(function () {
      $state.go('user', {id: $scope.user.id});
    });
  };

  // graph stuff:
  var margin = {
    top: 30,
    right: 20,
    bottom: 30,
    left: 50
  };

  var width = 600 - margin.left - margin.right;
  var height = 350 - margin.top - margin.bottom;

  var x = d3.scaleLinear().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);

  var svg = d3.select('graph')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  var xAxis = d3.axisBottom().scale(x) // How frequent marks on x-axis
      .ticks(5);

  var yAxis = d3.axisLeft().scale(y) // How frequent marks on y-axis
      .ticks(5);

  var valueline = d3.line()
      .x(function (d) {
        return x(d.epoch);
      })
      .y(function (d) {
        return [y(d.accuracy)];
      });

  var data = [];

  function setData (dataArr) {
    for(var i = 0; i < dataArr.length; i++) {
      data.push({accuracy: dataArr[i], epoch: i * 5});
    }
  }

  setData($scope.view.accuracyGraph);

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

});
