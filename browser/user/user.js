'use strict';

app.config(function ($stateProvider) {
    $stateProvider.state('user', {
        url: '/user/:id',
        templateUrl: '/user/user.html',
        controller: 'UserCtrl',
        resolve: {
          userAccount: function (UserFactory, $stateParams) {
            var userObj;
            return UserFactory.getUser($stateParams.id)
            .then(function (user) {
              userObj = user;
              return UserFactory.getModelsForUser($stateParams.id);
            })
            .then(function (models) {
              if (models) {
                userObj.models = models;
              }
              return userObj;
            });
          }
        }
    });
});

app.controller('UserCtrl', function ($scope, userAccount) {
  $scope.user = userAccount;
  $scope.models = userAccount.models;
});
