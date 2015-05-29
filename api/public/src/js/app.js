var app = angular.module('trinkApp', ['ui.router', 'ngAnimate']);

app.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: './src/templates/loginHome.html',
            controller: 'loginControl'
        })
        .state('dashboard', {
            abstract: true,
            url: '/dashboard/:id',
            templateUrl: './src/templates/dashboard.html',
            controller: 'dashControl',
            resolve: {
                getUser: function(MainService, $stateParams) {
                    console.log('got to resolve in app.js');
                    return MainService.getCurrentUser($stateParams.id);
                }
            }
        })
        .state('dashboard.all-items', {
            url: '/trinkets',
            templateUrl: './src/templates/allTrinkets.html',
            controller: 'dashControl'
        })
        .state('dashboard.my-items', {
            url: '/mytrinkets',
            templateUrl: './src/templates/userTrinkets.html',
            controller: 'dashControl'
        });

    $urlRouterProvider.otherwise('/login');
});