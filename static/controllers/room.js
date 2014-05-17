angular.module('chatApp').controller('RoomCtrl', function($scope, socket) {
    $scope.messages = [];
    socket.emit('allMessages');
    socket.on('allMessages', function(messages) {
        $scope.messages = messages;
    });
    socket.on('messageAdd', function(message) {
        $scope.messages.push(message);
    });

});