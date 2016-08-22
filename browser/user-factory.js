'use strict';

app.factory('UserFactory', function ($http) {

    var UserFactory = {};

    UserFactory.createUser = function (data) {
      return $http.post('/user/signup', data)
      .then(function (response) {
        return response.data;
      });
    };

    UserFactory.showNewUser = function (id) {
      return $http.get('/user/' + id)
      .then(function (response) {
        return response.data;
      });
    };

    return UserFactory;
});
