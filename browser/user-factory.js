'use strict';

app.factory('UserFactory', function ($http) {

    var UserFactory = {};

    UserFactory.createUser = function (data) {
      return $http.post('/user/signup', data)
      .then(function (response) {
        return response.data;
      });
    };

    UserFactory.getUser = function (id) {
      return $http.get('/user/' + id)
      .then(function (response) {
        console.log('UserFactory, response: ', response);
        return response.data;
      });
    };

    UserFactory.getModelsForUser = function (userId) {
      return $http.get('/train/all/' + userId)
      .then(function (response) {
        return response.data;
      });
    };

    return UserFactory;
});
