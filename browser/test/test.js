'use strict';

app.config(function ($stateProvider) {
  $stateProvider.state('test', {
    url: '/test',
    templateUrl: '/test/template.html',
    controller: 'TestCtrl'
  });
});

app.controller('TestCtrl', function ($scope) {

  // $scope.testInputs = function () {

  // };

  // $scope.testData = function () {

  // };


});
