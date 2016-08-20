'use strict';

app.config(function ($stateProvider) {
    $stateProvider.state('user', {
        url: '/user/:id',
        templateUrl: '/user/user.html',
        controller: 'UserCtrl'
    });
});

app.controller('UserCtrl', function () { // $scope, Auth, $state ?

  // $scope.signupUser = function (credentials) {
  //   Auth.signup(credentials)
  //   .then(function (loggedinUser) {
  //     $state.go('user', {id: loggedinUser.id});
  //   });
  // };
});
