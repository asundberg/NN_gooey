app.config(function($stateProvider) {
  $stateProvider.state('upload', {
    url: '/upload',
    templateUrl: '/upload/upload.html',
    controller: 'UploadCtrl'
  })
})
app.controller('UploadCtrl', function($scope) {
  var fReader = new FileReader();
  var fileInput = document.getElementById('files');
  fileInput.addEventListener('change', function(event){
    var file = event.target.files[0];
    fReader.addEventListener("loadend", function(event) {
      var textFile = event.target.result;
      console.log(textFile);
      $scope.upload.file = textFile;
    })
    fReader.readAsText(file); //emits loadended event
  })

  $scope.uploadData = function() {
    var uploaded = $scope.upload;
    convertToArr(uploaded.file, uploaded.delimiter);
    $scope.showData = true;
  }

  $scope.headers = [];
  // For input section
  $scope.inputData = [];

  function convertToArr(str, delimiter){
    if(delimiter == "Space") delimiter = " ";
    var newArr = str.split("\n").map(row=>{
      return row.split(delimiter)
    })
    if($scope.upload.headers==='yes') {
      $scope.headers = newArr[0].slice();
      newArr.splice(0, 1);
    }
    else {
      for(var i = 1; i <= newArr[0].length; i++) {
        $scope.headers.push("Column " + i)
      }
    }
    var transposed = transpose(newArr);
    $scope.inputData = transposed.slice(0, -1);
    $scope.outputData = transposed[transposed.length-1];
  }

  function transpose(array) {
    if(!array.length) return [];
    var newArr = []
    for(var i = 0; i < array[0].length; i++) {
        newArr.push([]);
        for(var j = 0; j < array.length; j++) {
            newArr[i].push(array[j][i]);
        }
    }
    return newArr;
  }

  $scope.toggleInputCol = function(index) {
    console.log(index);
  }


})
