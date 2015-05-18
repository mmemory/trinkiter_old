// Main Requires
var express = require('express');
var app = express();
var cors = require('cors');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');



// Config
var port = process.env.PORT || 3000;
var mongoUri = 'mongodb://localhost/trinkiter';



// Local Imports
/// Controllers
var TrinketCtrl = require('./controllers/TrinketCtrl');
var UserCtrl = require('./controllers/UserCtrl');



// Middleware
app.use(cors());
app.use(bodyParser.json());



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
app.delete('/api/users/:id', UserCtrl.remove);



// Connections
app.listen(port, function() {
    console.log('Listening on port', port);
});

mongoose.connect(mongoUri);
