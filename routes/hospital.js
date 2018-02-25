var express = require('express');

var app = express();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAuthentication = require('../middelwares/authentication');

var Hospital = require('../models/hospital');

// ======================================================================
// Get All hospitals
// ======================================================================
app.get('/', (req, res, next) => {

    var from = req.query.from || 0;
    from = Number(from);

    Hospital.find({ })
        .skip(from)
        .limit(5) 
        .populate('user', 'name email')
        .exec(
            ( err, hospitals) => {

                if( err ) {
    
                    return res.status(500).json({
                        ok: false,
                        message: 'Error get Hospitals',
                        error: err
                    });
    
                }

                Hospital.count({}, (error, count) => {

                    res.status(200).json({
                        ok: true,
                        hospitals: hospitals,
                        total: count
                    });
                    
                });
    
            }
        );
        
});

// ======================================================================
// Create new hospital
// ======================================================================
app.post('/', mdAuthentication.verifyToken , ( req, res ) => {

    var body = req.body;

    var hospital = new Hospital({
        name: body.name,
        user: req.user._id
    });

    hospital.save( (err, hospitalSaved) => {

        if ( err ) {

            return res.status(400).json({
                ok: false,
                message: 'Error create Hospital',
                error: err
            });

        }

        res.status(201).json({
            ok: true,
            hospital: hospitalSaved
        });

    });

});

// ==========================================
//  Obtener Hospital por ID
// ==========================================
app.get('/:id', (req, res) => {
    var id = req.params.id;
    Hospital.findById(id)
        .populate('user', 'name img email')
        .exec((err, hospital) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error to search hospital',
                    errors: err
                }); 
            }
            
            if (!hospital) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'The hospital with id ' + id + ' not exists',
                    errors: 'Not exists an hospital with that id'
                }); 
            }

            res.status(200).json({
                ok: true,
                hospital: hospital
            });

        });
    }
);  

// ======================================================================
// Update hospital
// ======================================================================
app.put('/:id', mdAuthentication.verifyToken , ( req, res) => {

    var id = req.params.id;
    var body = req.body;

    Hospital.findById( id, ( err, hospital) => {

        if ( err ) {

            return res.status(500).json({
                ok: false,
                message: 'Error to search an hospital',
                error: err
            });

        }        

        if ( !hospital ) {

            return res.status(400).json({
                ok: false,
                message: 'The hospital with id' + id + ' not exists',
                error: { message: 'Not exist an hospital with this Id' }
            });

        }

        hospital.name = body.name;
        hospital.user = req.user._id;

        hospital.save( (err, hospitalSaved) => {

            if ( err ) {
    
                return res.status(400).json({
                    ok: false,
                    message: 'Error update Hospital',
                    error: err
                });
    
            }
    
            res.status(200).json({
                ok: true,
                hospital: hospitalSaved
            });
    
        });

    });

});

// ======================================================================
// Delete hospital
// ======================================================================
app.delete('/:id', mdAuthentication.verifyToken , (req, res) => {

    var id = req.params.id;

    Hospital.findByIdAndRemove( id, ( err, hospitalDeleted ) =>  {

        if ( err ) {

            return res.status(500).json({
                ok: false,
                message: 'Error to delete an hospital',
                error: err
            });

        } 
        
        if ( !hospitalDeleted ) {

            return res.status(400).json({
                ok: false,
                message: 'The hospital with id' + id + ' not exists',
                error: { message: 'Not exist an hospital with this Id' }
            });

        }

        res.status(200).json({
            ok: true,
            hospital: hospitalDeleted
        });

    });

});

module.exports = app;