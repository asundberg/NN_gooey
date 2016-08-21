'use strict';

app.config(function ($stateProvider) {
    $stateProvider.state('login', {
        url: '/user/login',
        templateUrl: '/user/login.html',
        controller: 'LoginCtrl'
    });
});

app.controller('LoginCtrl', function ($scope, UserFactory) { // $scope, Auth, $state ?

  $scope.userInfo = {};

  $scope.loginUser = function (userInfo) {
    UserFactory.fetchUser(userInfo);
  };

});
