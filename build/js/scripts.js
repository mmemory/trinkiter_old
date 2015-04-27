var app = angular.module('trinkApp', ['ngRoute', 'firebase']);

app.constant('base', {
    url: 'https://trinkiter.firebaseio.com/'
});

app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'src/templates/loginHome.html',
            controller: 'loginControl'
        })
        .when('/register', {
            templateUrl: 'src/templates/registerHome.html',
            controller: 'registerControl'
        })
        .when('/dashboard/:user', {
            templateUrl: 'src/templates/dashboard',
            controller: 'dashControl'
        })
        .otherwise({
            redirectTo: '/'
        })
});
app.controller('MainController', function($scope) {

});
app.controller('loginControl', function($scope) {



});
app.controller('registerControl', function($scope, $firebaseArray, MainService) {

    $scope.registerUser = function() {
        return MainService.registerUser($scope.firstname, $scope.lastname, $scope.email, $scope.password);
    }

});
app.service('MainService', function(base) {


    this.registerUser = function(firstname, lastname, email, password) {
        var user = {
            firstname: firstname,
            lastname: lastname,
            email: email,
            pass: password
        };

        console.log(user);
    }

});