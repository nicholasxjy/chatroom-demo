var app = angular.module('chatApp');

app.controller('MessageCreatorCtrl', function($scope, socket) {
    $scope.newMessage = '';
    $scope.createMessage = function() {
        if ($scope.newMessage == '') {
            return;
        }
        socket.emit('createMessage', $scope.newMessage);
        $scope.newMessage = '';
    }
});