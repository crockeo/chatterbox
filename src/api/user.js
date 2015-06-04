// Name  : user.js
// Author: Cerek Hillen
//
// Description:
//   This module maintains the API endpoint do query information about a set of
//   users or a given user.

/////////////
// Imports //
var database = require('../database.js'),
    common   = require('../common.js');

//////////
// Code //

// The function to handle get requests on this path.
function get(req, res) {
    common.allExists(req.query, ['username'], function (exists) {
        if (!exists) {
            res.json({
                error: true,
                success: false,
                message: 'Malformed request.'
            });

            return;
        }

        database.schema.User.find({
            username: req.query.username
        }, function (err, users) {
            if (err) {
                res.json({
                    error: true,
                    success: false,
                    message: 'Error retrieving the user: ' + String(err)
                });

                return;
            }

            if (users.length === 0) {
                res.json({
                    error: false,
                    success: false,
                    message: 'No such user exists with that username.'
                });

                return;
            }

            // Determining if the user is requesting their own user profile. if
            // they are, it returns more personal information.
            var user = users[0];
            common.isLogged(req.cookies.auth, function (err, logged, lUser) {
                var send = logged && lUser.username == user.username;

                res.json({
                    user: {
                        email   : send ? user.email : undefined,
                        username: user.username,
                        created : user.created,
                        verified: send ? user.verified : undefined,
                        picture : user.picture
                    }
                });
            });
        });
    });
}

/////////////
// Exports //
module.exports.path = '/user';
module.exports.get = get;
