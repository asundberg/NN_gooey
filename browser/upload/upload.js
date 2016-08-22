app.config(function($stateProvider) {
  $stateProvider.state('upload', {
    url: '/upload',
    templateUrl: '/upload/upload.html',
    controller: 'UploadCtrl'
  })
})
app.controller('UploadCtrl', function($scope, TrainerFactory, $state, $timeout) {

  // VARIABLES
  $scope.headers = [];
  $scope.data = [];
  $scope.outputIndex;
  $scope.columnTracker = [];
  $scope.columnClass = "";
  //nghide if

  // EVENT LISTENERS
  var fReader = new FileReader();
  var fileInput = document.getElementById('files');
  fileInput.addEventListener('change', function(event){
    var file = event.target.files[0];
    fReader.addEventListener("loadend", function(event) {
      var textFile = event.target.result;
      var uploaded = textFile;
      convertToArr(uploaded);
      $scope.showData = true;
      $scope.$digest();
    })
    fReader.readAsText(file); //emits loadended event
  })

  $scope.upload = function () {
    $timeout(function() {
      console.log("triggering");
      console.log(angular.element(document.querySelector('#files')));
      console.log(document.getElementById('files'));
    fileInput.click();
    });
  }

  function convertToArr(str){
    var delimiter = detectDelimiter(str); // Detect delimiter
    var newArr = str.trim().split("\n").map(row=>{
      return row.split(delimiter)
    })
    if(hasHeaders(newArr)) {
      $scope.headers = newArr[0].slice();
      newArr.splice(0, 1);
    }
    else {
      for(var i = 1; i <= newArr[0].length; i++) {
        $scope.headers.push("Column " + i)
      }
    }
    var transposed = transpose(newArr);
    $scope.data = transposed;
    initColumns();
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

  function hasHeaders(arr) {
    if(!arr[0].length || !arr[1].length) throw "Dataset is too small"
    for(var i = 0; i < arr[0].length; i++) {
      if(isNaN(arr[0][i]) !== isNaN(arr[1][i])) {
        return true
      }
    }
    return false
  }

  // Checks array (column) for amount of data
  function getClassType(array) {
    var unique = [];
    array.forEach(function(element) {
      if(unique.indexOf(element) == -1) unique.push(element);
    })
    if(unique.length <= 2) return "binary";
    else return "multi_class";
  }

  function initColumns() {
    var numColumns = $scope.headers.length
    for(var i = 0; i < numColumns; i++) {
      $scope.columnTracker.push(1);
    }
    $scope.outputIndex = numColumns - 1;
    $scope.columnTracker[$scope.outputIndex] = 0;
  }

  function transpose(array) {
    if(!array[0].length) return [];
    var newArr = [];
    var element;
    for(var i = 0; i < array[0].length; i++) {
        newArr.push([]);
        for(var j = 0; j < array.length; j++) {
            element = array[j][i];
            if(!isNaN(element)) newArr[i].push(Number(element));
            else newArr[i].push(element);
        }
    }
    return newArr;
  }

  $scope.toggleInputCol = function(index) {
    if(!$scope.outputIndex) {
      $scope.outputIndex = index;
      $scope.columnTracker[index] = 0;
    }
    else {
      $scope.columnTracker[index] *= -1;
    }
  }
  $scope.toggleOutputCol = function() {
    $scope.columnTracker[$scope.outputIndex] = 1;
    $scope.outputIndex = null;
  }

  $scope.sendToBuilder = function() {
    var inputArr = [];
    var outputArr = [];
    var headerReference = {};
    var header;
    var classType;

    // Push into input and output arrays
    $scope.columnTracker.forEach(function(ele, index) {
      header = $scope.headers[index];
      if(ele == 1) {
        inputArr.push($scope.data[index]);
        headerReference[inputArr.length - 1] = header;
      }
      if(ele == 0) {
        outputArr.push($scope.data[index]);
        headerReference.output = header;
      }
    })
    inputArr = transpose(inputArr);
    outputArr = outputArr[0];
    //console.log("inputArrayFInal", outputArr);

    var obj = {
      classType: getClassType(outputArr),
      inputArr: inputArr,
      outputArr: outputArr,
      headerReference: headerReference
    }
    console.log(obj.classType);
    console.log("input", inputArr);
    console.log("output", outputArr);
    TrainerFactory.setData(obj);
    //console.log(obj);
    // console.log("INPUTARR", TrainerFactory);
    $state.go('state2')
  }

})