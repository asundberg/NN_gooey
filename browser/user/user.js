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
              console.log('Yay - the user state resolve function is working! This is the userObj: ', userObj);
              return userObj;
            });
          }
        }
    });
});

app.controller('UserCtrl', function ($scope, userAccount) {
  $scope.user = userAccount;
  $scope.models = userAccount.models;
  $scope.selectedModel = null;
  $scope.selectModelToTest = function (model) {
    $scope.selectedModel = model;
  };
});
