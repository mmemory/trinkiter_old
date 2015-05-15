var app = angular.module('trinkApp');

app.controller('dashControl', function(fb, $scope, MainService, $firebaseObject) {

    $scope.block = {};

    // Find out what user is on
    var getUser = function() {
        $scope.user = MainService.returnUser();
    };
    getUser();

    // Get data from blocks database
    var getBlock = function() {
        $scope.blocks = MainService.getBlockData();
    };
    getBlock();

    // Send data for new block to service
    $scope.submitNewBlock = function() {
        MainService.pushBlockData($scope.block.imageurl, $scope.block.title, $scope.block.description, $scope.user);

        $scope.block.imageurl = '';
        $scope.block.title = '';
        $scope.block.description = '';
        $scope.modalShown = false;
    };

    // Toggle modal window for adding new block
    $scope.modalShown = false;
    $scope.toggleModal = function() {
        $scope.modalShown = !$scope.modalShown;
        $scope.block.imageurl = '';
        $scope.block.title = '';
        $scope.block.description = '';
    };

    // Gets user name and puts it on $scope
    var currentName = function() {
        var obj = $firebaseObject(new Firebase(fb.url + '/blocks'));

        obj.$loaded()
            .then(function(data) {
                $scope.currentName = data;
            });
        console.log($scope.currentName);
    };
    currentName();

});