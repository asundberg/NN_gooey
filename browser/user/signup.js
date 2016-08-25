'use strict';

app.config(function ($stateProvider) {
    $stateProvider.state('signup', {
        url: '/user/signup',
        templateUrl: '/user/signup.html',
        controller: 'SignupCtrl'
    });
});

app.controller('SignupCtrl', function ($rootScope, $scope, UserFactory, AuthService, $state, $cookieStore, TrainerFactory) {

  $rootScope.state = 'signup';
  $rootScope.homeButtonStatus();
  $scope.userInfo = {};
  $scope.error = null;
  var cookieStoreItems = $cookieStore.get('view');

  if (cookieStoreItems) {
    $scope.showModelNameField = true;
  }

  $scope.signupUser = function (userInfo) {
    $scope.error = null;
    $scope.errorPresent = false;
    UserFactory.createUser(userInfo)
    .then(function (user) {
      if (user) {
        AuthService.login(userInfo);
        if (cookieStoreItems) {
          TrainerFactory.getModel(cookieStoreItems.modelId)
          .then(function (result) {
            var model = result;
            model.userId = user.id;
            model.name = userInfo.modelName;
            return TrainerFactory.addUserId(cookieStoreItems.modelId, model);
          })
          .then(function () {
            $state.go('user', {id: user.id});
          });
        } else {
          $state.go('user', {id: user.id});
        }
      } else {
        throw new Error('Please make sure all fields are completed and valid.');
      }
    })
    .catch(function (err) {
      $scope.errorPresent = true;
      if (err.status === 500) {
        $scope.error = 'Unable to create account. There is already an account with this email.';
      } else {
        $scope.error = 'Unable to complete login.';
      }
    });
  };

});
