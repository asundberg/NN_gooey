'use strict';

app.config(function ($stateProvider) {

  $stateProvider.state('state2', {
    url: '/train',
    templateUrl: '/state-2/template.html',
    controller: 'State2Ctrl'
    // resolve: {
    //   trainer: function (TrainerFactory) {
    //     return TrainerFactory.get();
    //   }
    // }
  });
});

app.controller('State2Ctrl', function ($scope, TrainerFactory) {

  // $scope. = ;
  d3.selectAll("p").style("color", "blue");

});
