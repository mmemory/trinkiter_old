var Users = require('../models/userModel');
var Trinket = require('../models/trinketModel');

module.exports = {
    make: function(req, res) {
        Users.create(req.body, function(err, response) {
            if (err) res.status(500).json(err);
            else res.json(response);
        })
    },

    get: function(req, res) {
        console.log('ran get user');
        Users
            .findOne({_id: req.user._id})
            .populate('user_trinkets')
            .exec(function(users) {
                return res.redirect();
            })
    },

    getCurrentUser: function(req, res) {
        //console.log('req.user', req.user);
        Users
            .findById({_id: req.user._id})
            .populate('user_trinkets')
            .exec(function(err, user) {
                if (err) console.log('error', err);
                //console.log('USER FROM /auth/me', user);
                var tailoredUserInfo = {
                    name: user.google.name,
                    email: user.google.email,
                    trinkets: user.user_trinkets
                };
                return res.json(tailoredUserInfo);
            });
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