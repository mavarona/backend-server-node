var express = require('express');

var app = express();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAuthentication = require('../middelwares/authentication');

var User = require('../models/user');

// ======================================================================
// Get All users
// ======================================================================
app.get('/', (req, res, next) => {

    User.find({ }, 'name email img role') 

        .exec(
            ( err, users) => {

                if( err ) {
    
                    return res.status(500).json({
                        ok: false,
                        message: 'Error get Users',
                        error: err
                    });
    
                }
    
                res.status(200).json({
                    ok: true,
                    users: users
                });
    
            }
        );
        
});

// ======================================================================
// Create new user
// ======================================================================
app.post('/', mdAuthentication.verifyToken , ( req, res ) => {

    var body = req.body;

    var user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync( body.password, 10 ),
        img: body.img,
        role: body.role
    });

    user.save( (err, userSaved) => {

        if ( err ) {

            return res.status(400).json({
                ok: false,
                message: 'Error create User',
                error: err
            });

        }

        userSaved.password = ':-)';

        res.status(201).json({
            ok: true,
            user: userSaved,
            userToken: req.user
        });

    });

});

// ======================================================================
// Update new user
// ======================================================================
app.put('/:id', mdAuthentication.verifyToken , ( req, res) => {

    var id = req.params.id;
    var body = req.body;

    User.findById( id, ( err, user) => {

        if ( err ) {

            return res.status(500).json({
                ok: false,
                message: 'Error to search an user',
                error: err
            });

        }        

        if ( !user ) {

            return res.status(400).json({
                ok: false,
                message: 'The user with id' + id + ' not exists',
                error: { message: 'Not exist an user with this Id' }
            });

        }

        user.name = body.name;
        user.email = body.email;
        user.role = body.role;

        user.save( (err, userSaved) => {

            if ( err ) {
    
                return res.status(400).json({
                    ok: false,
                    message: 'Error update User',
                    error: err
                });
    
            }

            userSaved.password = ':-)';
    
            res.status(200).json({
                ok: true,
                user: userSaved
            });
    
        });

    });

});

// ======================================================================
// Delete user
// ======================================================================
app.delete('/:id', mdAuthentication.verifyToken , (req, res) => {

    var id = req.params.id;

    User.findByIdAndRemove( id, ( err, userDeleted ) =>  {

        if ( err ) {

            return res.status(500).json({
                ok: false,
                message: 'Error to delete an user',
                error: err
            });

        } 
        
        if ( !userDeleted ) {

            return res.status(400).json({
                ok: false,
                message: 'The user with id' + id + ' not exists',
                error: { message: 'Not exist an user with this Id' }
            });

        }

        userDeleted.password = ':-)';

        res.status(200).json({
            ok: true,
            user: userDeleted
        });

    });

});

module.exports = app;