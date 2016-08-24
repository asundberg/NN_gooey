'use strict';

app.config(function ($stateProvider) {
    $stateProvider.state('login', {
        url: '/user/login',
        templateUrl: '/user/login.html',
        controller: 'LoginCtrl'
    });
});

app.controller('LoginCtrl', function ($rootScope,$scope, UserFactory, AuthService, $state) {

  $rootScope.state = 'login';
  $rootScope.homeButtonStatus();
  $scope.userInfo = {};
  $scope.error = null;

  $scope.loginUser = function (userInfo) {
    $scope.error = null;
    AuthService.login(userInfo).then(function () {
      AuthService.getLoggedInUser()
      .then(function (user) {
        $state.go('user', {id: user.id});
      });
    }).catch(function () {
      $scope.error = 'Invalid login credentials.';
    });
  };

});
