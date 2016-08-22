app.directive('progressBar', function ($state) {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: '/progress-bar/progress-bar.html',
        link: function (scope, element, attrs) {
            scope.state1 = function() {
                $state.go('upload');
            }
            scope.state2 = function() {
                $state.go('state2');
            }
        }
    };
});
