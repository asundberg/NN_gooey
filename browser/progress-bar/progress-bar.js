app.directive('progressBar', function ($state) {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: '/progress-bar/progress-bar.html',
        link: function (scope, element, attrs) {

            scope.items = [
                {label: '1', state: 'upload'},
                { label: '2', state: 'state2'},
                {label: '3', state: 'results'},
                {label: '4', state: 'test'}
            ];

            scope.goTo = function(itemState) {
                $state.go(itemState);
            }
        }
    };
});
