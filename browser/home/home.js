app.config(function($stateProvider) {
  $stateProvider.state('home', {
    url: '/home',
    templateUrl: '/home/home.html',
    controller: 'HomeCtrl'
  })
})
app.controller('HomeCtrl', function($scope, TrainerFactory, $state) {


})
