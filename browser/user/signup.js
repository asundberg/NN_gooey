'use strict';

app.config(function ($stateProvider) {
    $stateProvider.state('signup', {
        url: '/user/signup',
        templateUrl: '/user/signup.html',
        controller: 'SignupCtrl'
    });
});

app.controller('SignupCtrl', function ($scope, UserFactory, $state) { // $scope, Auth, $state ?

  $scope.userInfo = {};

  $scope.signupUser = function (userInfo) {
    UserFactory.createUser(userInfo)
    .then(function (user) {
      if (user.id) {
        $state.go('user', {id: user.id});
      } else {
        // This is not currently functional because a 500 error in Sequelize will happen, should be fixed at some point...
        $scope.errorMessage = 'Please make sure all fields are completed and valid.';
      }
    });
  };

});
