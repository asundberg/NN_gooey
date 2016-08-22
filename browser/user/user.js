'use strict';

app.config(function ($stateProvider) {
    $stateProvider.state('user', {
        url: '/user/:id',
        templateUrl: '/user/user.html',
        controller: 'UserCtrl',
        resolve: {
          userAccount: function (UserFactory, $stateParams) {
            return UserFactory.showNewUser($stateParams.id);
          }
        }
    });
});

app.controller('UserCtrl', function ($scope, userAccount) { // $scope, Auth, $state ?
  $scope.user = userAccount;
});
