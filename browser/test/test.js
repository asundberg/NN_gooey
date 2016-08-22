'use strict';

app.config(function($stateProvider) {
    $stateProvider.state('test', {
        url: '/test/:id',
        templateUrl: '/test/template.html',
        controller: 'TestCtrl'
            // resolve: {
            //  sample: function(TestingFactory, $stateParams){
            //    return TestingFactory.getSamples($stateParams.id)
            //    .then(sampleInput => sampleInput)
            // }
    });
});

app.controller('TestCtrl', function($scope, $http, $stateParams, TestingFactory) {

    let modelId = $stateParams.id;
    console.log("modelId to test", modelId);

    $scope.receivedResult = false;

    //will happen on the resolve
    // TestingFactory.getSamples($stateParams.id)
    // .then(sampleInput => {
    //   $scope.sample = sampleInput;
    //   console.log("sample input", $scope.sample);
    // })

    $scope.sampleHeaders = ['col1', 'col2', 'col3', 'col4', 'col5', 'col6', 'col7', 'col8'];
    $scope.sampleRows = [
        [6, 148, 72, 35, 0, 33.6, 0.627, 50],
        [1, 85, 66, 29, 0, 26.6, 0.351, 31]
    ];
    $scope.tabs = [{ name: 'Single Input', url: "/test/single.html" }, { name: 'Multiple Input', url: '/test/multiple.html' }];

    $scope.test = {}; //in case you need other properties

    //SOYBEAN SMALL TEST
    $scope.test.testInputs = [];

    $scope.submit = function() {
        console.log("testInputs", $scope.test.testInputs)

        TestingFactory.test(modelId, $scope.test)
        .then(result => {
          $scope.outputs = result;
          $scope.receivedResult = true;
          console.log('RESULT', $scope.outputs);
        });
    }

});



app.factory('TestingFactory', function($http) {

    var TestingFactory = {};

    //for fetching the sample rows for inputs
    TestingFactory.getSamples = function(id){
       return $http.get('/selection/'+ id)
      .then(res => res.data);
    }

    TestingFactory.test = function(modelId, test) {
      return $http.post('/test/' + modelId, test)
      .then(res => {
          console.log("res.data",res.data)
          return res.data;
      });
    }

    return TestingFactory;
});
