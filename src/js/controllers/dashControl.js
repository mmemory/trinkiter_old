var app = angular.module('trinkApp');

app.controller('dashControl', function($scope, MainService, $rootScope) {

    $scope.block = {};

    $scope.getUser = function() {
        if (MainService.returnUser()) {
            $rootScope.user = MainService.returnUser();
        }
    };

    $scope.getUser();


    var getBlock = function() {
        $scope.blocks = MainService.getBlockData()
    };

    getBlock();


    $scope.submitNewBlock = function() {

        MainService.pushBlockData($scope.block.imageurl, $scope.block.title, $scope.block.description);

        $scope.block.imageurl = '';
        $scope.block.title = '';
        $scope.block.description = '';
        $scope.modalShown = false;
    };

    // Toggle modal window for adding new block
    $scope.modalShown = false;
    $scope.toggleModal = function() {
        $scope.modalShown = !$scope.modalShown;
    };
});