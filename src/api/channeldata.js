// Name  : channeldata.js
// Author: Cerek Hillen
//
// Description:
//   Querying a channel for its current-user and message information. Options
//   allow one to define if it should return user information, message
//   information, and a number of different queries against messages.

/////////////
// Imports //
var sockethelper = require('../sockets/helper.js'),
    database     = require('../database.js');

//////////
// Code //

// Getting the current set of users for a given channel (and calling the
// callback) with theie value.
function getUsers(req, callback) {
    sockethelper.getChannelUsers(req.query.channel, function (users) {
        callback(null, users);
    });
}

// Constructing the database query for the set of messages from a given channel.
function constructMessageQuery(req, callback) {
    var query = {};

    query.channel = req.query.channel;

    // TODO: Do some other stuff too.

    callback(null, query);
}

// Getting the set of messages from a given server request.
function getMessages(req, callback) {
    constructMessageQuery(req, function (err, query) {
        if (err)
            return callback(err, []);

        database.schema.Message.find(query, function (err, messages) {
            if (err)
                return callback(err, []);

            callback(null, messages);
        });
    });
}

// Handling a GET request on this API endpoint.
function get(req, res) {
    if (req.query.channel === undefined) {
        return res.json({
            error  : true,
            success: false,
            message: 'You must provide a channel name to this API endpoint.'
        });
    }

    var fns = [],
        n   = 0;

    if (req.query.users    === undefined || req.query.users    === 'true')
        fns.push({ fn: getUsers, name: 'users' });
    if (req.query.messages === undefined || req.query.messages === 'true')
        fns.push({ fn: getMessages, name: 'messages' });

    var caller = function (data) {
        if (n == fns.length) {
            return res.json({
                error  : false,
                success: JSON.stringify(data) !== '{}',
                message: JSON.stringify(data) === '{}' ? 'You didn\'t request any data.' : 'Successfully retrieved channel data.',
                data   : data
            });
        }

        fns[n].fn(req, function (err, rData) {
            data[fns[n].name] = rData;
            n++;

            caller(data);
        });
    };

    caller({});
}

/////////////
// Exports //
module.exports.path = '/channel/data';
module.exports.get = get;
