var app = angular.module('trinkApp');

app.controller('dashControl', function($scope, MainService, getUser) {
    $scope.blocks = [];

    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": true,
        "progressBar": false,
        "positionClass": "toast-bottom-center",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "slideDown",
        "hideMethod": "fadeOut"
    };

    // Put user info on $scope
    $scope.userName = getUser.name;
    $scope.userEmail = getUser.email;
    $scope.userTrinkets = getUser.trinkets;
    $scope.matches = getUser.matches;

    // Empties the input fields for the 'new item' modal popup
    var setNewBlockFieldsBlank = function() {
        $scope.block.imageurl = '';
        $scope.block.title = '';
        $scope.block.description = '';
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
            });
    };
    displayTrinkets();

    // Create a new trinket
    $scope.submitNewBlock = function() {
        MainService.createTrinket($scope.block.title, $scope.block.imageurl, $scope.block.description)
            .then(
            function(data) {
                $scope.blocks.push(data);
                //console.log('new trinket controller', data);
                //console.log($scope.blocks);
                $scope.modalShown = false;
                toastr.success('You successfully added a trinket!')
            },
            function(error) {

            });
    };

    // LIKE BUTTON
    $scope.interested = function(block) {
        var index = $scope.blocks.indexOf(block);
        var blockId = block._id;
        $scope.blocks.splice(index, 1);

        MainService.sendALike(blockId)
            .then(function(data) {
                console.log('match data', data);
                toastr.info('Hey! You matched with someone!');
                $scope.matches.push(data);

            });
        //displayTrinkets();
    };

    // Delete any sign of trinket in database and view
    $scope.deleteTrinket = function(trinket) {
        //console.log('block', trinket);
        var index = $scope.userTrinkets.indexOf(trinket);

        var blockId = trinket._id;
        MainService.deleteTrinket(blockId)
            .then(
            function(data) {
                $scope.userTrinkets.splice(index, 1);
                toastr.success('You successfully deleted a trinket.');
            },
            function(error) {
                toastr.warning("Sorry that didn't work, try again!")
            })
    };

    // Remove match from users database model and view
    $scope.deleteMatch = function(match) {
        var index = $scope.matches.indexOf(match);
        var matchId = match._id;
        var otherUserId = match.userWhoLikedYourTrinket._id;

        MainService.deleteMatch(matchId, otherUserId)
            .then(
            function(result) {
                $scope.matches.splice(index, 1);
                toastr.success('You successfully deleted a match.');
            },
            function(error) {
                toastr.error('Sorry, something seems to have gone wrong. Try deleting the match again.');
            })
    };
});