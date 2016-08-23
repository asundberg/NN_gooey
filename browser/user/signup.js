'use strict';

app.config(function ($stateProvider) {
    $stateProvider.state('signup', {
        url: '/user/signup',
        templateUrl: '/user/signup.html',
        controller: 'SignupCtrl'
    });
});

app.controller('SignupCtrl', function ($scope, UserFactory, AuthService, $state) {

  $scope.userInfo = {};
  $scope.error = null;

  $scope.signupUser = function (userInfo) {
    $scope.error = null;
    UserFactory.createUser(userInfo)
    .then(function (user) {
      console.log('in signup! user: ', user);
      if (user) {
        AuthService.login(userInfo);
        $state.go('user', {id: user.id});
      } else {
        throw new Error('Please make sure all fields are completed and valid.');
      }
    })
    .catch(function (err) {
      if (err.status === 409) {
        $scope.error = 'Unable to create account. There is already an account with this email.';
      } else {
        $scope.error = 'Unable to complete login.';
      }
    });
  };

});
