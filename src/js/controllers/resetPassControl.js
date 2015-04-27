var app = angular.module('trinkApp');

app.controller('resetPassControl', function($scope, MainService) {

    $scope.passReset = function() {
        MainService.passReset($scope.user.email)
            .then(function(authData) {
                $scope.user.email = undefined;
                $scope.message = 'Ok! We sent you an email.'
            })
    }
});