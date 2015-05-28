var Users = require('../models/userModel');
var Trinket = require('../models/trinketModel');

module.exports = {
    make: function(req, res) {
        Users.create(req.body, function(err, response) {
            if (err) res.status(500).json(err);
            else res.json(response);
        })
    },

    get: function(req, res) {
        console.log('ran get user');
        Users
            .find()
            .populate('user_trinkets')
            .populate('possible_matches.userWhoLikedYourTrinket')
            .populate('possible_matches.trinketTheyLiked')
            .populate('final_matches.userWhoLikedYourTrinket')
            .populate('final_matches.yourTrinketTheyLiked')
            .populate('final_matches.theirTrinketYouLiked')
            .exec(function(err, result) {
                if (err) res.status(500).json(err);
                res.json(result);
            })
    },

    getCurrentUser: function(req, res) {
        //console.log('req.user', req.user);
        Users
            .findById({_id: req.user._id})
            .populate('user_trinkets')
            .populate('possible_matches.userWhoLikedYourTrinket')
            .populate('possible_matches.trinketTheyLiked')
            .populate('final_matches.userWhoLikedYourTrinket')
            .populate('final_matches.yourTrinketTheyLiked')
            .populate('final_matches.theirTrinketYouLiked')
            .exec(function(err, user) {
                if (err) console.log('error', err);
                //console.log('USER FROM /auth/me', user);
                var matchArray = user.final_matches;
                //console.log('user FINAL MATCHES userctrl 42', user.final_matches);


                //console.log('user in UserCtrl (43)', user);

                for (var i = 0; i < matchArray.length; i++) {
                    //console.log(i, '||||||||||||||||||||||||||', matchArray[i]);
                }

                var tailoredUserInfo = {
                    name: user.google.name,
                    email: user.google.email,
                    trinkets: user.user_trinkets,
                    matches: user.final_matches,
                    _id: user._id
                }; //tailored info
                return res.status(200).json(tailoredUserInfo);
            });
    },



    // TODO make it so the user moves reference of block to dislikes
    //updateDislikes: function(req, res) {
    //    Users.findByIdAndUpdate(req.params.id, {$push: {}}, function(err, result) {
    //        if (err) res.status(500).json(err);
    //        else res.json(result.trinket_info.user_dislikes.push(req.body.trinketId));
    //    })
    //},

    update: function(req, res) {
        Users.findByIdAndUpdate(req.params.id, req.body, function(err, result) {
            if (err) res.status(500).json(err);
            else res.json(result);
        })
    },

    remove: function(req, res) {
        Users.findByIdAndRemove(req.params.id, req.body, function(err, result) {
            if (err) res.status(500).json(err);
            else res.json(result);
        })
    },

    removeMatch: function(req, res) {
        Users.findByIdAndUpdate(req.user._id, {$pull: {final_matches: {_id: req.params.matchId}}}, function(err, result) {
            if (err) res.status(500).json(err);
            else res.json(result);

            //var otherUserMatchArray = req.params.otherUserId.final_matches;
            //
            //for (var i = 0; i < otherUserMatchArray.length; i++) {
            //
            //}
            //
            //Users.findByIdAndUpdate(req.params.otherUserId, {$pull: {final_matches: {_id:}}} , function(err, userResult) {
            //
            //});

            console.log('DELETED MATCH ON SERVER TOO');
        })
    }
};