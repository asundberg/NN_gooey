'use strict';

app.config(function ($stateProvider) {
  $stateProvider.state('test', {
    url: '/test/:id',
    templateUrl: '/test/template.html',
    controller: 'TestCtrl'
  });
});

app.controller('TestCtrl', function ($scope, $http, $stateParams) {

  // $scope.testInputs = function () {

  // };

  // $scope.testData = function () {

  // };
  
  // for fetching the sample rows for inputs
  // $http.get('/selections/'+$stateParams.id)
  // .then(sampleInput=>{
  // 	$scope.sample = sampleInput
  // })

  $scope.test = function(){
  	$http.post('/test/'+$stateParams.id,{})
  	.then(res =>{
  		var response = res.data;
  		console.log(res.data);
  	})
  }

});
