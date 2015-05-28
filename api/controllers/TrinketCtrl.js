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

    // TODO add trinket ID to user_likes on like
    // When User#1 (current user) likes User#2's trinket this function checks for an existing possible match in User#2's model. If none exist, then one is created. If one exists, then a final match is created in both users' models, and the possible matches are removed
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
                    .findByIdAndUpdate(trinketResult.user_id, {$addToSet: {'possible_matches': {userWhoLikedYourTrinket: req.user._id, trinketTheyLiked: trinketResult._id}}}, {new: true}, function(err, trinketOwnerResult) {
                        //console.log('****User who did the liking:', req.user._id);
                        //console.log('User after someone liked their trinket:', userResult);
                        //console.log(err);
                        if (err) res.status(500).json(err);
                        //console.log('like error', err);

                        //else res.json(userResult);

                        User
                            .findByIdAndUpdate(req.user._id, {$addToSet: {'user_likes': trinketResult._id}}, {new: true}, function(err, userResult) {

                                //var trinketUserPossibleMatchArray = userResult.possible_matches;
                                var currentUser = userResult,
                                    trinketOwner = trinketOwnerResult,
                                    referencedTrinket = trinketResult,

                                    currentUserId = currentUser._id.toString(),
                                    trinketOwnerId = trinketOwner._id.toString(),
                                    referencedTrinketId = referencedTrinket._id,
                                    trinketOwnerPossibleMatchArray = trinketOwner.possible_matches,
                                    currentUserPossibleMatchArray = currentUser.possible_matches,
                                    currentUserFinalMatchArray = currentUser.final_matches,

                                // Variable is figured out in loop below
                                    trinketTrinketOwnerLiked;



                                //console.log('current user ID:', currentUserId);
                                //console.log('trinket owner ID:', trinketOwnerId);
                                //console.log('referenced trinket ID:', referencedTrinketId);
                                //console.log('current user possible matches array:', currentUserPossibleMatchArray);
                                //console.log('current user possible matches array length:', currentUserPossibleMatchArray.length);
                                //console.log('trinket owner possible matches array:', trinketOwnerPossibleMatchArray);

                                for (var z = 0; z < currentUserPossibleMatchArray.length; z++) {
                                    //console.log('first loop fired', z);
                                    if (trinketOwnerId === currentUserPossibleMatchArray[z].userWhoLikedYourTrinket.toString()) {
                                        trinketTrinketOwnerLiked = currentUserPossibleMatchArray[z].trinketTheyLiked;
                                        console.log('trinket current user liked:', trinketTrinketOwnerLiked);
                                        break;
                                    }
                                }

                                //console.log('current user possible match array:', currentUserPossibleMatchArray);
                                //console.log('trinket owner id', typeof trinketOwnerId);
                                //console.log('true or false', trinketOwnerId === currentUserPossibleMatchArray[0].userWhoLikedYourTrinket);
                                //console.log(trinketOwnerId === currentUserPossibleMatchArray[0].userWhoLikedYourTrinket);


                                /*
                                This adds
                                 */
                                if (trinketOwnerPossibleMatchArray.length > 0 || currentUserPossibleMatchArray.length > 0) {
                                    for (var i = 0; i < currentUserPossibleMatchArray.length; i++) {
                                        //console.log('current user possible match array length:', currentUserPossibleMatchArray.length);
                                        //console.log('second loop fired', i);

                                        //console.log('user who liked your trinket from loop:', typeof currentUserPossibleMatchArray[i].userWhoLikedYourTrinket);
                                        //console.log('currentUserPossibleMatchArray:',currentUserPossibleMatchArray);
                                        if (trinketOwnerId === currentUserPossibleMatchArray[i].userWhoLikedYourTrinket.toString()) {

                                            console.log('if fired', i);

                                            User.findByIdAndUpdate(currentUserId,
                                                {
                                                    $addToSet: {
                                                        'final_matches': {
                                                            userWhoLikedYourTrinket: trinketOwnerId,
                                                            yourTrinketTheyLiked: trinketTrinketOwnerLiked,
                                                            theirTrinketYouLiked: referencedTrinketId
                                                        }
                                                    }
                                                }, {new: true}, function(err, result) {
                                                    if (err) res.status(500).json(err);
                                                    //console.log('FINAL RESULT FINAL MATCHES:', result.final_matches);
                                                    //else res.status(200).json(finalResult);
                                                    console.log('success in matching!');

                                                    //console.log('+++++++type of result is:', typeof result, 'and it looks like this:', result);
                                                    //result.possible_matches.splice(i, 1);


                                                    // TODO delete possible match for each user when a final match is made

                                                    User.findByIdAndUpdate(result._id, {$pull: {possible_matches: { userWhoLikedYourTrinket: trinketOwner._id }}}, function(err, result) {
                                                        if (err) res.json(err);

                                                        console.log('deleted possible match from current user');
                                                    });


                                                    User.findByIdAndUpdate(trinketOwnerId,
                                                        {
                                                            $addToSet: {
                                                                'final_matches': {
                                                                    userWhoLikedYourTrinket: currentUserId,
                                                                    yourTrinketTheyLiked: referencedTrinketId,
                                                                    theirTrinketYouLiked: trinketTrinketOwnerLiked
                                                                }
                                                            }
                                                        }, function(err, finalResult) {
                                                            if (err) res.status(500).json(err);
                                                            //console.log('FINAL RESULT FINAL MATCHES:', finalResult.final_matches);
                                                            res.end(finalResult);

                                                            // else return res.status(200).json(finalResult);

                                                            User.findByIdAndUpdate(finalResult._id, {$pull: {possible_matches: { userWhoLikedYourTrinket: currentUser._id }}}, function(err, result) {
                                                                if (err) res.json(err);

                                                                console.log('deleted possible match from other user');
                                                            });
                                                        });

                                                    res.end();
                                                });




                                            //console.log('current user final match array:', currentUserFinalMatchArray);
                                        } else {
                                            console.log("IDs don't match. Sorry!");

                                            //currentUserPossibleMatchArray.push(possibleMatchInfo);
                                        }
                                    } //second loop
                                } // if above zero
                            });
                    }); // findByIdAndUpdate - User
            }); // findByIdAndUpdate - Trinket
    }, // assign trinket like

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
        User.findById(req.user._id, function(err, user) {
            if (err) res.json(err);

            var userLikes = user.user_likes;

            Trinkets
                .find({_id: {$nin: userLikes}}, function(err, result) {
                    if (err) res.status(500).json(err);
                    else res.json(result);


                })

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