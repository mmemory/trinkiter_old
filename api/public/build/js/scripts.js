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
        var dfd = $q.defer();
        $http.post(trinketUrl, trinketData)
            .success(function(data) {
                //console.log('Trinket successfully created', data);
                dfd.resolve(data);
            })
            .error(function(data) {
                console.error('Error creating trinket', data);
            });
        return dfd.promise;
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
                console.error('Error', data);
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
                console.error('Error', data);
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
                //console.log('data from like in service', data._id);
                //console.log('Successfully liked the trinket');
                console.log('service match data', data);
                dfd.resolve(data);
            })
            .error(function(data) {
                console.error('Failed to like the trinket', data);

                dfd.reject(data)
            });
        return dfd.promise;
    };

    ///////////////////////////////////////////
    //      DELETE DATA FROM DATABASE
    /////////////////////////////////////////

    /*
     * Delete trinket from array of trinkets
     */
    this.deleteTrinket = function(trinketId) {
        var trincketIdUrl = trinketUrl + '/' + trinketId;

        var dfd = $q.defer();
        $http.delete(trincketIdUrl)
            .success(function(data) {
                //console.log('Successfully deleted trinket');
                dfd.resolve(data);
            })
            .error(function(data) {
                console.error('Error', data);
            });
        return dfd.promise;
    };

    /*
     * Delete match from array of matches
     */
    this.deleteMatch = function(matchId, otherUserId) {
        var matchIdUrl = userUrl + '/remove-match/' + matchId + '/' + otherUserId;

        var dfd = $q.defer();
        $http.put(matchIdUrl)
            .success(function(data) {
                //console.log('Successfully deleted match');
                dfd.resolve(data);
            })
            .error(function(data) {
                console.error('Error deleting match', data);
            });
        return dfd.promise;
    }

});



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
