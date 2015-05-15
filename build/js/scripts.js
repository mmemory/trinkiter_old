var app = angular.module('trinkApp', ['ngRoute', 'firebase', 'ngAnimate']);

app.constant('fb', {
    url: 'https://trinkiter.firebaseio.com/'
});

app.config(function($routeProvider) {
    $routeProvider
        .when('/login', {
            templateUrl: 'src/templates/loginHome.html',
            controller: 'loginControl'
        })
        .when('/register', {
            templateUrl: 'src/templates/registerHome.html',
            controller: 'registerControl'
        })
        .when('/dashboard/:userId', {
            templateUrl: 'src/templates/dashboard.html',
            controller: 'dashControl'
        })
        .
        when('/passwordreset', {
            templateUrl: 'src/templates/lostPassword.html',
            controller: 'resetPassControl'
        })
        .otherwise({
            redirectTo: '/login'
        })
});
var app = angular.module('trinkApp');

app.service('MainService', function(fb, $firebaseAuth, $location, $firebaseArray, $firebaseObject, $q) {

    ///////////////////////////////////////////
    //      Authentication
    /////////////////////////////////////////

    var authObj = $firebaseAuth(new Firebase(fb.url));
    var ref = new Firebase(fb.url);
    var user = ref.getAuth().uid;

    this.registerUser = function(email, password) {
        return authObj.$createUser({
            email: email,
            password: password
        })
    };

    this.loginUser = function(email, password) {
        return authObj.$authWithPassword({
            email: email,
            password: password
        })
            .then(function(authData) {

                user = {
                    authData: authData.uid
                };
                $location.path('/dashboard/' + authData.uid);
            })
    };

    this.returnUser = function() {
        return user;
    };

    ///////////////////////////////////////////
    //      Password Reset
    /////////////////////////////////////////

    this.passReset = function(email) {
        return authObj.$resetPassword({
            email: email
        })
    };

    ///////////////////////////////////////////
    //      Pull Data
    /////////////////////////////////////////

    // Get the block data from firebase
    this.getBlockData = function() {
         return $firebaseArray(new Firebase(fb.url + '/blocks'));
    };

    // Find out current user's name
    //this.getUserName = function() {
        //return $firebaseObject(new Firebase(fb.url + '/users/' + user)).$loaded();

        //var userObj = $firebaseObject(new Firebase(fb.url + '/users/' + user));

        //var dfd = $q.defer();
        //userObj.$loaded().then(function(data) {
            //dfd.resolve(data.userInfo.firstname);
           //return data.userInfo.firstname;
       // });
        //return dfd.promise;

    //};

    this.getUserName = function() {
        return $firebaseObject(new Firebase(fb.url + '/users/' + user)).$loaded();
    };

    ///////////////////////////////////////////
    //      Push Data
    /////////////////////////////////////////

    var blockObj = $firebaseArray(new Firebase(fb.url + '/blocks'));

    this.pushBlockData = function(imageLink, title, description, userid) {
        var dfd = $q.defer();
        blockObj.$add({
            imageurl: imageLink,
            title: title,
            description: description,
            userid: userid
        }).then(function(data) {
            var blockId = $firebaseObject(data).$id;
            var userId = ref.getAuth().uid;
            var userObj = $firebaseArray(new Firebase(fb.url + '/users/' + userId + '/userBlocks'));

            userObj.$add({
                blockId: blockId
            });

            //console.log(blockId);
            //console.log(userId);
            //console.log('data', $firebaseObject(data));
            //console.log('ref', ref.getAuth());
        });
        return dfd.promise;
    }
});
app.controller('MainController', function($scope) {

});
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
var app = angular.module('trinkApp');

app.controller('headerControl', function($scope, $rootScope, MainService) {

});
var app = angular.module('trinkApp');

app.controller('loginControl', function($scope, MainService, $rootScope) {

    $scope.pageClass = 'page-login';

    // Login
    $scope.login = function() {

        MainService.loginUser($scope.user.email, $scope.user.password)
            .catch(function(error) {
                $scope.message = error.message;
                $scope.newPass = 'Forgot your password?'
            });
    };


});
var app = angular.module('trinkApp');

app.controller('registerControl', function($scope, MainService, fb, $firebaseAuth, $firebaseObject, $location) {

    $scope.user = {};

    $scope.pageClass = 'page-register';

    $scope.register = function() {
        MainService.registerUser($scope.user.email, $scope.user.password)
            .then(function(authData) {
                var ref = new Firebase(fb.url + '/users/' + authData.uid);
                var firebaseUser = $firebaseObject(ref);
                firebaseUser.userInfo = {
                    date: Firebase.ServerValue.TIMESTAMP,
                    firstname: $scope.user.firstname,
                    lastname: $scope.user.lastname,
                    email: $scope.user.email
                };
                firebaseUser.$save();
                $location.path('/login');
            })
            .catch(function(error) {
                $scope.message = error.message;
            });
    }
});
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