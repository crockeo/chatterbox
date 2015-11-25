// Name  : messages.js
// Author: Cerek Hillen
//
// Description:
//   Utilities to do with message management.

/////////////
// Imports //
var database = require('./database.js');

//////////
// Code //

// Updating all pictures in the database from a given user with their current
// profile picture.
//
// To be used when a user updates their profile picture.
function updatePictures(user, callback) {
    if (user === undefined || callback === undefined)
        return;

    database.schema.Message.find({
        username: user.username
    }, function (err, messages) {
        if (err) {
            callback(err);
            return;
        }

        var fn = function (i) {
            if (i >= messages.length) {
                callback(null);
                return;
            }

            messages[i].picture = user.picture;
            messages[i].save(function (err) {
                if (err) {
                    callback(err);
                    return;
                }

                fn(i + 1);
            });
        };

        fn(0);
    });
}

/////////////
// Exports //
module.exports.updatePictures = updatePictures;
