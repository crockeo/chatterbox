// Name  : register.js
// Author: Cerek Hillen
//
// Description:
//

/////////////
// Imports //
var bcrypt = require('bcrypt')

    common   = require('../static/js/common.js'),
    database = require('../database.js');

//////////
// Code //

// Attempting to POST on the path specified by this module.
function post(req, res) {
    common.allExists(req.body, ['email', 'username', 'password'], function (exists) {
        if (!exists) {
            res.json({
                error: true,
                success: false,
                message: 'Malformed request.'
            });

            return;
        }

        database.schema.User.find({
            $or: [
                { email   : req.body.email    },
                { username: req.body.username }
            ]
        }, function (err, users) {
            if (err) {
                res.json({
                    error: true,
                    success: false,
                    message: '(Please send the following to the developer) There was an error in accessing the existing set of users: ' + String(err)
                });

                return;
            }

            if (users.length >= 1) {
                var user = users[0];

                if (req.body.email === user.email && req.body.username === user.username) {
                    res.json({
                        error: false,
                        success: false,
                        message: 'Both the email and username have been taken.'
                    });

                    return;
                }

                if (req.body.email === user.email) {
                    res.json({
                        error: false,
                        success: false,
                        message: 'That email is taken.'
                    });
                }

                if (req.body.username === user.username) {
                    res.json({
                        error: false,
                        success: false,
                        message: 'That username is taken.'
                    });
                }

                return;
            }

            bcrypt.hash(req.body.username, 10, function (err, hash) {
                if (err) {
                    res.json({
                        error: true,
                        success: false,
                        message: 'Failed to hash the password.'
                    });

                    return;
                }

                new database.schema.User({
                    email   : req.body.email,
                    username: req.body.username,
                    password: hash,
                    created : new Date(),
                    verified: null
                }).save(function (err) {
                    if (err) {
                        res.json({
                            error: true,
                            success: false,
                            message: 'There was an error in registering your account: ' + String(err)
                        });

                        return;
                    }

                    res.json({
                        error: false,
                        success: true,
                        message: 'Registered your account!'
                    });
                });
            });
        });
    });
}

/////////////
// Exports //
module.exports.path = '/register';
module.exports.post = post;
