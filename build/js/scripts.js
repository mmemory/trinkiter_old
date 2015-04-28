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
            templateUrl: 'src/templates/dashboard',
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
})
;
app.controller('MainController', function($scope) {

});
var app = angular.module('trinkApp');

app.controller('dashControl', function($scope, MainService, $rootScope) {

    $scope.block = {};

    $scope.getUser = function() {
        if (MainService.returnUser()) {
            $rootScope.user = MainService.returnUser();
            //localStorage.user = JSON.stringify($rootScope.user);
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
    }
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
var app = angular.module('trinkApp');

app.service('MainService', function(fb, $firebaseAuth, $location, $firebaseArray, $firebaseObject, $q) {

    ///////////////////////////////////////////
    //      Authentication
    /////////////////////////////////////////

    var user;

    var authObj = $firebaseAuth(new Firebase(fb.url));
    var ref = new Firebase(fb.url);

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

    //var blocks = [
    //    {
    //        'imgsrc': 'https://unsplash.imgix.net/photo-1429371527702-1bfdc0eeea7d?dpr=2&fit=crop&fm=jpg&h=650&q=75&w=950',
    //        'title': 'Shank pork salami',
    //        'description': 'Ham hock jowl turkey alcatra pork belly drumstick shank. Cow pork spare ribs, fatback pastrami kielbasa strip steak pig jerky sausage andouille. Venison meatball beef, shankle doner picanha tongue leberkas. Turkey andouille leberkas frankfurter alcatra filet mignon meatball tongue fatback doner pork belly strip steak sirloin t-bone. Flank beef short loin jerky chuck pancetta, picanha pork loin.'
    //    },
    //    {
    //        'imgsrc': 'https://ununsplash.imgix.net/photo-1429105049372-8d928fd29ba1?dpr=2&fit=crop&fm=jpg&h=650&q=75&w=950',
    //        'title': 'Here are my trees!',
    //        'description': 'Here are some trees I have that I don\'t need anymore.'
    //    },
    //    {
    //        'imgsrc': 'https://ununsplash.imgix.net/photo-1422433555807-2559a27433bd?dpr=2&fit=crop&fm=jpg&h=650&q=75&w=950',
    //        'title': 'Kevin pork belly',
    //        'description': 'Venison tenderloin bresaola, cow filet mignon salami strip steak biltong meatball. Beef turkey tongue, alcatra ham capicola picanha hamburger drumstick ham hock shank meatloaf salami.'
    //    }
    //];
    //
    //this.returnBlocks = function() {
    //    return blocks;
    //};


    this.getBlockData = function() {
        return $firebaseObject(new Firebase(fb.url + '/blocks'));
    };


    ///////////////////////////////////////////
    //      Push Data
    /////////////////////////////////////////

    var blockObj = $firebaseArray(new Firebase(fb.url + '/blocks'));

    this.pushBlockData = function(imageLink, title, description) {
        var dfd = $q.defer();
        blockObj.$add({
            imageurl: imageLink,
            title: title,
            description: description
        }).then(function(data) {
            var blockId = $firebaseObject(data).$id;
            var userId = ref.getAuth().uid;
            var userObj = $firebaseArray(new Firebase(fb.url + '/users/' + '/'+userId+'/' + '/userBlocks'));

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