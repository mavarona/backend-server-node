var express = require('express');

var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

var User = require('../models/user');
var Doctor = require('../models/doctor');
var Hospital = require('../models/hospital');

app.use(fileUpload());

// Routes
app.put('/:type/:id', (req, res, next) => {

    var type = req.params.type;
    var id = req.params.id;

    // Types collection of images
    var typeCollectionImages = ['hospitals', 'doctors', 'users'];
    if(typeCollectionImages.indexOf( type ) < 0 ) {
        return res.status(400).json({
            ok: false,
            message: 'Collection images not valid',
            errors: { message:'The valid collection images are: ' + typeCollectionImages.join(', ') }
        });
    }


    if(!req.files) {
        return res.status(400).json({
            ok: false,
            message: 'There is not selected a file',
            errors: { message:'Must be select a file' }
        });
    }

    var file = req.files.image;
    var arrName = file.name.split('.');
    var extensionFile = arrName[arrName.length-1];

    // Valid extensions
    var extensionsValids = ['png', 'jpg', 'gif', 'jpeg'];

    if(extensionsValids.indexOf( extensionFile ) < 0 ) {
        return res.status(400).json({
            ok: false,
            message: 'Extension not valid',
            errors: { message:'The valid extensions are: ' + extensionsValids.join(', ') }
        });
    }

    // Generate random file
    var nameFileToUpload =  `${id}-${ new Date().getMilliseconds() }.${ extensionFile }`;
    // Move temporal file to a folder in the server
    var path = `./uploads/${ type }/${ nameFileToUpload }`;

    file.mv( path, err => {

        if ( err ) {
            return res.status(400).json({
                ok: false,
                message: 'Error to move the file',
                errors: err 
            });        
        }

        uploadByType ( type, id, nameFileToUpload, res );

    });
    
});

function uploadByType ( type, id, fileName, res ) {

    if ( type === 'users' ) {

        User.findById(id, (err, user) => {

            if (!user) {
                return res.status(400).json({
                    ok: true,
                    message: 'User not exists',
                    errors: { message: 'User not exists' }
                });
            }


            var pathOld = './uploads/users/' + user.img;

            if (fs.existsSync(pathOld)) {
                fs.unlink(pathOld);
            }

            user.img = fileName;

            user.save((err, userUpdated) => {

                userUpdated.password = ':)';

                return res.status(200).json({
                    ok: true,
                    message: 'Image of user updated',
                    user: userUpdated
                });

            })


        });

    }

    if (type === 'doctors') {

        Doctor.findById(id, (err, doctor) => {
    
            if (!doctor) {
                return res.status(400).json({
                    ok: true,
                    message: 'Doctor not exists',
                    errors: { message: 'Doctor not exists' }
                });
            }
    
            var pathViejo = './uploads/doctors/' + doctor.img;
    
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }
    
            doctor.img = fileName;
    
            doctor.save((err, doctorUpdated) => {
    
                return res.status(200).json({
                    ok: true,
                    message: 'Image of doctor updated',
                    doctor: doctorUpdated
                });
    
            })
    
        });
    }

    if (type === 'hospitals') {

        Hospital.findById(id, (err, hospital) => {
    
            if (!hospital) {
                return res.status(400).json({
                    ok: true,
                    message: 'Hospital not exists',
                    errors: { message: 'Hospital not exists' }
                });
            }
    
            var pathViejo = './uploads/hospitals/' + hospital.img;
    
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }
    
            hospital.img = fileName;
    
            hospital.save((err, hospitalUpdated) => {
    
                return res.status(200).json({
                    ok: true,
                    message: 'Image of hospital updated',
                    hospital: hospitalUpdated
                });
    
            })
    
        });
    }

}

module.exports = app;