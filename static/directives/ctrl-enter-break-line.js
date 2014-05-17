angular.module('chatApp').directive('ctrlEnterBreakLine', function() {
    return function(scope, element, attrs) {
        var ctrlDown = false;
        element.bind('keydown', function(e) {
            if (e.which === 17) {
                ctrlDown = true;
                setTimeout(function() {
                    ctrlDown = false;
                }, 1000);
            }
            if (e.which === 13) {
                if (ctrlDown) {
                    element.val(element.val() + '\n');
                } else {
                    scope.$apply(function() {
                        scope.$eval(attrs.ctrlEnterBreakLine);
                    });
                    e.preventDefault();
                }
            }
        });
    }
});