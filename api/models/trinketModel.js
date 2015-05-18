var mongoose = require('mongoose');

var trinketModel = new mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    title: {type: String, required: true},
    image: {type: String},
    description: {type: String},
    createdOn: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Trinket', trinketModel);