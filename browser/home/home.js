app.config(function($stateProvider) {
  $stateProvider.state('home', {
    url: '/home',
    templateUrl: '/home/home.html',
    controller: 'HomeCtrl'
  })
})
app.controller('HomeCtrl', function($scope, TrainerFactory, $state, $mdSidenav) {
  $scope.openRightMenu = function() {
    $mdSidenav('right').toggle();
  };
  $scope.letsGo = function() {
    $state.go('upload');
  }

})
