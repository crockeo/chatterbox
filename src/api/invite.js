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
    console.log(req.body);
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

            res.json({
                error  : null,
                success: false,
                message: 'Not yet implemented.'
            });
        });
    });
}

/////////////
// Exports //
module.exports.path = '/invite';
module.exports.post = post;
