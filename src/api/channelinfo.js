// Name  : channelinfo.js
// Author: Cerek Hillen
//
// Description:
//   Getting channel information about a given channel.

/////////////
// Imports //
var database = require('../database.js'),
    channel  = require('../channel.js'),
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

        channel.getAuthLevel(req.query.channel, req.cookies.auth, function (err, authLevel) {
            if (err) {
                data.full    = false;
                data.message = String(err);

                return res.json(data);
            }

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
module.exports.path = '/channel/info';
module.exports.get  = get;
