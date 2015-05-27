var app = angular.module('trinkApp', ['ui.router', 'ngAnimate']);

app.constant('CONSTANT', {
    // API server
    url: 'http://localhost:3000/'
});

app.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'src/templates/loginHome.html',
            controller: 'loginControl'
        })
        .state('dashboard', {
            abstract: true,
            url: '/dashboard/:id',
            templateUrl: 'src/templates/dashboard.html',
            controller: 'dashControl',
            resolve: {
                getUser: function(MainService, $stateParams) {
                    return MainService.getCurrentUser($stateParams.id);
                }
            }
        })
        .state('dashboard.all-items', {
            url: '/trinkets',
            templateUrl: 'src/templates/allTrinkets.html',
            controller: 'dashControl'
        })
        .state('dashboard.my-items', {
            url: '/mytrinkets',
            templateUrl: 'src/templates/userTrinkets.html',
            controller: 'dashControl'
        });

    $urlRouterProvider.otherwise('/login');
});
var app = angular.module('trinkApp');

app.service('MainService', function($http, CONSTANT, $q) {

    // Globals
    var url = CONSTANT.url,
        trinketUrl = url + 'api/trinkets',
        userUrl = url + 'api/users',
        currentUserUrl = url + 'auth/me';


    ///////////////////////////////////////////
    //      POST DATA TO DATABASE
    /////////////////////////////////////////

    /*
     * Add new Trinkit
     */
    this.createTrinket = function(title, image, description) {
        var trinketData = {
            title: title,
            image: image,
            description: description,
        };
        //console.log('server created userID', userId);

        $http.post(trinketUrl, trinketData)
            .success(function(data) {
                console.log('Trinket successfully created');
            })
            .error(function(data) {
                console.log('Error', data);
            })
    };


    ///////////////////////////////////////////
    //      GET DATA FROM DATABASE
    /////////////////////////////////////////

    /*
     * Get trinket list for display
     */
    this.getTrinketList = function() {
        var dfd = $q.defer();
        $http.get(trinketUrl)
            .success(function(data) {
                dfd.resolve(data);
            })
            .error(function(data) {
                console.log('Error', data);
            });
        return dfd.promise;
    };

    /*
     * Get logged in user info
     */
    this.getCurrentUser = function() {
        var dfd = $q.defer();
        $http.get(currentUserUrl)
            .success(function(data) {
                //console.log('user data from service', data);
                dfd.resolve(data);
            })
            .error(function(data) {
                console.log('Error', data);
            });
        return dfd.promise;
    };

    ///////////////////////////////////////////
    //      UPDATE DATA TO DATABASE
    /////////////////////////////////////////

    /*
     * Send trinket ID to assign user ID to likes object
     */
    this.sendALike = function(trinketId) {
        var trincketIdUrl = trinketUrl + '/' + trinketId;

        var dfd = $q.defer();
        $http.post(trincketIdUrl)
            .success(function(data) {
                console.log('data from like in service', data._id);
                console.log('Successfully liked the trinket');
                dfd.resolve(data._id);
            })
            .error(function(data) {
                console.log('Failed to like the trinket', data);
            });
        return dfd.promise;
    };

    /*
     * Send trinket ID to assign user ID to dislikes object
     */
    this.sendAHate = function(trinketId) {
        var trincketIdUrl = trinketUrl + '/hate/' + trinketId;

        var dfd = $q.defer();
        $http.post(trincketIdUrl)
            .success(function(data) {
                console.log('data from hate in service', data._id);
                console.log('Successfully hated the trinket');
                dfd.resolve(data._id);
            })
            .error(function(data) {
                console.log('Failed to hate the trinket', data);
            });
        return dfd.promise;
    };

    ///////////////////////////////////////////
    //      DELETE DATA FROM DATABASE
    /////////////////////////////////////////

    /*
     * Delete trinket from array of trinkets
     */
    //TODO this needs to remove from user dashboard, not from database completely
    this.deleteTrinket = function(trinketId) {
        var trincketIdUrl = trinketUrl + '/' + trinketId;

        var dfd = $q.defer();
        $http.delete(trincketIdUrl)
            .success(function(data) {
                console.log('Successfully deleted');
                dfd.resolve(data);
            })
            .error(function(data) {
                console.log('Error', data);
            });
        return dfd.promise;
    };

    this.dislikeTrinket = function(trinketId, userId) {
        var userIdUrl = userUrl + '/dislikes/' + userId;

        var dfd = $q.defer();
        $http.put(userIdUrl, {trinketId: trinketId})
            .success(function(data) {
                console.log('Successfully disliked');
                dfd.resolve(data);
            })
            .error(function(data) {
                console.log('Error', data);
            });
        return dfd.promise;

    };

    //this.deleteMatch = function(matchId) {
    //    var matchIdUrl = matchId +
    //}

});



var app = angular.module('trinkApp');

app.controller('dashControl', function($scope, MainService, getUser) {

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
                console.log('trinket list:', data);
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

    $scope.userName = getUser.name;
    $scope.userEmail = getUser.email;
    $scope.userTrinkets = getUser.trinkets;
    $scope.matches = getUser.matches;

    //var getCurrentUser = function() {
    //    console.log('DASH CONTROL GET USER CALLED');
    //    MainService.getCurrentUser()
    //        .then(function(user) {
    //            console.log('Current user is on $scope (dashControl.js)', user);
    //            $scope.userName = user.name;
    //            $scope.userEmail = user.email;
    //            $scope.userTrinkets = user.trinkets;
    //            $scope.matches = user.matches;
    //            console.log('matches from controller', $scope.matches);
    //        })
    //};
    //getCurrentUser();

    $scope.deleteMatch = function(match) {
        var index = $scope.matches.indexOf(match);

        var matchId = match._id;
        MainService.deleteMatch()
            .then(function(result) {
                $scope.matches.splice(index, 1)
            })
    }

});
var app = angular.module('trinkApp');

app.controller('headerControl', function($scope) {

});
var app = angular.module('trinkApp');

app.controller('loginControl', function($scope) {



});
var app = angular.module('trinkApp');

app.controller('registerControl', function($scope, MainService, $location) {

    $scope.user = {};

    $scope.registerUser = function() {
        MainService.registerUser($scope.user.email, $scope.user.firstname, $scope.user.lastname);

        $scope.user.email = '';
        $scope.user.firstname = '';
        $scope.user.lastname = '';
        $scope.user.password = '';

        $location.path('/dashboard');
    }


});
$(document).ready(function() {
    //console.log('prevent scroll fired');
    var counter = 0;

    $('.dash-sidebar').hover(function() {
        //$('body').toggleClass('prevent-scroll');
        counter++;
        //console.log(counter);
    })
});
