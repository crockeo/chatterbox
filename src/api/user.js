// Name  : user.js
// Author: Cerek Hillen
//
// Description:
//   This module maintains the API endpoint do query information about a set of
//   users or a given user.

/////////////
// Imports //
var bcrypt = require('bcrypt'),

    database = require('../database.js'),
    messages = require('../messages.js'),
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
            if (err || users.length === 0) {
                res.json({
                    error: true,
                    success: false,
                    message: 'No user exists with that username.'
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

// Updating information about a given user.
function post(req, res) {
    common.allExists(req.body, ['password', 'update'], function (exists) {
        if (req.cookies.auth === undefined || !exists) {
            res.json({
                error: true,
                success: false,
                message: 'Malformed request.'
            });

            return;
        }

        var cookie;
        try       { cookie = JSON.parse(req.cookies.auth); }
        catch (e) { cookie = {};                           }

        common.isLoggedJSON(cookie, function (err, logged) {
            if (err || !logged) {
                res.json({
                    error: err,
                    success: false,
                    message: 'Failed to validate user.'
                });

                return;
            }

            database.schema.User.find({
                username: cookie.username
            }, function (err, users) {
                if (err || users.length === 0) {
                    res.json({
                        error: err,
                        success: false,
                        message: 'No such username exists.'
                    });

                    return;
                }

                var user = users[0];
                bcrypt.compare(req.body.password, user.password, function (err, same) {
                    if (err || !same) {
                        res.json({
                            error: err,
                            success: false,
                            message: 'Invalid password.'
                        });

                        return;
                    }

                    database.schema.User.find({
                        $or: [
                            { email   : req.body.update.email    },
                            { username: req.body.update.username }
                        ]
                    }, function (err, users) {
                        if (err || users.length > 0) {
                            res.json({
                                error  : err,
                                success: false,
                                message: 'Either that username or that email is already taken.'
                            });

                            return;
                        }

                        var oldUser = JSON.stringify(user);

                        user.email    = req.body.update.email    === undefined ? user.email    : req.body.update.email;
                        user.username = req.body.update.username === undefined ? user.username : req.body.update.username;

                        var newpic = false;
                        if (req.body.update.picture !== undefined) {
                            user.picture = req.body.update.picture;
                            newpic = true;
                        }

                        if (req.body.update.npassword === '' && JSON.stringify(user) == oldUser) {
                            return res.json({
                                error: null,
                                success: false,
                                message: 'Nothing to update!'
                            });

                            return;
                        }

                        // Storing the functionality to save a user because I
                        // need to optionally hash a new password before saving
                        // the user.
                        var saveUser = function () {
                            user.save(function (err) {
                                if (err) {
                                    res.json({
                                        error: err,
                                        success: false,
                                        message: 'Failed to update your profile.'
                                    });

                                    return;
                                }

                                messages.updatePictures(user, function (err) {
                                    if (err) {
                                        console.log('Failed to update message pictures.');
                                        return;
                                    }

                                    common.generateAuthCookie({
                                        username: user.username,
                                        password: user.password,
                                        remember: true
                                    }, function (err, authCookie) {
                                        if (!err)
                                            res.set('Set-Cookie', authCookie);

                                        res.json({
                                            error: null,
                                            success: true,
                                            message: 'Updated your profile.'
                                        });
                                    });
                                });
                            });
                        };

                        if (req.body.update.npassword !== '') {
                            bcrypt.hash(req.body.update.npassword, 10, function (err, hash) {
                                if (err) {
                                    return res.json({
                                        error  : err,
                                        success: false,
                                        message: 'Failed to hash the new password.'
                                    });
                                }

                                user.password = hash;
                                saveUser();
                            });
                        } else
                            saveUser();
                    });
                });
            });
        });
    })
}

/////////////
// Exports //
module.exports.path = '/user';
module.exports.get  = get;
module.exports.post = post;
