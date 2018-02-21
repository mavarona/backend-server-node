var express = require('express');
var fs = require('fs');

var app = express();
var path = require('path');

// Routes

app.get('/:type/:img', (req, res, next) => {

    var type = req.params.type;
    var img = req.params.img;

    var pathImage = path.join(global.IMG + type + '/' + img);

    fs.exists( pathImage, exist => {

        if (!exist) {
            
            pathImage = path.join(global.ASSETS + 'no-img.jpg');
        }

        res.sendFile( pathImage );

    });

});

module.exports = app;
