var Trinkets = require('../models/trinketModel');
var User = require('../models/userModel');

module.exports = {

    make: function(req, res) {
        //console.log('create req.user', req.user);
        // TODO add reference to user that created trinket
        Trinkets.create(req.body, function(err, response) {
            //console.log('make trinket response TrinketCtrl.js', response);

            User.findByIdAndUpdate(req.user._id, {$push: {user_trinkets: response._id}}, {new: true}, function(err, result) {
                console.log('create', result);
                if (err) res.status(500).json(err);
                else res.json(result);
            })
        })
    },

    assignTrinketLike: function(req, res) {
        Trinkets
            .findByIdAndUpdate({_id: req.params.id}, {$push: {usersWhoLiked: req.user._id}})
            .exec(function(err, result) {
                console.log('result in trinketCtrl from like', result);
                if (err) console.log('Error on assigning user ID to an object they liked', err);
                res.status(200).json(result);
            })
    },

    assignTrinketHate: function(req, res) {
        Trinkets
            .findByIdAndUpdate({_id: req.params.id}, {$push: {usersWhoDisliked: req.user._id}})
            .populate('usersWhoDisliked')
            .exec(function(err, result) {
                console.log('result in trinketCtrl from like', result);
                if (err) console.log('Error on assigning user ID to an object they liked', err);
                res.status(200).json('liked result', result);
            })
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