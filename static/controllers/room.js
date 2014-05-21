angular.module('chatApp').controller('RoomCtrl', function($scope, socket) {
    socket.on('roomData', function(room) {
        $scope.room = room;
    });
    socket.on('messageAdd', function(message) {
        $scope.chatroom.messages.push(message);
    });
    socket.emit('getRoom');
});