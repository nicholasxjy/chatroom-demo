var app = angular.module('chatApp');

app.controller('MessageCreatorCtrl', function($scope, socket) {

    $scope.createMessage = function() {
        socket.emit('messages.create', {
            message: $scope.newMessage,
            creator: $scope.me
        });
        $scope.newMessage = '';
    }
});