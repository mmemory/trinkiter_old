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
     * Add new Trinkit
     */
    this.createTrinket = function(title, image, description) {
        var trinketData = {
            title: title,
            image: image,
            description: description,
        };
        //console.log('server created userID', userId);
        var dfd = $q.defer();
        $http.post(trinketUrl, trinketData)
            .success(function(data) {
                //console.log('Trinket successfully created', data);
                dfd.resolve(data);
            })
            .error(function(data) {
                console.error('Error creating trinket', data);
            });
        return dfd.promise;
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
                console.error('Error', data);
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
                console.error('Error', data);
            });
        return dfd.promise;
    };

    ///////////////////////////////////////////
    //      UPDATE DATA TO DATABASE
    /////////////////////////////////////////

    /*
     * Send trinket ID to assign user ID to likes object
     */
    this.sendALike = function(trinketId) {
        var trincketIdUrl = trinketUrl + '/' + trinketId;

        var dfd = $q.defer();
        $http.post(trincketIdUrl)
            .success(function(data) {
                //console.log('data from like in service', data._id);
                //console.log('Successfully liked the trinket');
                console.log('service match data', data);
                dfd.resolve(data);
            })
            .error(function(data) {
                console.error('Failed to like the trinket', data);

                dfd.reject(data)
            });
        return dfd.promise;
    };

    ///////////////////////////////////////////
    //      DELETE DATA FROM DATABASE
    /////////////////////////////////////////

    /*
     * Delete trinket from array of trinkets
     */
    this.deleteTrinket = function(trinketId) {
        var trincketIdUrl = trinketUrl + '/' + trinketId;

        var dfd = $q.defer();
        $http.delete(trincketIdUrl)
            .success(function(data) {
                //console.log('Successfully deleted trinket');
                dfd.resolve(data);
            })
            .error(function(data) {
                console.error('Error', data);
            });
        return dfd.promise;
    };

    /*
     * Delete match from array of matches
     */
    this.deleteMatch = function(matchId, otherUserId) {
        var matchIdUrl = userUrl + '/remove-match/' + matchId + '/' + otherUserId;

        var dfd = $q.defer();
        $http.put(matchIdUrl)
            .success(function(data) {
                //console.log('Successfully deleted match');
                dfd.resolve(data);
            })
            .error(function(data) {
                console.error('Error deleting match', data);
            });
        return dfd.promise;
    }

});


