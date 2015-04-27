var app = angular.module('trinkApp', ['ngRoute']);

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
            controller: 'dashController'
        })
        .otherwise({
            redirectTo: '/'
        })
});