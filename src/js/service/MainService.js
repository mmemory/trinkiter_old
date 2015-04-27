var app = angular.module('trinkApp');

app.service('MainService', function(fb, $firebaseAuth, $location) {

    ///////////////////////////////////////////
    //      Authentication
    /////////////////////////////////////////

    var authObj = $firebaseAuth(new Firebase(fb.url));

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
                $location.path('/dashboard');
            })
    };

    ///////////////////////////////////////////
    //      Password Reset
    /////////////////////////////////////////

    this.passReset = function(email) {
        return authObj.$resetPassword({
            email: email
        })
    }
});