// Name  : channelpref.js
// Author: Cerek Hillen
//
// Description:
//   The API endpoint for updating and accessing a user's channel preferences.
//   One can only update or access their own information (authorized using the
//   normal auth cookie).

/////////////
// Imports //
var database = require('../database.js'),
    common   = require('../common.js');

//////////
// Code //

// Updating the channel preferences of a given user - publicly available to the
// rest of the program such that you needn't query the API to use it from the
// server itself.
function updateChannelPref(username, channels, channel, callback) {
    if (typeof callback === 'undefined')
        return;

    database.schema.ChannelPref.find({
        username: username
    }, function (err, channelPrefs) {
        if (err)
            return callback(err);

        // Saving a new channel preference if none exists for the user.
        if (channelPrefs.length === 0) {
            new database.schema.ChannelPref({
                username: username,
                channels: channels,
                channel : channel
            }).save(function (err) {
                callback(err);
            });

            return;
        }

        if (channelPrefs.length !== 1)
            return callback(new Error('Expected 1 channel preference but got: ' + channelPrefs.length));

        var channelPref = channelPrefs[0];
        channelPref.channels = channels;
        channelPref.channel  = channel;

        channelPref.save(function (err) {
            if (err)
                return callback(err);
            callback(null);
        });
    });
}

// Trying to access the list of channels a user is subscribed to.
function get(req, res) {
    var eVal = { channels: ['main'] };

    common.isLogged(req.cookies.auth, function (err, logged) {
        if (err) {
            return res.json({
                error   : err,
                success : false,
                messag  : 'Failed to retrieve logged-in status.',
                channels: ['main']
            });
        }

        if (!logged) {
            return res.json({
                error   : false,
                success : false,
                message : 'You\'re not logged in!',
                channels: ['main']
            });
        }

        database.schema.ChannelPref.find({
            username: JSON.parse(req.cookies.auth).username
        }, function (err, channelPrefs) {
            if (err) {
                return res.json({
                    error   : err,
                    success : false,
                    message : 'Failed to find channel preferences.',
                    channels: ['main']
                });
            }

            if (channelPrefs.length !== 1) {
                return res.json({
                    error   : false,
                    success : false,
                    message : 'Expected 1 channel preference but got: ' + channelPrefs.length,
                    channels: ['main']
                });
            }

            res.json({
                error   : false,
                success : true,
                message : 'Successfully got the list of channels.',
                channels: channelPrefs[0].channels,
                channel : channelPrefs[0].channel
            });
        });
    });
}

// Attempting to update the list of channels a user is subscribed to.
function post(req, res) {
    common.allExists(req.body, ['channels', 'channel'], function (exists) {
        if (req.cookies.auth === undefined || !exists) {
            return res.json({
                error  : new Error('Malformed request.'),
                success: false,
                message: 'Malformed request.'
            });
        }

        // TODO: Complete this function?

        res.json({
            error  : true,
            success: false,
            message: 'Endpoint not developed.'
        });
    });
}

/////////////
// Exports //
module.exports.updateChannelPref = updateChannelPref;
module.exports.path              = '/channel/pref';
module.exports.get               = get;
module.exports.post              = post;
