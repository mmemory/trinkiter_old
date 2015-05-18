var Users = require('../models/userModel');

module.exports = {

    make: function(req, res) {
        Users.create(req.body, function(err, response) {
            if (err) res.status(500).json(err);
            else res.json(response);
        })
    },

    get: function(req, res) {
        Users.find(req.query, function(err, result) {
            if (err) res.status(500).json(err);
            else res.json(result);
        })
    },
    // TODO make it so the user moves reference of block to dislikes
    updateDislikes: function(req, res) {
        Users.findByIdAndUpdate(req.params.id, {$push: {}}, function(err, result) {
            if (err) res.status(500).json(err);
            else res.json(result.trinket_info.user_dislikes.push(req.body.trinketId));
        })
    },

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
    }
};