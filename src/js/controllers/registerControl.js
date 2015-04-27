app.controller('registerControl', function($scope, $firebaseArray, MainService) {

    $scope.registerUser = function() {
        return MainService.registerUser($scope.firstname, $scope.lastname, $scope.email, $scope.password);
    }

});