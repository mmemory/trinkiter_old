var app = angular.module('trinkApp', ['ngRoute', 'ngAnimate']);

app.constant('CONSTANT', {
    // API server
    url: 'http://localhost:3000/api/'
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
        .when('/dashboard', {
            templateUrl: 'src/templates/dashboard.html',
            controller: 'dashControl'
        })
        .otherwise({
            redirectTo: '/login'
        })
});
var app = angular.module('trinkApp');

app.service('MainService', function($http, CONSTANT) {

    var url = CONSTANT.url;

    this.registerUser = function(email, firstName, lastName) {
        var userUrl = url + 'users';

        var userData = {
            user_info: {
                name: {
                    first_name: firstName,
                    last_name: lastName
                },
                email: email
            }
        };

        //console.log(userData);

        $http.post(userUrl, userData)
            .success(function(data) {
                console.log('user info sent to mongodb');
            })
            .error(function(data) {
                console.log('error', data);
            })
    }


});
var app = angular.module('trinkApp');

app.controller('dashControl', function($scope) {



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
var app = angular.module('trinkApp');

app.controller('resetPassControl', function($scope) {


});