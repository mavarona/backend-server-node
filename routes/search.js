
var express = require('express');

var app = express();

var Hospital = require('../models/hospital');
var Doctor = require('../models/doctor');
var User = require('../models/user');

// ======================================================================
// Search by collection
// ======================================================================
app.get('/collection/:table/:search', (req, res) => {

    var search = req.params.search;
    var table = req.params.table;
    var regex = new RegExp( search, 'i' );

    var promise;

    switch( table ) {

        case 'users':
            promise = searchUser(regex);
            break;
        
        case 'doctors':
            promise = searchDoctor(regex);
            break;
        
        case 'hospitals':
            promise = searchHospital(regex);
            break;
        default:
            return res.status(400).json({
                ok: false,
                message: 'The type of search are doctors, users and hospitals',
                error: { message: 'Type of collection is not valid' }
            });

    }

    promise.then( data => {

        res.status(200).json({
             ok: true,
             [table]: data
         });

     });


});


// ======================================================================
// Search general
// ======================================================================
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