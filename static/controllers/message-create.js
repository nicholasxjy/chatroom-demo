angular.module('chatApp').controller('MessageCreateCtrl', function($scope, socket) {
    $scope.createMessage = function() {
        socket.emit('createNewMessage', $scope.newMessage);
        $scope.newMessage = '';
    }
});