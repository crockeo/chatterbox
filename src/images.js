// Name  : images.js
// Author: Cerek Hillen
//
// Description:
//   Dealing with user-provided images around the site.

/////////////
// Imports //
var fs = require('fs'),

    database = require('./database.js');

//////////
// Code //

// Attempting to save a given image to the Mongo database. Expects the callback
// to receive an error value (if it exists).
function save(img, callback) {
    database.schema.Img.find()
                       .sort({ id: -1 })
                       .exec(function (err, imgs) {
        if (err) {
            callback(err);
            return;
        }

        var id;
        if (imgs.length === 0)
            id = 1;
        else
            id = imgs[0].id + 1;

        var data = new Buffer(img.data, 'binary');
        common.hashBuffer(data, function (hash) {
            database.schema.Img.find({
                hash: hash
            }, function (err, imgs) {
                if (imgs.length > 0) {
                    return callback(null, {
                        newImg: false,
                        id    : imgs[0].id
                    });
                }

                new database.schema.Img({
                    id         : id,
                    contentType: img.contentType,
                    hash       : hash,
                    data       : new Buffer(img.data, 'binary')
                }).save(function (err) {
                    if (err)
                        return callback(err);

                    callback(null, {
                        newImage: true,
                        id      : id
                    });
                });
            });
        });
    });
}

// Attempting to get a given image from the Mongo database.
function get(id, callback) {
    database.schema.Img.find({
        id: id
    }, function (err, imgs) {
        if (err)
            callback(err, null)
        else if (imgs.length === 0)
            callback(new Error('No such image exists.'), null);
        else
            callback(null, imgs[0]);
    });
}

/////////////
// Exports //
module.exports.save = save;
module.exports.get  = get;
