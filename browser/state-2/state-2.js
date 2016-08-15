'use strict';

nn_gooey.config(function ($stateProvider) {

  $stateProvider.state('state2', {
    url: '/train',
    template: '/state-2/template.html',
    controller: 'State2Ctrl',
    resolve: {
      trainer: function (TrainerFactory) {
        return TrainerFactory.get();
      }
    }
  });
});

nn_gooey.controller('State2Ctrl', function ($scope, TrainerFactory, trainer) {

  // $scope. = ;

});
