app.config(function ($stateProvider) {
  $stateProvider.state('home', {
    url: '/home',
    templateUrl: '/home/home.html',
    controller: 'HomeCtrl'
  })
})
app.controller('HomeCtrl', function ($rootScope, $scope, TrainerFactory, $state, $mdSidenav) {
  $rootScope.state = 'home';
  $rootScope.homeButtonStatus();
  $scope.openRightMenu = function () {
    $mdSidenav('right').toggle();
  };
  $scope.letsGo = function () {
    $state.go('upload');
  };

});
