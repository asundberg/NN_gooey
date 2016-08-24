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
                console.log('this is MODELS: ', models);
                userObj.models = models;
              }
              return userObj;
            });
          }
        }
    });
});

app.controller('UserCtrl', function ($rootScope, $scope, $state, userAccount) {
  $rootScope.state = 'user';
  $rootScope.homeButtonStatus();
  $scope.user = userAccount;
  $scope.models = userAccount.models;
  $scope.selectedModel = null;
  $scope.selectModelToTest = function (model) {
    $scope.selectedModel = model;
    console.log('this is selectedModel: ', $scope.selectedModel);
  };
  $scope.goToTest = function () {
    $state.go('test', {id: $scope.selectedModel.id});
  };
});
