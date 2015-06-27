// Name  : image.js
// Author: Cerek Hillen
//
// Description:
//   The API endpoints for uploading and downloading images to and from the
//   server's database.

/////////////
// Imports //
var common = require('../common.js'),
    images = require('../images.js');

//////////
// Code //

// Attempting to find a photo with a given ID on the server.
function get(req, res) {
    common.allExists(req.query, ['id'], function (exists) {
        if (!exists) {
            res.status(404).send('Malformed request.');
            return;
        }

        images.get(req.query.id, function (err, img) {
            if (err) {
                res.status(404).send(String(err));
                return;
            }

            res.set('Content-Type', img.contentType);
            res.send(img.data);
        });
    });
}

// Attempting to upload a new image to the server.
function post(req, res) {
    images.save({
        contentType: req.body.contentType,
        data       : req.body.data
    }, function (err, id) {
        if (err) {
            console.log(String(err));
            res.json({
                error  : err,
                success: false,
                message: 'There was an error in saving that image.'
            });
        } else {
            res.json({
                error  : null,
                success: true,
                message: 'Saved the image!',
                id     : id
            });
        }
    });
}

/////////////
// Exports //
module.exports.path = '/image';
module.exports.get  = get;
module.exports.post = post;
