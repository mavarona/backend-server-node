// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Init Variables
var app = express();

// Body Parser
// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json 
app.use(bodyParser.json());

// Import routes
var appRoutes = require('./routes/app');
var doctorRoutes = require('./routes/doctor');
var hospitalRoutes = require('./routes/hospital');
var loginRoutes = require('./routes/login');
var userRoutes = require('./routes/user');
var searchRoutes = require('./routes/search');

// Connect BD
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {

    if ( err ) throw err;

    console.log('Database: 27017 \x1b[32m%s\x1b[0m', 'online');

});

// Routes
app.use('/user', userRoutes);
app.use('/doctor', doctorRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/login', loginRoutes);
app.use('/search', searchRoutes);
app.use('/', appRoutes);

// Listen express
app.listen(3000, () => {
    console.log('Express server port 3000: \x1b[32m%s\x1b[0m', 'online');
});