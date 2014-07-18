var app = angular.module('chatApp');

app.controller('RoomCtrl', function($scope, socket){
    $scope.messages = [];
    socket.emit('getAllMessages');
    socket.on('allMessages', function(messages) {
        $scope.messages = messages;
    });

    socket.on('messageAdd', function(message) {
        $scope.messages.push(message);
    });
});