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