// Name  : authtype.js
// Author: Cerek Hillen
//
// Description:
//

/////////////
// Exports //
var database = require('../database.js'),
    channel  = require('../channel.js'),
    common   = require('../common.js');

//////////
// Code //

// Handing a POST request to change the authorization type of a given channel.
function post(req, res) {
    common.allExists(req.body, ['channel', 'newAuth'], function (exists) {
        if (!exists) {
            return res.json({
                error  : new Error('Malformed request.'),
                success: false,
                message: 'Malformed request.'
            });
        }

        channel.getAuthLevel(req.body.channel, req.cookies.auth, function (err, authLevel) {
            if (err) {
                return res.json({
                    error  : err,
                    success: false,
                    message: 'Failed to determine authorization level.'
                });
            }

            if (authLevel > 0) {
                return res.json({
                    error  : null,
                    success: false,
                    message: 'You are not authorized to change the authorization type.'
                });
            }

            database.schema.Channel.find({
                name: req.body.channel
            }, function (err, channels) {
                if (err) {
                    return res.json({
                        error  : err,
                        success: false,
                        message: 'Failed to find the list of channels.'
                    });
                }

                if (channels.length === 0) {
                    return res.json({
                        error  : null,
                        success: false,
                        message: 'No such channel exists.'
                    });
                }

                var channel = channels[0];

                channel.password = req.body.newPassword === undefined ? channel.password : req.body.newPassword;
                channel.authType = req.body.newAuth;

                channel.save(function (err) {
                    if (err) {
                        return res.json({
                            error  : err,
                            success: false,
                            message: 'Failed to save the channel update.'
                        });
                    }

                    res.json({
                        error  : null,
                        success: true,
                        message: 'Updated the channel authorization.'
                    });
                });
            });
        });
    });
}

/////////////
// Exports //
module.exports.path = '/channel/authtype';
module.exports.post = post;
