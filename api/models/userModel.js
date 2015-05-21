var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var userModel = new mongoose.Schema({
    google: {
        id: {type: String},
        token: {type: String},
        name: {type: String},
        email: {type: String}
    },
    createdOn: {type: Date, default: Date.now},
    user_trinkets: [{type: mongoose.Schema.Types.ObjectId, ref: 'Trinket'}],
    user_likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Trinket'}],
    user_dislikes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Trinket'}]
    //archived_trinkets: [{type: mongoose.Schema.Types.ObjectId, ref: 'Trinket'}]
    //user_matches: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});

module.exports = mongoose.model('User', userModel);