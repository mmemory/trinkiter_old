// Main Requires
var express = require('express');
var app = express();
var cors = require('cors');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session = require('express-session');
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

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});



// Authentication
passport.use(new GoogleStrategy({
        clientID: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: "http://localhost:3000/auth/google/callback"
    },
    function(token, refreshToken, profile, done) {
        //console.log('profile', profile);
        process.nextTick(function() {
            User.findOne({'google.id': profile.id}, function(err, user) {

                if (err) {
                    console.log('error on user login');
                    return done(err);
                }
                if (user) {
                    console.log('User exists already, let them pass!');
                    return done(null, user);
                } else {
                    console.log('created new user, and let them in.');
                    var newUser = new User();

                    newUser.google.id = profile.id;
                    newUser.google.token = token;
                    newUser.google.name = profile.displayName;
                    newUser.google.email = profile.emails[0].value;

                    newUser.save(function(err, result) {
                        if (err) {
                            console.log('Save user Error (server.js:79)', err);
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
app.post('/api/trinkets/:id', TrinketCtrl.assignTrinketLike);
app.post('/api/trinkets/hate/:id', TrinketCtrl.assignTrinketHate);
app.delete('/api/trinkets/:id', TrinketCtrl.remove);

/// Users
app.get('/api/users', UserCtrl.get);
app.post('/api/users', UserCtrl.make);
app.put('/api/users/:id', UserCtrl.update);
app.put('/api/users/remove-match/:matchId/:otherUserId', UserCtrl.removeMatch);
//app.put('/api/users/dislikes/:id', UserCtrl.updateDislikes);
app.delete('/api/users/:id', UserCtrl.remove);

//// User Auth GOOGLE
app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

//app.get('/auth/google', passport.authenticate('google', {
//    scope: ['https://www.googleapis.com/auth/plus.login', 'email']
//}));

app.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/login'}),
    function(req, res) {
        var userID = req.user.google.id;
        // Serve url with userID for custom dashboard url
        res.redirect('/#/dashboard/' + userID + '/trinkets');
    }
);

var userInfo;
app.get('/auth/me', UserCtrl.getCurrentUser);



app.get('/auth/logout', function(req, res) {
    req.logout();
    res.redirect('/#/login');
});



//++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Connections
app.listen(port, function() {
    console.log('Listening on port', port);
});

mongoose.connect(mongoUri);
