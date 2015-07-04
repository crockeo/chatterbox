// Name  : channelinfo.js
// Author: Cerek Hillen
//
// Description:
//   Getting channel information about a given channel.

/////////////
// Imports //
var database = require('../database.js')
    common   = require('../common.js');

//////////
// Code //

// Responding with a no-such-channel.
function noSuchChannel(res, err) {
    res.json({
        error  : err === undefined ? null : err,
        exists : false,
        message: 'No such channel exists.'
    });
}

// Finding the user's authorization level for a given channel name.
function authLevel(channel, auth, callback) {
    common.isLoggedJSON(auth, function (err, logged) {
        if (err || !logged)
            return callback(2);

        database.schema.InChannel.find({
            username: auth.username,
            chatName: channel
        }, function (err, inChannels) {
            if (err || inChannels.length === 0)
                return callback(2);
            callback(inChannels[0].authLevel);
        });
    });
}

// Responding to a GET request on this path.
function get(req, res) {
    if (req.query.channel === undefined || req.query.channel === '')
        return noSuchChannel(res);

    var data = {};
    database.schema.Channel.find({
        name: req.query.channel
    }, function (err, channels) {
        if (err || channels.length === 0)
            return noSuchChannel(res, err);

        data.name     = channels[0].name;
        data.authType = channels[0].authType;
        data.exists   = true;

        var auth;
        try       { auth = JSON.parse(req.cookies.auth); }
        catch (e) {
            data.full    = false;
            data.message = 'Couldn\'t parse auth cookie: ' + String(e);
            return res.json(data);
        }

        authLevel(req.query.channel, auth, function (authLevel) {
            switch (authLevel) {
            case 0:
            case 1:
                database.schema.InChannel.find({
                    chatName: req.query.channel
                }, function (err, inChannels) {
                    data.users = [];
                    for (var i = 0; i < inChannels.length; i++) {
                        data.users.push({
                            username : inChannels[i].username,
                            authLevel: inChannels[i].authLevel
                        });
                    }

                    data.full    = true;
                    data.message = 'Successfully retrieved chat information.';

                    res.json(data);
                });

                break;
            case 2:
            default:
                data.full    = false;
                data.message = 'You do not have the authentication level to get full chat information.';

                res.json(data);
                break;
            }
        });
    });
}

/////////////
// Exports //
module.exports.path = '/channelinfo';
module.exports.get  = get;
