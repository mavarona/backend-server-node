var express = require('express');
var fs = require('fs');

var app = express();

// Routes

app.get('/:type/:img', (req, res, next) => {

    var type = req.params.type;
    var img = req.params.img;

    var path = `./uploads/${ type }/${ img }`;

    fs.exists( path, exist => {

        if (!exist) {
            path = './assets/no-img.jpg';
        }

        res.sendFile( path );

    });
    
});

module.exports = app;