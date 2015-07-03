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
function updateChannelPref(username, channels, callback) {
    if (typeof callback === 'undefined')
        callback = function () { };

    database.schema.ChannelPref.find({
        username: username
    }, function (err, channelPrefs) {
        if (err)
            return callback(err);
        if (channelPrefs.length !== 1)
            return callback(new Error('Expected 1 channel preference but got: ' + channelPrefs.length));

        var channelPref = channelPrefs[0];
        channelPref.channels = channels;

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
                channels: channelPrefs[0].channels
            });
        });
    });
}

// Attempting to update the list of channels a user is subscribed to.
function post(req, res) {
    common.allExists(req.body, ['channels'], function (exists) {
        if (req.cookies.auth === undefined || !exists) {
            return res.json({
                error  : new Error('Malformed request.'),
                success: false,
                message: 'Malformed request.'
            });
        }

        console.log('Got a request.');
        res.json({
            error  : false,
            success: false,
            message: ''
        });
    });
}

/////////////
// Exports //
module.exports.updateChannelPref = updateChannelPref;
module.exports.path              = '/channelpref';
module.exports.get               = get;
module.exports.post              = post;
