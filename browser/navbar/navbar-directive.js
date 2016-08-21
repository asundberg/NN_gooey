'use strict';

app.directive('navbar', function ($state) { // Auth, $location ?
  return {
    restrict: 'E',
    templateUrl: '/navbar/navbar.html',
    link: function (scope) {
      // scope.pathStartsWithStatePath = function (state) {
      //   var partial = $state.href(state);
      //   var path = $location.path();
      //   return path.startsWith(partial);
      // };
      // scope.logout = function () {
      //   return Auth.logout()
      //   .then(function () {
      //     $state.go('home');
      //   });
      // };
      scope.loginButtonText = 'Log in';
      scope.signupButtonText = 'Sign up!'
      scope.loggedIn = false;
      scope.signupState = false;
      scope.toggleStatus = function () {
        if (scope.loginButtonText === 'Log in') {
          scope.loginButtonText = 'Log out';
          scope.loggedIn = true;
          $state.go('login');
          console.log('clicked login');
        } else {
          scope.loginButtonText = 'Log in';
          scope.loggedIn = false;
          // $state.go('home'); ??
          console.log('clicked logout');
        }
      };
      scope.signup = function () {
        console.log('clicked signup');
        scope.signupState = true;
        $state.go('signup');
      };
    }
  };
});
