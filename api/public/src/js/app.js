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