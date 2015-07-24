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

    // Getting the users if necessary.
    if (req.query.users === undefined || req.query.users === 'true') {
        console.log(':)');
        fns.push(function (data, callback) {
            getUsers(req, function (err, users) {
                if (err)
                    callback(err, data);

                data.users = users;

                callback(null, data);
            });
        });
    }

    // Getting the messages if necessary.
    if (req.query.messages === undefined || req.query.messages === 'true') {
        fns.push(function (data, callback) {
            getMessages(req, function (err, messages) {
                if (err)
                    callback(err, data);

                data.messages = messages;

                callback(null, data);
            });
        });
    }

    // Adding the function to publish channel info.
    fns.push(function (data, callback) {
        res.json({
            error  : false,
            success: JSON.stringify(data) !== '{}',
            message: JSON.stringify(data) === '{}' ? 'You didn\'t request any data.' : 'Successfully retrieved channel data.',
            data   : data
        });
    });

    // Iterating through the functions in the
    var caller = function (err, data) {
        if (err) {
            return res.json({
                error  : err,
                success: false,
                message: 'Failed to construct channel data response: ' + String(err)
            });
        }

        fns[n++](data, caller);
    };

    caller(null, {});
}

/////////////
// Exports //
module.exports.path = '/channel/data';
module.exports.get = get;
