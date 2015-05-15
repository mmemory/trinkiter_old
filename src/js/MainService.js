var app = angular.module('trinkApp');

app.service('MainService', function(fb, $firebaseAuth, $location, $firebaseArray, $firebaseObject, $q) {

    ///////////////////////////////////////////
    //      Authentication
    /////////////////////////////////////////

    var authObj = $firebaseAuth(new Firebase(fb.url));
    var ref = new Firebase(fb.url);
    var user = ref.getAuth().uid;

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

    // Get the block data from firebase
    this.getBlockData = function() {
         return $firebaseArray(new Firebase(fb.url + '/blocks'));
    };

    // Find out current user's name
    //this.getUserName = function() {
        //return $firebaseObject(new Firebase(fb.url + '/users/' + user)).$loaded();

        //var userObj = $firebaseObject(new Firebase(fb.url + '/users/' + user));

        //var dfd = $q.defer();
        //userObj.$loaded().then(function(data) {
            //dfd.resolve(data.userInfo.firstname);
           //return data.userInfo.firstname;
       // });
        //return dfd.promise;

    //};

    this.getUserName = function() {
        return $firebaseObject(new Firebase(fb.url + '/users/' + user)).$loaded();
    };

    ///////////////////////////////////////////
    //      Push Data
    /////////////////////////////////////////

    var blockObj = $firebaseArray(new Firebase(fb.url + '/blocks'));

    this.pushBlockData = function(imageLink, title, description, userid) {
        var dfd = $q.defer();
        blockObj.$add({
            imageurl: imageLink,
            title: title,
            description: description,
            userid: userid
        }).then(function(data) {
            var blockId = $firebaseObject(data).$id;
            var userId = ref.getAuth().uid;
            var userObj = $firebaseArray(new Firebase(fb.url + '/users/' + userId + '/userBlocks'));

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