
var express = require('express');

var app = express();

var Hospital = require('../models/hospital');
var Doctor = require('../models/doctor');
var User = require('../models/user');

// Routes
app.get('/all/:search', (req, res, next) => {

    var search = req.params.search;
    var regex = new RegExp( search, 'i' );

    Promise.all( [searchHospital(regex),
                  searchDoctor(regex),
                  searchUser(regex)])
            .then( response => {

                res.status(200).json({
                    ok: true,
                    hospitals: response[0],
                    doctors: response[1],
                    users: response[2]
                });

            });
    
});

function searchHospital ( regex ) {

    return new Promise( ( resolve, reject) => {

        Hospital.find({ name: regex })
            .populate('user', 'name email')
            .exec((err, hospitals) => {

                if ( err ) {
                    reject("Error in hospitals", err);
                } else {
                    resolve(hospitals);
                }

            });

    }) ;

}

function searchDoctor ( regex ) {

    return new Promise( ( resolve, reject) => {

        Doctor.find({ name: regex })
            .populate('user', 'name email')
            .exec((err, doctors) => {

                if ( err ) {
                    reject("Error in doctors", err);
                } else {
                    resolve(doctors);
                }

            });

    }) ;

}

function searchUser ( regex ) {

    return new Promise( ( resolve, reject) => {

        User.find({}, 'name email role')
            .or([ { 'name': regex } , { 'email': regex } ])
            .exec( (err, users) => {
                if ( err ) {
                    reject("Error in users", err);
                } else {
                    resolve(users);
                }
            });

    }) ;

}

module.exports = app;