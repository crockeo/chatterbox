// Name  : channelrank.js
// Author: Cerek Hillen
//
// Description:
//   An API endpoint for one to change a user's rank within a channel.

/////////////
// Imports //
var database = require('../database.js'),
    common   = require('../common.js');

//////////
// Code //

// Handling a POST request on this path.
function post(req, res) {
    common.allExists(req.body, ['channel', 'username', 'rank'], function (exists) {
        if (!exists) {
            return res.json({
                error:   true,
                success: false,
                message: 'Malformed request.'
            });
        }

        common.isLoggedJson(req.cookies.auth, function (err, logged, username) {
            if (err) {
                return res.json({
                    error:   true,
                    success: false,
                    message: 'Error in ascertaining logged status: ' + String(err)
                });
            } else if (!logged) {
                return res.json({
                    error:   false,
                    success: false,
                    message: 'You are not logged in.'
                });
            }

            database.schema.InChannel.find({
                channel:  req.body.channel,
                username: req.body.username
            }, function (err, inChannels) {
                
            });
        });

        database.schema.Channel.find({
            name: req.body.channel
        }, function (err, channels) {
            if (err || channels.length !== 1) {
                return res.json({
                    error:   !!err,
                    success: false,
                    message: 'That channel does not exist.'
                });
            }

            database.schema.InChannel.find({
                channel: req.body.channel,
                username: req.body.username
            }, function (err, inChannels) {
                var inChannel;
                if (err || channels.length !== 1) {
                    inChannel = databas.schema.InChannel.new({
                        
                    });
                } else {
                    inChannel = inChannels[0];
                }

                inChannel.save(function (err) {

                });
            });
        });
    });
}

/////////////
// Exports //
module.exports.path = '/channel/rank';
module.exports.post = post;
