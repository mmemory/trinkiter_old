var app = angular.module('trinkApp');

app.controller('dashControl', function($scope, MainService) {

    // Empties the input fields for the 'new item' modal popup
    var setNewBlockFieldsBlank = function() {
        $scope.block.imageurl = '';
        $scope.block.title = '';
        $scope.block.description = '';
    };

    // Create a new trinket
    $scope.submitNewBlock = function() {
        displayTrinkets();
        MainService.createTrinket($scope.block.title, $scope.block.imageurl, $scope.block.description);

        setNewBlockFieldsBlank();
        $scope.modalShown = false;
    };

    // Toggles 'new item' modal popup
    $scope.modalShown = false;
    $scope.toggleModal = function() {
        $scope.modalShown = !$scope.modalShown;
    };

    $scope.popupShown = false;
    $scope.togglePopup = function() {
        $scope.popupShown = !$scope.popupShown;
        setNewBlockFieldsBlank()
    };

    // Displays all trinkets on dashboard load
    var displayTrinkets = function() {
        MainService.getTrinketList()
            .then(function(data) {
                $scope.blocks = data;
                //console.log('trinket list:', data);
            });
    };
    displayTrinkets();

    // DISLIKE BUTTON
    $scope.notInterested = function(block) {
        var blockId = block._id;
        console.log('disliked block ID', blockId);
        MainService.sendAHate(blockId);
    };

    // LIKE BUTTON
    $scope.interested = function(block) {
        var blockId = block._id;
        console.log('liked block ID', blockId);
        MainService.sendALike(blockId);
    };

    $scope.deleteTrinket = function(trinket) {
        console.log('block', trinket);
        var index = $scope.userTrinkets.indexOf(trinket);

        var blockId = trinket._id;
        MainService.deleteTrinket(blockId)
            .then(function(data) {
                $scope.userTrinkets.splice(index, 1);
            })
    };

    var getCurrentUser = function() {
        MainService.getCurrentUser()
            .then(function(user) {
                //console.log('Current user is on $scope (dashControl.js)', user);
                $scope.userName = user.name;
                $scope.userEmail = user.email;
                $scope.userTrinkets = user.trinkets;
            })
    };
    getCurrentUser();

});