app.directive('progressBar', function ($rootScope, $state, $cookieStore, TrainerFactory, $stateParams) {
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

            scope.goTo = function(item) {
                if(item.label == '4') $state.go(item.state, {id: $cookieStore.get('modelId'.toString())});
                else $state.go(item.state);
            };
            scope.isState = function(itemState) {
                return itemState == $rootScope.state;
            }

            scope.isClickable = function(item) {
                if(item.label == '1') return true;
                else {
                    console.log($cookieStore.get('modelId'));
                    var hasInput = TrainerFactory.inputArr != undefined;
                    var isTrained = TrainerFactory.hiddenLayersArr.length > 0;
                    if(item.label == '2') return hasInput;
                    if(item.label == '3') return hasInput && isTrained;
                    if(item.label == '4') return hasInput && isTrained;
                }
            }
        }
    };
});
