var app = angular.module('trinkApp');

app.controller('userTrinketsControl', function($scope, MainService) {

    // Empties the input fields for the 'new item' modal popup
    var setNewBlockFieldsBlank = function() {
        $scope.block.imageurl = '';
        $scope.block.title = '';
        $scope.block.description = '';
    };

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

    var displayTrinkets = function() {
        MainService.getTrinketList()
            .then(function(data) {
                $scope.blocks = data;
                //console.log('trinket list:', data);
            });
    };
    displayTrinkets();

    $scope.notInterested = function(block) {
        console.log('block', block);
        var index = $scope.blocks.indexOf(block);

        var blockId = block._id;
        MainService.deleteTrinket(blockId)
            .then(function(data) {
                $scope.blocks.splice(index, 1);
            })
    };

    var getCurrentUser = function() {
        MainService.getCurrentUser()
            .then(function(user) {
                console.log('current user', user);
                $scope.userName = user.name;
                $scope.userEmail = user.email;
            })
    };
    getCurrentUser();
});