var express = require('express');

var app = express();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var User = require('../models/user');

// ======================================================================
// Login 
// ======================================================================
app.post('/', ( req, res ) => {

    var body = req.body;

    User.findOne( { email: body.email }, ( err, userDB ) => {

        if( err ) {
    
            return res.status(500).json({
                ok: false,
                message: 'Error Login',
                error: err
            });

        }

        if( !userDB ) {
    
            return res.status(400).json({
                ok: false,
                message: 'wrong credentials' + body.password + '-' + userDB.password,
                error: err
            });

        }


        if ( !bcrypt.compareSync( body.password, userDB.password )) {
  
            return res.status(400).json({
                ok: false,
                message: 'wrong credentials' + body.password + '-' + userDB.password,
                error: err
            });

        }

        // Create token
        var token = jwt.sign({ user: userDB }, SEED, { expiresIn: 14400 }) // 4 hours

        userDB.password = ':-)';

        res.status(200).json({
            ok: true,
            user: userDB,
            token: token,
            id: userDB._id
        });

    });

});


module.exports = app;