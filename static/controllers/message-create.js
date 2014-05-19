angular.module('chatApp').controller('MessageCreateCtrl', function($scope, socket) {
    $scope.createMessage = function() {
        socket.emit('createNewMessage', {message: $scope.newMessage, creator: $scope.me});
        $scope.newMessage = '';
    }
});