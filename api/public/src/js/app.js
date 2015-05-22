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
            url: '/dashboard/:id',
            templateUrl: 'src/templates/dashboard.html',
            controller: 'dashControl',
            resolve: {
                getUser: function(MainService, $stateParams) {
                    return MainService.getCurrentUser($stateParams.id);
                }
            }
        })
        .state('dashboard.my-items', {
            url: '/mytrinkets',
            templateUrl: 'src/templates/my-items.html',
            controller: 'dashControl'
        });

    $urlRouterProvider.otherwise('/login');
});