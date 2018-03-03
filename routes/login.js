var express = require('express');

var app = express();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var User = require('../models/user');

const { OAuth2Client } = require('google-auth-library');

const GOOGLE_CLIENT_ID = require('../config/config').GOOGLE_CLIENT_ID;
const GOOGLE_SECRET = require('../config/config').GOOGLE_SECRET;

// ======================================================================
// Authentication google
// ======================================================================

app.post('/google', (req, res) => {

    var token = req.body.token;

    var client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_SECRET, '');

    client.verifyIdToken(
        {
            idToken: token,
            audience: GOOGLE_CLIENT_ID
        },
        (e, login) =>{

            if ( e ) {
                return res.status(400).json({
                    ok: false,
                    message: 'Token not valid',
                    errors: e
                });
            }

            var payload = login.getPayload();
            var userid = payload['sub'];

            User.findOne({ email: payload.email }, ( e, user )=>{
                if ( e ) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error to search user',
                        errors: e
                    });
                }

                if ( user ) {

                    if (user.google === false) {
                        return res.status(400).json({
                            ok: false,
                            message: 'Must login with database of application',
                            errors: e
                        });
                    } else {
                        var token = jwt.sign({ user: user }, SEED, { expiresIn: 14400 }); // 4 hours

                        user.password = ':-)';

                        res.status(200).json({
                            ok: true,
                            user: user,
                            token: token,
                            id: user._id,
                            menu: getMenu(user.role)
                        });
                    }

                } else {

                    var userNew = new User();
                    userNew.name = payload.name;
                    userNew.email = payload.email;
                    userNew.password = ':-)';
                    userNew.img = payload.picture;
                    userNew.google = true;

                    userNew.save( (err, userDB) => {

                        if( err ) {
                            return res.status(500).json({
                                ok: false,
                                message: 'Error to create user' + e,
                                errors: e
                            });
                        }

                        var token = jwt.sign({ user: userDB }, SEED, { expiresIn: 14400 }) // 4 hours

                        userDB.password = ':-)';

                        res.status(200).json({
                            ok: true,
                            user: userDB,
                            token: token,
                            id: userDB._id,
                            menu: getMenu(userDB.role)
                        });

                    });

                }

            });

        });

});

// ======================================================================
// Authentication basic
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
                message: 'wrong credentials' + body.password,
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
            id: userDB._id,
            menu: getMenu(userDB.role)
        });

    });

});

function getMenu ( ROLE ) {

    menu = [
        {
          title: 'Main',
          icon: 'mdi mdi-gauge,',
          submenu: [
            {title: 'Dashboard', url: '/dashboard'},
            {title: 'Graphs', url: '/graphs1'},
            {title: 'ProgressBar', url: '/progress'},
            {title: 'Promises', url: '/promises'},
            {title: 'Rxjs', url: '/rxjs'},
          ]
        },
        {
          title: 'maintenance',
          icon: 'mdi mdi-folder-lock-open',
          submenu: []
        }
      ];

      if ( ROLE === 'ADMIN_ROLE' ) {
          menu[1].submenu.unshift({ title: 'Users', url: '/users' });
          menu[1].submenu.unshift({ title: 'Hospitals', url: '/hospitals' });
          menu[1].submenu.unshift({ title: 'Doctors', url: '/doctors' });
      }

      return menu;

}


module.exports = app;
