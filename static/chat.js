dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddangular.module('chatApp', []);
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

angular.module('chatApp').controller('roomCtrl', function($scope, socket) {
	$scope.messages = [];
	socket.emit('getAllMessages');
	socket.on('allMessages', function(messages) {
		$scope.messages = messages;
	});
	socket.on('createNewMessage', function(message) {
		$scope.messages.push(message);
	});
});

angular.module('chatApp').controller('messageCreateCtrl', function($scope, socket) {
	$scope.newMessage = '';
	$scope.createMessage = function() {
		if ($scope.newMessage == '') {
			return;
		}
		socket.emit('messageAdd', $scope.newMessage);
		$scope.newMessage = '';
	}
});

angular.module('chatApp').directive('autoScrollToBottom', function() {
	return {
		link: function(scope, element, attrs) {
			scope.$watch(
				function() {
					return element.children().length;
				},
				function() {
					element.animate({
						scrollTop: element.prop('scrollHeight')
					}, 1000);
				}
			)
		}
	}
});
angular.module('chatApp').directive('ctrlEnterBreakLine', function() {
	return function(scope, element, attrs) {
		var ctrlDown = false;
		element.bind('keydown', function(e) {
			if (e.which === 17) {
				ctrlDown = true;
				setTimeout(function() {
					ctrlDown = false;
				}, 2000);
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



