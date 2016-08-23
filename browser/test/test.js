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
    $stateProvider.state('test.single', {
        url: '/single',
        templateUrl: '/test/single.html',
        controller: function($scope){
            $scope.test.testInputs = [];
        }
    });
    $stateProvider.state('test.multiple', {
        url: '/multiple',
        templateUrl: '/test/multiple.html',
        controller: function($scope){
            var fReader = new FileReader();
            var fileInput = document.getElementById('inputFile');
            var inputArr;
            fileInput.addEventListener('change', function(event){
                var file = event.target.files[0];
                fReader.addEventListener("loadend", function(event) {
                    $scope.uploaded = true;
                    var textFile = event.target.result;
                    var uploaded = textFile;
                    var delimiter = detectDelimiter(uploaded);
                    inputArr = uploaded.trim().split("\n").map(row=> row.split(delimiter).map(data=>Number(data)))
                    $scope.test.testInputs = [];
                    $scope.test.testInputs = inputArr;
                    $scope.displayInputRows = inputArr.slice(0,10);
                    $scope.$digest()
                })
                fReader.readAsText(file); //emits loadended event
            })
            $scope.upload = function () {
                fileInput.click();
            }
            function detectDelimiter(str) {
                var delimiters = [" ",",",";","\t"];
                var thisDelimiter = null;
                delimiters.forEach(function(delimiter) {
                  if(str.indexOf(delimiter) > -1) thisDelimiter = delimiter;
                })
                if(thisDelimiter) return thisDelimiter;
                else throw "Data is not properly delimited"
            }
        }
    });
});

app.controller('TestCtrl', function($rootScope, $scope, $http, $stateParams, TestingFactory, $state) {
    $rootScope.state = 'test';

    let modelId = $stateParams.id;
    console.log("modelId to test", modelId);

    $scope.receivedResult = false;

    $scope.sampleHeaders = ['col1', 'col2', 'col3', 'col4', 'col5', 'col6', 'col7', 'col8'];
    $scope.sampleRows = [
        [6, 148, 72, 35, 0, 33.6, 0.627, 50],
        [1, 85, 66, 29, 0, 26.6, 0.351, 31]
    ];
    $scope.tabs = [{ name: 'Single Input', url: "/test/single.html", state: 'test.single' }, { name: 'Multiple Input', url: '/test/multiple.html', state: 'test.multiple'  }];

    $scope.test = {}; //in case you need other properties

    //SOYBEAN SMALL TEST

    $scope.submit = function() {
        console.log($scope.test.testInputs)
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
