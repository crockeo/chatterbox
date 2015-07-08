// Name  : invite.js
// Author: Cerek Hillen
//
// Description:
//   An API endpoint for inviting a user into a channel.

/////////////
// Imports //
var database = require('../database.js'),
    common   = require('../common.js');

//////////
// Code //

// Checking if a user has the authorization to invite a user to a channel.
function canInvite(auth, channel, callback) {
    common.isLogged(auth, function (err, logged) {
        if (err)
            return callback(err, false);
        if (!logged)
            return callback(null, false);

        var json;

        try       { json = JSON.parse(auth);   }
        catch (e) { return callback(e, false); }

        database.schema.InChannel.find({
            username: json.username,
            chatName: channel
        }, function (err, inChannels) {
            if (err)
                return callback(err, false);
            if (inChannels.length !== 1 || inChannels[0].authLevel > 1)
                return callback(null, false);

            return callback(null, true);
        });
    });
}

// Handling a POST request to this API endpoint.
function post(req, res) {
    common.allExists(req.body, ['username', 'channel'], function (exists) {
        if (!exists) {
            return res.json({
                error  : new Error('Malformed request!'),
                success: false,
                message: 'Malformed request.'
            });
        }

        canInvite(req.cookies.auth, req.body.channel, function (err, authed) {
            if (err) {
                return res.json({
                    error  : err,
                    success: false,
                    message: 'Error in establishing authorization status.'
                });
            }

            if (!authed) {
                return res.json({
                    error  : null,
                    success: false,
                    message: 'You are not authorized to invite new users to this group.'
                });
            }

            database.schema.User.find({
                username: req.body.username
            }, function (err, users) {
                if (err) {
                    return res.json({
                        error  : err,
                        success: false,
                        message: 'There was an error in checking the existence of that user.'
                    });
                }

                if (users.length === 0) {
                    return res.json({
                        error  : null,
                        success: false,
                        message: 'That user does not exist.'
                    });
                }

                database.schema.InChannel.find({
                    username: req.body.username,
                    chatName: req.body.channel
                }, function (err, invites) {
                    if (err) {
                        return res.json({
                            error  : err,
                            success: false,
                            message: 'Failed to search for existent users.'
                        });
                    }

                    if (invites.length > 0) {
                        return res.json({
                            error  : null,
                            success: false,
                            message: 'That user is already in this channel.'
                        });
                    }

                    new database.schema.InChannel({
                        username : req.body.username,
                        chatName : req.body.channel,
                        authLevel: 2
                    }).save(function (err) {
                        if (err) {
                            return res.json({
                                error  : err,
                                success: false,
                                message: 'Error in saving the user invite to the database.'
                            });
                        }

                        res.json({
                            error  : null,
                            success: true,
                            message: 'Successfully invited the user!'
                        });
                    });
                });
            });
        });
    });
}

/////////////
// Exports //
module.exports.path = '/invite';
module.exports.post = post;
