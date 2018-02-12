// Requires
var express = require('express');
var mongoose = require('mongoose');

// Init Variables
var app = express();

// Connect BD
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {

    if ( err ) throw err;

    console.log('Database: 27017 \x1b[32m%s\x1b[0m', 'online')

});

// Routes
app.get('/', (req, res, next) => {

    res.status(200).json({
        ok: true,
        message: 'Response from the server'
    });
    
});


// Listen express
app.listen(3000, () => {
    console.log('Express server port 3000: \x1b[32m%s\x1b[0m', 'online');
});