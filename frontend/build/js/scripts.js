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

app.service('MainService', function() {


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

app.controller('registerControl', function($scope) {


});
var app = angular.module('trinkApp');

app.controller('resetPassControl', function($scope) {


});