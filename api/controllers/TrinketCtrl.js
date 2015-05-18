var Trinkets = require('../models/trinketModel');

module.exports = {

    make: function(req, res) {
        Trinkets.create(req.body, function(err, response) {
            if (err) res.status(500).json(err);
            else res.json(response);
        })
    },

    get: function(req, res) {


        Trinkets.find(req.query, function(err, result) {
            if (err) res.status(500).json(err);
            else res.json(result);
        })
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