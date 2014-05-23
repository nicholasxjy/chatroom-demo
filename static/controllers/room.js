angular.module('chatApp').controller('RoomCtrl', function($scope, socket) {
    socket.on('roomData', function(room) {
        $scope.room = room;
    });
    socket.on('messageAdd', function(message) {
        $scope.chatroom.messages.push(message);
    });
    socket.emit('getRoom');

    socket.on('online', function(user) {
        $scope.room.push(user);
    });

    socket.on('offline', function(user) {
        _userId = user._id;
        $scope.room.users = $scope.room.users.filter(function(user) {
            return user._id != _userId;
        });
    });
});