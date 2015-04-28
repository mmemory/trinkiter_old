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

    //var blocks = [
    //    {
    //        'imgsrc': 'https://unsplash.imgix.net/photo-1429371527702-1bfdc0eeea7d?dpr=2&fit=crop&fm=jpg&h=650&q=75&w=950',
    //        'title': 'Shank pork salami',
    //        'description': 'Ham hock jowl turkey alcatra pork belly drumstick shank. Cow pork spare ribs, fatback pastrami kielbasa strip steak pig jerky sausage andouille. Venison meatball beef, shankle doner picanha tongue leberkas. Turkey andouille leberkas frankfurter alcatra filet mignon meatball tongue fatback doner pork belly strip steak sirloin t-bone. Flank beef short loin jerky chuck pancetta, picanha pork loin.'
    //    },
    //    {
    //        'imgsrc': 'https://ununsplash.imgix.net/photo-1429105049372-8d928fd29ba1?dpr=2&fit=crop&fm=jpg&h=650&q=75&w=950',
    //        'title': 'Here are my trees!',
    //        'description': 'Here are some trees I have that I don\'t need anymore.'
    //    },
    //    {
    //        'imgsrc': 'https://ununsplash.imgix.net/photo-1422433555807-2559a27433bd?dpr=2&fit=crop&fm=jpg&h=650&q=75&w=950',
    //        'title': 'Kevin pork belly',
    //        'description': 'Venison tenderloin bresaola, cow filet mignon salami strip steak biltong meatball. Beef turkey tongue, alcatra ham capicola picanha hamburger drumstick ham hock shank meatloaf salami.'
    //    }
    //];
    //
    //this.returnBlocks = function() {
    //    return blocks;
    //};


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