var app = angular.module('trinkApp', ['ngRoute', 'ngAnimate']);

app.constant('CONSTANT', {
    // API server
    url: 'http://localhost:3000/'
});

app.config(function($routeProvider) {
    $routeProvider
        .when('/login', {
            templateUrl: 'src/templates/loginHome.html',
            controller: 'loginControl'
        })
        //.when('/register', {
        //    templateUrl: 'src/templates/registerHome.html',
        //    controller: 'registerControl'
        //})
        .when('/dashboard/:id', {
            templateUrl: 'src/templates/dashboard.html',
            controller: 'dashControl',
            resolve: {
                getUser: function(MainService, $route) {
                    return MainService.getCurrentUser($route.current.params.id);
                }
            }
        })
        //.when('/dashboard/mytrinkets/:id', {
        //    templateUrl: 'src/templates/userTrinkets.html',
        //    controller: 'userTrinketsControl',
        //    resolve: {
        //        getTrinkets: function(MainService, $route) {
        //            return MainService.getCurrentUserTrinkets($route.current.params.id);
        //        }
        //    }
        //})
        .otherwise({
            redirectTo: '/login'
        })
});