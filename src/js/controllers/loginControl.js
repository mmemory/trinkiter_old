var app = angular.module('trinkApp');

app.controller('loginControl', function($scope, MainService) {

    // Login
    $scope.login = function() {

        MainService.loginUser($scope.user.email, $scope.user.password)
            .catch(function(error) {
                $scope.message = error.message;
                $scope.newPass = 'Forgot your password?'
            });
    }


});