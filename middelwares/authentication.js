
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;


// ======================================================================
// Verify token
// ======================================================================

exports.verifyToken = function ( req, res, next) {

    var token = req.query.token;

    jwt.verify( token, SEED, ( err, decoded ) => {

        if( err ) {
    
            return res.status(401).json({
                ok: false,
                message: 'Not valid token',
                error: err
            });

        }

        req.user = decoded.user;
        
        next();

    });

}

// ======================================================================
// Verify ADMIN
// ======================================================================

exports.verifyADMIN_ROLE = function ( req, res, next) {

    var user = req.user;

    if ( user.role === 'ADMIN_ROLE' ) {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            message: 'Not administrator',
            error: {message: 'Not administrator'}
        });
    }

}

// ======================================================================
// Verify ADMIN
// ======================================================================

exports.verifyADMIN_ROLE_Or_SAMEUSER = function ( req, res, next) {

    var user = req.user;
    var id = req.params.id;

    if ( user.role === 'ADMIN_ROLE' || user._id === id ) {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            message: 'Not administrator and is the same user',
            error: {message: 'Not administrator and is the same user'}
        });
    }

}