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
    if (req.query.channel === undefined)
        callback(new Error('A channel name is required to query for users.'), []);

    console.log(typeof req.query.channel);
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
    if (req.query.channel === undefined)
        callback(new Error('A channel name is required to query for messages.'), []);

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
    getUsers(req, function (err, users) {
        if (err) {
            return res.json({
                error  : err,
                success: false,
                message: 'Failed to get users.'
            });
        }

        getMessages(req, function (err, messages) {
            if (err) {
                return res.json({
                    error  : err,
                    success: false,
                    message: 'Failed to get messages.'
                });
            }

            res.json({
                error  : false,
                success: true,
                message: 'Successfully got users & channel info.',
                data   : {
                    users   : users,
                    messages: messages
                }
            });
        });
    });
}

/////////////
// Exports //
module.exports.path = '/channel/data';
module.exports.get = get;
