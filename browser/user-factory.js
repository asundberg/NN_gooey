'use strict';

app.factory('UserFactory', function ($http) {

    var UserFactory = {};

    UserFactory.fetchUser = function (data) {
      return $http.post('/user/auth', data)
      .then(function (response) {
        return response.data;
      });
    };

    UserFactory.createUser = function (data) {
      return $http.post('/user/signup', data)
      .then(function (response) {
        return response.data;
      });
    };

    return UserFactory;
});
