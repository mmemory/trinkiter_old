var app = angular.module('trinkApp');

app.service('MainService', function($http, CONSTANT, $q) {

    // Globals
    var url = CONSTANT.url,
        trinketUrl = url + 'api/trinkets',
        userUrl = url + 'api/users',
        currentUserUrl = url + 'auth/me';


    ///////////////////////////////////////////
    //      POST DATA TO DATABASE
    /////////////////////////////////////////

    /*
     * Register User
     */
    this.registerUser = function(email, firstName, lastName) {
        var userData = {
            user_info: {
                name: {
                    first_name: firstName,
                    last_name: lastName
                },
                email: email
            }
        };
        $http.post(userUrl, userData)
            .success(function(data) {
                console.log('user info sent to mongodb');
            })
            .error(function(data) {
                console.log('Error', data);
            })
    };

    /*
     * Add new Trinkit
     */
    this.createTrinket = function(title, image, description) {
        var trinketData = {
            title: title,
            image: image,
            description: description,
        };
        //console.log('server created userID', userId);

        $http.post(trinketUrl, trinketData)
            .success(function(data) {
                console.log('Trinket successfully created');
            })
            .error(function(data) {
                console.log('Error', data);
            })
    };


    ///////////////////////////////////////////
    //      GET DATA FROM DATABASE
    /////////////////////////////////////////

    /*
     * Get trinket list for display
     */
    this.getTrinketList = function() {
        var dfd = $q.defer();
        $http.get(trinketUrl)
            .success(function(data) {
                dfd.resolve(data);
            })
            .error(function(data) {
                console.log('Error', data);
            });
        return dfd.promise;
    };

    /*
     * Get logged in user info
     */
    this.getCurrentUser = function() {
        var dfd = $q.defer();
        $http.get(currentUserUrl)
            .success(function(data) {
                //console.log('user data from service', data);
                dfd.resolve(data);
            })
            .error(function(data) {
                console.log('Error', data);
            });
        return dfd.promise;
    };

    ///////////////////////////////////////////
    //      UPDATE DATA TO DATABASE
    /////////////////////////////////////////

    /*
     * Get logged in user info
     */
    this.sendALike = function(trinketId) {
        var trincketIdUrl = trinketUrl + '/' + trinketId;

        var sendId = {
            _id: trinketId
        };

        var dfd = $q.defer();
        $http.put(trincketIdUrl, sendId)
            .success(function(data) {
                console.log('data from like in service', data._id);
                console.log('Successfully liked the trinket');
                dfd.resolve(data._id);
            })
            .error(function(data) {
                console.log('Failed to like the trinket', data);
            });
        return dfd.promise;
    };

    ///////////////////////////////////////////
    //      DELETE DATA FROM DATABASE
    /////////////////////////////////////////

    /*
     * Delete trinket from array of trinkets
     */
    //TODO this needs to remove from user dashboard, not from database completely
    this.deleteTrinket = function(trinketId) {
        var trincketIdUrl = trinketUrl + '/' + trinketId;

        var dfd = $q.defer();
        $http.delete(trincketIdUrl)
            .success(function(data) {
                console.log('Successfully deleted');
                dfd.resolve(data);
            })
            .error(function(data) {
                console.log('Error', data);
            });
        return dfd.promise;
    };

    this.dislikeTrinket = function(trinketId, userId) {
        var userIdUrl = userUrl + '/dislikes/' + userId;

        var dfd = $q.defer();
        $http.put(userIdUrl, {trinketId: trinketId})
            .success(function(data) {
                console.log('Successfully disliked');
                dfd.resolve(data);
            })
            .error(function(data) {
                console.log('Error', data);
            });
        return dfd.promise;
    }

});


