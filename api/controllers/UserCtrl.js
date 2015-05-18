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