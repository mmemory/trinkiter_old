var app = angular.module('trinkApp');

app.controller('dashControl', function($scope, MainService) {

    // Empties the input fields for the 'new item' modal popup
    var setNewBlockFieldsBlank = function() {
        $scope.block.imageurl = '';
        $scope.block.title = '';
        $scope.block.description = '';
    };

    $scope.submitNewBlock = function() {
        displayTrinkets();
        MainService.createTrinket($scope.block.title, $scope.block.imageurl, $scope.block.description, $scope.user);

        setNewBlockFieldsBlank();
        $scope.modalShown = false;
    };

    // Toggles 'new item' modal popup
    $scope.modalShown = false;
    $scope.toggleModal = function() {
        $scope.modalShown = !$scope.modalShown;
        setNewBlockFieldsBlank()
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
                console.log(data);
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
    }
});