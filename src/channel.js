// Name  : channel.js
// Author: Cerek Hillen
//
// Description:
//   Some common functionality for working with channels.

/////////////
// Imports //
var database = require('./database.js'),
    common   = require('./common.js');

//////////
// Code //

// Getting a given user's authorization level to a channel.
function getAuthLevel(channel, authCookie, callback) {
    var json;

    try { json = JSON.parse(authCookie); }
    catch (e) {
        return callback(new Error('Could not parse the authorization cookie.'), 2);
    }

    common.isLoggedJSON(json, function (err, logged) {
        if (err || !logged)
            return callback(err, 3);

        database.schema.InChannel.find({
            username: json.username,
            chatName: channel
        }, function (err, inChannels) {
            if (err || inChannels.length === 0)
                return callback(err, 3);
            callback(null, inChannels[0].authLevel);
        });
    });
}

/////////////
// Exports //
module.exports.getAuthLevel = getAuthLevel;
