'use strict';

app.config(function ($stateProvider) {
  $stateProvider.state('test', {
    url: '/test/:id',
    templateUrl: '/test/template.html',
    controller: 'TestCtrl'
    // resolve: {
    // 	sample: function($http, $stateParams){
    // 		return $http.get('/selections/'+$stateParams.id)
    // 		.then(sample => sample)
    // 	}
    // }
  });
});

//Retrieve Selections from Selections model 
app.controller('TestCtrl', function ($scope, $http, $stateParams) {
	$scope.sampleHeaders = ['col1', 'col2', 'col3', 'col4', 'col5', 'col6','col7','col8'];
	$scope.sampleRows = [[6,148,72,35,0,33.6,0.627,50],[1,85,66,29,0,26.6,0.351,31]];
	$scope.tabs = [{name: 'Single Input', url: "/test/single.html"},{name:'Multiple Input', url: '/test/multiple.html'}];
	
  	$scope.testInputs = {}

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
