var app = angular.module('trinkApp');

app.controller('registerControl', function($scope, MainService, $location) {

    $scope.user = {};

    $scope.registerUser = function() {
        MainService.registerUser($scope.user.email, $scope.user.firstname, $scope.user.lastname);

        $scope.user.email = '';
        $scope.user.firstname = '';
        $scope.user.lastname = '';
        $scope.user.password = '';

        $location.path('/dashboard');
    }


});