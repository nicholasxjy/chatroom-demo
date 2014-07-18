var app = angular.module('chatApp');

app.directive('ctrlEnterBreakLine', function() {
    return function(scope, element, attrs) {
        var ctrlDown = false;
        element.bind('keyDown', function(evt) {
            if (evt.which == 17) {
                ctrlDown = true;
                setTimeOut(function() {
                    ctrlDown = false;
                }, 1000);
            }
            if (evt.which == 13) {
                if (ctrlDown) {
                    element.val(element.val() + '\n');
                } else {
                    scope.$apply(function() {
                        scope.$eval(attrs.ctrlEnterBreakLine);
                    });
                    evt.preventDefault();
                }
            }
        });
    }
});