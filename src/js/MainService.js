var app = angular.module('trinkApp');

app.service('MainService', function(fb, $firebaseAuth, $location, $firebaseArray, $firebaseObject, $q) {

    ///////////////////////////////////////////
    //      Authentication
    /////////////////////////////////////////

    var user;

    var authObj = $firebaseAuth(new Firebase(fb.url));
    var ref = new Firebase(fb.url);

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

                user = {
                    authData: authData.uid
                };
                $location.path('/dashboard/' + authData.uid);
            })
    };

    this.returnUser = function() {
        return user;
    };

    ///////////////////////////////////////////
    //      Password Reset
    /////////////////////////////////////////

    this.passReset = function(email) {
        return authObj.$resetPassword({
            email: email
        })
    };

    ///////////////////////////////////////////
    //      Pull Data
    /////////////////////////////////////////

    this.getBlockData = function() {
        return $firebaseObject(new Firebase(fb.url + '/blocks'));
    };

    ///////////////////////////////////////////
    //      Push Data
    /////////////////////////////////////////

    var blockObj = $firebaseArray(new Firebase(fb.url + '/blocks'));

    this.pushBlockData = function(imageLink, title, description) {
        var dfd = $q.defer();
        blockObj.$add({
            imageurl: imageLink,
            title: title,
            description: description
        }).then(function(data) {
            var blockId = $firebaseObject(data).$id;
            var userId = ref.getAuth().uid;
            var userObj = $firebaseArray(new Firebase(fb.url + '/users/' + '/'+userId+'/' + '/userBlocks'));

            userObj.$add({
                blockId: blockId
            });

            //console.log(blockId);
            //console.log(userId);
            //console.log('data', $firebaseObject(data));
            //console.log('ref', ref.getAuth());
        });
        return dfd.promise;
    }
});