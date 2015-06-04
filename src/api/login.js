// Name  : login.js
// Author: Cerek Hillen
//
// Description:
//   The API endpoint for logging a user in.

//////////////
// Includes //
var bcrypt = require('bcrypt'),

    database = require('../database.js'),
    common   = require('../common.js');

//////////
// Code //

// Attempting to POST to this endpoint.
function post(req, res) {
    common.allExists(req.body, ['email', 'password', 'remember'], function (exists) {
        if (!exists) {
            res.json({
                error  : true,
                success: false,
                message: 'Malformed request.'
            });

            return;
        }

        database.schema.User.find({
            email: req.body.email
        }, function (err, users) {
            if (err) {
                res.json({
                    error  : true,
                    success: false,
                    message: 'Failed to retrieve users.'
                });

                return;
            }

            if (users.length === 0) {
                res.json({
                    error  : false,
                    success: false,
                    message: 'No account exists with that email.'
                });

                return;
            }

            var user = users[0];
            bcrypt.compare(req.body.password, user.password, function (err, same) {
                if (err) {
                    res.json({
                        error  : true,
                        success: false,
                        message: 'There was an error in hashing the password: ' + String(err)
                    });

                    return;
                }

                if (!same) {
                    res.json({
                        error  : false,
                        success: false,
                        message: 'Invalid password.'
                    });

                    return;
                }

                // Generating and setting an auth cookie.
                common.generateAuthCookie({
                    username: user.username,
                    password: user.password,
                    remember: req.body.remember
                }, function (err, authCookie) {
                    if (err) {
                        res.json({
                            error  : true,
                            success: false,
                            message: 'Failed to generate auth key: ' + String(err)
                        });

                        return;
                    }

                    res.set('Set-Cookie', authCookie);
                    res.json({
                        error: false,
                        success: true,
                        message: 'Logged in.'
                    })
                });
            });
        });
    });
}

/////////////
// Exports //
module.exports.path = '/login';
module.exports.post = post;
