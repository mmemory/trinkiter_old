var app = angular.module('trinkApp');

app.controller('dashControl', function($scope, MainService, $rootScope) {

    $scope.getUser = function() {
        if (MainService.returnUser()) {
            $rootScope.user = MainService.returnUser();
            //localStorage.user = JSON.stringify($rootScope.user);
        }
    };

    $scope.getUser();


    $scope.getBlock = function() {
        $scope.blocks = MainService.returnBlocks()
    };
});