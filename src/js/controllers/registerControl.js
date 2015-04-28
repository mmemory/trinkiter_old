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