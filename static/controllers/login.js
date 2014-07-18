var app = angular.module('chatApp');

app.controller('LoginCtrl', function($scope, $http, $location) {
    $scope.login = function() {
        $http({
            url: '/api/login',
            method: 'POST',
            data: {
                email: $scope.email
            }
        }).success(function(user) {
            $scope.$emit('login', user); // $rootScope.$on监听事件
            $location.path('/');
        }).error(function(data) {
            $location.path('/login');
        });
    }
})