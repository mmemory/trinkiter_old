var app = angular.module('trinkApp');

app.controller('registerControl', function($scope, MainService) {

    $scope.user = {};

    $scope.registerUser = function() {
        MainService.registerUser($scope.user.email, $scope.user.firstname, $scope.user.lastname);


    }


});