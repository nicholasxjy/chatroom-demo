angular.module('chatApp', []);
angular.module('chatApp').factory('socket', function($rootScope) {
    var socket = io.connect('/');
    return {
        on: function(eventname, callback) {
            socket.on(eventname, function() {
                var arg = arguments;
                $rootScope.$apply(function() {
                    callback.apply(socket, arg);
                });
            });
        },
        emit: function(eventname, data, callback) {
            socket.emit(eventname, data, function() {
                var arg = arguments;
                $rootScope.$apply(function() {
                    if (callback) {
                        callback.apply(socket, arg);
                    }
                });
            });
        }
    }
});