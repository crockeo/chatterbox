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


    });
}

/////////////
// Exports //
module.exports.path = '/channelinfo';
module.exports.get  = get;
