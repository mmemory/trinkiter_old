var mongoose = require('mongoose');

var userModel = new mongoose.Schema({
    user_info: {
        name: {
            first_name: {type: String, required: true},
            last_name: {type: String, required: true}
        },
        email: {type: String, required: true},
        createdOn: {type: Date, default: Date.now}
    },
    trinket_info: {
        user_likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Trinket'}],
        user_dislikes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Trinket'}],
        user_trinkets: [{type: mongoose.Schema.Types.ObjectId, ref: 'Trinket'}],
        archived_trinkets: [{type: mongoose.Schema.Types.ObjectId, ref: 'Trinket'}]
    },
    user_matches: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});

module.exports = mongoose.model('User', userModel);