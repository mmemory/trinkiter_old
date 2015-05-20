// Main Requires
var express = require('express');
var app = express();
var cors = require('cors');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session = require('express-session');
//var GoogleStrategy = require('passport-google').Strategy;
//var passLocal = require('passport-local');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


// Config
var port = process.env.PORT || 3000;
var mongoUri = 'mongodb://localhost/trinkiter';


// Local Imports
/// Controllers
var TrinketCtrl = require('./controllers/TrinketCtrl');
var UserCtrl = require('./controllers/UserCtrl');
var configAuth = require('./config/auth');
var User = require('./models/userModel');


// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(session({
    secret: 'sa;ldkvwljfskaljf;lasf',
    saveUninitialized: true,
    resave: true
}));
app.use(passport.initialize());
app.use(passport.session());


// Authentication
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use(new GoogleStrategy({
        clientID: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: "http://127.0.0.1:3000/auth/google/callback"
    },
    function(token, refreshToken, profile, done) {
        console.log(profile);
        process.nextTick(function() {
            User.findOne({'google.id': profile.id}, function(err, user) {
                if (err) {
                    return done(err);
                }
                if (user) {
                    return done(null, user);
                } else {
                    var newUser = new User();

                    newUser.google.id = profile.id;
                    newUser.google.token = token;
                    newUser.google.name = profile.displayName;
                    newUser.google.email = profile.emails[0].value;

                    newUser.save(function(err, result) {
                        if (err) {
                            console.log(err);
                        }
                        return done(null, result);
                    });
                }
            });
        });
    }
));


// Endpoints
/// Trinkets
app.get('/api/trinkets', TrinketCtrl.get);
app.post('/api/trinkets', TrinketCtrl.make);
app.put('/api/trinkets/:id', TrinketCtrl.update);
app.delete('/api/trinkets/:id', TrinketCtrl.remove);

/// Users
app.get('/api/users', UserCtrl.get);
app.post('/api/users', UserCtrl.make);
app.put('/api/users/:id', UserCtrl.update);
app.put('/api/users/dislikes/:id', UserCtrl.updateDislikes);
app.delete('/api/users/:id', UserCtrl.remove);

//// User Auth
app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

app.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '#/login'}),
    function(req, res) {
        res.redirect('#/dashboard');
    });


// Connections
app.listen(port, function() {
    console.log('Listening on port', port);
});

mongoose.connect(mongoUri);
