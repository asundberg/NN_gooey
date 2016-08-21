'use strict';

app.directive('navbar', function ($state, $rootScope, AuthService, AUTH_EVENTS, UserFactory) { // Auth, $location ?
  return {
    restrict: 'E',
    templateUrl: '/navbar/navbar.html',
    link: function (scope, element, attrs) {
      angular.extend(scope, UserFactory);

      // scope.items = [
      //     { label: 'Home', state: 'home' },
      //     { label: 'About', state: 'about' },
      //     { label: 'Products', state: 'products' },
      //     { label: 'My Account', state: 'account', auth: true }

      // ];

      scope.user = null;
      scope.loginButtonText = 'Log in';
      scope.signupButtonText = 'Sign up!';
      scope.loggedIn = function () {
        return AuthService.isAuthenticated();
      };
      // scope.signupState = false;
      scope.toggleStatus = function () {
        if (scope.loggedIn()) {
          scope.loginButtonText = 'Log out';
          $state.go('login');
          console.log('clicked login');
        } else {
          scope.loginButtonText = 'Log in';
          scope.logout();
          console.log('clicked logout');
        }
      };
      scope.signup = function () {
        console.log('clicked signup');
        $state.go('signup');
      };

      scope.logout = function () {
        AuthService.logout().then(function () {
          console.log('should move to home page');
          // $state.go('home');
        });
      };

      var setUser = function () {
        AuthService.getLoggedInUser().then(function (user) {
          scope.user = user;
        });
      };

      var removeUser = function () {
        scope.user = null;
      };

      setUser();

      $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
      $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
      $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);

    }
  };
});
