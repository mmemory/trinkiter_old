var mongoose = require('mongoose');

var userModel = new mongoose.Schema({
    google: {
        id: {type: String},
        token: {type: String},
        name: {type: String},
        email: {type: String}
    },
    createdOn: {type: Date, default: Date.now},
    possible_matches: [{
        userWhoLikedYourTrinket: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        trinketTheyLiked: {type: mongoose.Schema.Types.ObjectId, ref: 'Trinket'}
    }],
    final_matches: [{
        userWhoLikedYourTrinket: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        yourTrinketTheyLiked: {type: mongoose.Schema.Types.ObjectId, ref: 'Trinket'},
        theirTrinketYouLiked: {type: mongoose.Schema.Types.ObjectId, ref: 'Trinket'}
    }],
    user_trinkets: [{type: mongoose.Schema.Types.ObjectId, ref: 'Trinket'}],
    user_likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Trinket'}],
    user_dislikes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Trinket'}]
});

module.exports = mongoose.model('User', userModel);