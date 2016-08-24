'use strict';

app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.when('/test', '/test/:id/single');
    $stateProvider.state('test', {
        url: '/test/:id',
        templateUrl: '/test/template.html',
        controller: 'TestCtrl',
        resolve: {
         selection: function(TestingFactory, $stateParams){
                return TestingFactory.getSamples($stateParams.id)
                .then(foundSelection => foundSelection)
            }
        }
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
        controller: 'OutputCtrl'
    });
});


app.controller('TestCtrl', function($rootScope, $scope, $http, $stateParams, TestingFactory, $state, selection) {
    $rootScope.state = 'test';
    $state.go('test.single');
    // console.log("selection", selection);
    // console.log("rows", JSON.parse(selection.rows))
    $scope.selection = selection;

    $rootScope.homeButtonStatus();

    let modelId = $stateParams.id;

    $scope.receivedResult = false;

    // $scope.sampleHeaders = ['col1', 'col2', 'col3', 'col4', 'col5', 'col6', 'col7', 'col8'];
    // $scope.sampleRows = [
    //     [6, 148, 72, 35, 0, 33.6, 0.627, 50],
    //     [1, 85, 66, 29, 0, 26.6, 0.351, 31]
    // ];
    $scope.sampleHeaders = selection.headers;
    $scope.sampleRows = JSON.parse(selection.rows);

    $scope.tabs = [{ name: 'Single Input', url: "/test/single.html", state: 'test.single' }, { name: 'Multiple Input', url: '/test/multiple.html', state: 'test.multiple'  }];

    $scope.test = {}; //in case you need other properties

    //SOYBEAN SMALL TEST

    $scope.submit = function() {
        $scope.test.testType = (Array.isArray($scope.test.testInputs[0])) ? 'multiple' : 'single';
        console.log($scope.test)
        TestingFactory.test(modelId, $scope.test)
        .then(result => {
          $scope.outputs = result;
          $scope.receivedResult = true;
            var prettyPrint = prettyOutput($scope.sampleHeaders, $scope.test.testInputs, result[0]);
            exportToCsv("testResult.csv", prettyPrint)
            console.log('RESULT', $scope.outputs[0]);
        });
    }

    function prettyOutput(headers,inputs, outputs){
        console.log("sample headers", $scope.sampleHeaders)
        var finalHeaders = headers.slice();
        finalHeaders.push("Output");
        var prettyArr = [];
        prettyArr.push(finalHeaders);
        for(var i=0; i<inputs.length; i++){
            var inputCopy = inputs[i].slice();
            inputCopy.push(outputs[i].slice());
            prettyArr.push(inputCopy);
        }
        return prettyArr;
    }

    function exportToCsv(filename, rows) {
        var processRow = function (row) {
            var finalVal = '';
            for (var j = 0; j < row.length; j++) {
                var innerValue = row[j] === null ? '' : row[j].toString();
                if (row[j] instanceof Date) {
                    innerValue = row[j].toLocaleString();
                };
                var result = innerValue.replace(/"/g, '""');
                if (result.search(/("|,|\n)/g) >= 0)
                    result = '"' + result + '"';
                if (j > 0)
                    finalVal += ',';
                finalVal += result;
            }
            return finalVal + '\n';
        };

        var csvFile = '';
        for (var i = 0; i < rows.length; i++) {
            csvFile += processRow(rows[i]);
        }

        var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, filename);
        } else {
            var link = document.createElement("a");
            if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", filename);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }

});

app.controller('OutputCtrl', function($scope) {
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
            if(inputArr[0].length !== $scope.selection.numColumns){
                $scope.errorMessage = "ERROR: Mismatch number of input columns. You should have only " + $scope.selection.numColumns + " columns.";
                console.log($scope.errorMessage);
            }
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
});



app.factory('TestingFactory', function($http) {

    var TestingFactory = {};
    TestingFactory.setSamples = function(sampleObj){
        return $http.post('/test/selection', sampleObj)
        .then(res => res.data);
    }

    //for fetching the sample rows for inputs
    TestingFactory.getSamples = function(modelId){
       return $http.get('/test/selection/'+ modelId)
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
