var Trinkets = require('../models/trinketModel');
var User = require('../models/userModel');

module.exports = {

    make: function(req, res) {
        //console.log('create req.user', req.user);
        // TODO add reference to user that created trinket
        Trinkets
            .create(req.body, function(err, response) {
            //console.log('make trinket response TrinketCtrl.js', response);

            // Add trinket id to user_trinkets reference array in user model
            User
                .findByIdAndUpdate(req.user._id, {$push: {user_trinkets: response._id}}, {new: true}, function(err, result) {
                //console.log('create', result);
                if (err) res.status(500).json(err);
                //else res.json(result);


                // Add user id to user_id reference property in trinket model
                Trinkets
                    .findByIdAndUpdate(response._id, {$push: {user_id: req.user._id}}, {new: true}, function(err, result) {
                    //console.log('new trinket after like', result);

                    if (err) res.status(500).json(err);
                    else res.json(result);
                })
            });
        })
    },

    // TODO this function needs to work. fix it!!
    // When a user likes someone else's trinket this function...
    assignTrinketLike: function(req, res) {
        console.log('like button pressed');
        Trinkets
            .findByIdAndUpdate({_id: req.params.id}, {$addToSet: {usersWhoLiked: req.user._id}}, {new: true}, function(err, trinketResult) {
                //console.log('result in trinketCtrl from like', trinketResult);
                if (err) console.log('Error on assigning user ID to an object they liked', err);
                //res.status(200).json(result);


                //console.log('****User who owns the trinket that was liked:', trinketResult.user_id);
                //console.log('****req.user._id', req.user._id);
                User
                    .findByIdAndUpdate(trinketResult.user_id, {$addToSet: {'possible_matches': {userWhoLikedYourTrinket: req.user._id, trinketTheyLiked: trinketResult._id}}}, {new: true}, function(err, userResult) {
                        //console.log('****User who did the liking:', req.user._id);
                        //console.log('User after someone liked their trinket:', userResult);
                        //console.log(err);
                        if (err) res.status(500).json(err);
                        //console.log('like error', err);

                        //else res.json(userResult);

                        //var trinketUserPossibleMatchArray = userResult.possible_matches;
                        var currentUser = req.user,
                            trinketOwner = userResult,
                            trinketOwnerId = userResult._id.toString(),
                            currentUserId = req.user._id,
                            referencedTrinket = trinketResult,
                            referencedTrinketId = trinketResult._id,
                            trinketOwnerPossibleMatchArray = trinketOwner.possible_matches,
                            currentUserPossibleMatchArray = req.user.possible_matches,
                            currentUserFinalMatchArray = req.user.final_matches,
                            trinketCurrentUserLiked,
                            trinketTrinketOwnerLiked;


                        // Find trinket ID that CURRENT USER LIKED
                        for (var z = 0; z < trinketOwnerPossibleMatchArray.length; z++) {
                            console.log('first loop fired', z);
                            if (currentUserId !== trinketOwnerPossibleMatchArray[z].userWhoLikedYourTrinket) {
                                trinketCurrentUserLiked = trinketOwnerPossibleMatchArray[z].userWhoLikedYourTrinket;
                                //console.log('trinket current user liked', trinketCurrentUserLiked);
                            }
                        }

                        //// Find trinket ID that TRINKET OWNER LIKED
                        //for (var t = 0; t < currentUserPossibleMatchArray.length; t++) {
                        //    console.log('second loop fired', t);
                        //    if (currentUserId !== trinketOwnerPossibleMatchArray[t].userWhoLikedYourTrinket) {
                        //        trinketTrinketOwnerLiked = trinketOwnerPossibleMatchArray[t].userWhoLikedYourTrinket;
                        //        //console.log('trinket current user liked', trinketCurrentUserLiked);
                        //    }
                        //}

                       //console.log('current user possible match array:', currentUserPossibleMatchArray);
                       //console.log('trinket owner id', typeof trinketOwnerId);
                       //console.log('true or false', trinketOwnerId === currentUserPossibleMatchArray[0].userWhoLikedYourTrinket);


                       for (var i = 0; i < currentUserPossibleMatchArray.length; i++) {
                           //console.log('current user possible match array length:', currentUserPossibleMatchArray.length);
                           //console.log('second loop fired', i);

                           //console.log('user who liked your trinket from loop:', typeof currentUserPossibleMatchArray[i].userWhoLikedYourTrinket);
                           //console.log('currentUserPossibleMatchArray:',currentUserPossibleMatchArray);
                           if (trinketOwnerId === currentUserPossibleMatchArray[i].userWhoLikedYourTrinket) {
                               console.log('if fired');

                               User.findByIdAndUpdate(currentUserId,
                                   {$addToSet:
                                       {'final_matches':
                                           {
                                               userWhoLikedYourTrinket: trinketOwnerId,
                                               yourTrinketTheyLiked: referencedTrinketId,
                                               theirTrinketYouLiked: trinketCurrentUserLiked
                                           }
                                       }
                                   }, {new: true}, function(err, finalResult) {
                                   if (err) console.log(err);
                                   console.log('FINAL RESULT FINAL MATCHES:', finalResult.final_matches);
                                   //else res.status(200).json(finalResult);
                               });

                               User.findByIdAndUpdate(trinketOwnerId,
                                   {$addToSet:
                                       {'final_matches':
                                           {
                                               userWhoLikedYourTrinket: currentUserId,
                                               yourTrinketTheyLiked: trinketCurrentUserLiked,
                                               theirTrinketYouLiked: referencedTrinketId

                                           }
                                       }
                                   }, function(err, finalResult) {
                                       if (err) console.log(err);
                                       //console.log('FINAL RESULT FINAL MATCHES:', finalResult.final_matches);
                                       //else res.status(200).json(finalResult);
                                   });

                               //console.log('current user final match array:', currentUserFinalMatchArray);
                           } else {
                               console.log("IDs don't match. Sorry!");

                               //currentUserPossibleMatchArray.push(possibleMatchInfo);
                           }
                       } // second loop
                    });
            })
    },

    assignTrinketHate: function(req, res) {
        Trinkets
            .findByIdAndUpdate({_id: req.params.id}, {$push: {usersWhoDisliked: req.user._id}})
            .populate('usersWhoDisliked')
            .exec(function(err, result) {
                //console.log('result in trinketCtrl from like', result);
                if (err) console.log('Error on assigning user ID to an object they liked', err);
                res.status(200).json('liked result', result);
            });
    },

    get: function(req, res) {
        Trinkets.find()
            .populate('usersWhoLiked')
            .exec(function(err, result) {
                if (err) res.status(500).json(err);
                else res.json(result);
            });
    },

    update: function(req, res) {
        Trinkets.findByIdAndUpdate(req.params.id, req.body, function(err, result) {
            if (err) res.status(500).json(err);
            else res.json(result);
        })
    },

    remove: function(req, res) {
        Trinkets.findByIdAndRemove(req.params.id, req.body, function(err, result) {
            if (err) res.status(500).json(err);
            else res.json(result);
        })
    }
};