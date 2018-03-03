var express = require('express');

var app = express();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAuthentication = require('../middelwares/authentication');

var Doctor = require('../models/doctor');

// ======================================================================
// Get All doctors
// ======================================================================
app.get('/', (req, res, next) => {

    var from = req.query.from || 0;
    from = Number(from);

    Doctor.find({ }) 
        .skip(from)
        .limit(5)
        .populate('user', 'name email')
        .populate('hospital')
        .exec(
            ( err, doctors) => {

                if( err ) {
    
                    return res.status(500).json({
                        ok: false,
                        message: 'Error get doctors',
                        error: err
                    });
    
                }
                
                Doctor.count({}, (error, count) => {

                    res.status(200).json({
                        ok: true,
                        doctors: doctors,
                        total: count
                    });
                    
                });
    
            }
        );
        
});

// ======================================================================
// Get Doctor by Id
// ======================================================================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Doctor.findById( id )
          .populate('user', 'name email img')
          .populate('hospital') 
          .exec(
            ( err, doctor) => {

                if( err ) {
    
                    return res.status(500).json({
                        ok: false,
                        message: 'Error get doctor',
                        errors: err
                    });
    
                }

                if( !doctor ) {
    
                    return res.status(404).json({
                        ok: false,
                        message: 'The doctor not exists',
                        errors: {message: 'The doctor not exists'}
                    });
    
                }
                
                res.status(200).json({
                    ok: true,
                    doctor: doctor
                });
    
            }
        );
        
});

// ======================================================================
// Create new doctor
// ======================================================================
app.post('/', mdAuthentication.verifyToken , ( req, res ) => {

    var body = req.body;

    var doctor = new Doctor({
        name: body.name,
        user: req.user._id,
        hospital: body.hospital
    });

    doctor.save( (err, doctorSaved) => {

        if ( err ) {

            return res.status(400).json({
                ok: false,
                message: 'Error create Doctor',
                error: err
            });

        }

        res.status(201).json({
            ok: true,
            doctor: doctorSaved
        });

    });

});

// ======================================================================
// Update doctor
// ======================================================================
app.put('/:id', mdAuthentication.verifyToken , ( req, res) => {

    var id = req.params.id;
    var body = req.body;

    Doctor.findById( id, ( err, doctor) => {

        if ( err ) {

            return res.status(500).json({
                ok: false,
                message: 'Error to search an doctor',
                error: err
            });

        }        

        if ( !doctor ) {

            return res.status(400).json({
                ok: false,
                message: 'The doctor with id' + id + ' not exists',
                error: { message: 'Not exist an doctor with this Id' }
            });

        }

        doctor.name = body.name;
        doctor.user = req.user._id;
        doctor.hospital = body.hospital;

        doctor.save( (err, doctorSaved) => {

            if ( err ) {
    
                return res.status(400).json({
                    ok: false,
                    message: 'Error update Doctor',
                    error: err
                });
    
            }
    
            res.status(200).json({
                ok: true,
                doctor: doctorSaved
            });
    
        });

    });

});

// ======================================================================
// Delete doctor
// ======================================================================
app.delete('/:id', mdAuthentication.verifyToken , (req, res) => {

    var id = req.params.id;

    Doctor.findByIdAndRemove( id, ( err, doctorDeleted ) =>  {

        if ( err ) {

            return res.status(500).json({
                ok: false,
                message: 'Error to delete an doctor',
                error: err
            });

        } 
        
        if ( !doctorDeleted ) {

            return res.status(400).json({
                ok: false,
                message: 'The doctor with id' + id + ' not exists',
                error: { message: 'Not exist an doctor with this Id' }
            });

        }

        res.status(200).json({
            ok: true,
            doctor: doctorDeleted
        });

    });

});

module.exports = app;