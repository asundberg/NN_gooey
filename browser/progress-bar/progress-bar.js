app.directive('progressBar', function () {
    return {
        restrict: 'E',
        templateUrl: '/progress-bar/progress-bar.html',
        link: function (scope, element, attrs) {
            console.log("progressbar");
        }
    };
});
