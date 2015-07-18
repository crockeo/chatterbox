// Name  : messages.js
// Author: Cerek Hillen
//
// Description:
//   A module to retrieve information about prior messages stored in the Mongo
//   database.

/////////////
// Imports //
var channel = require('../channel.js');

//////////
// Code //

// Calculating the date range of a
function dateRange(query) {
    if (query.before === undefined && query.after === undefined)
        return null;

    var range = {};

    if (query.before !== undefined)
        range.$lt = query.before;
    if (query.after !== undefined)
        range.$gt = query.after;

    return range;
}

// Attempting to construct a MongoDB query from the user's request query.
function constructQuery(query) {
    var dbQuery = {},
        range   = dateRange(query);

    // Constructing the query.
    dbQuery.channel = query.channel;
    if (range)
        dbQuery.time = range;

    return dbQuery;
}

// Handling a GET request on the messages path.
function get(req, res) {
    if (req.query.channel === undefined || req.cookies.auth === undefined) {
        return res.json({
            error  : true,
            success: false,
            message: 'Malformed request.'
        });
    }

    channel.getAuthLevel(req.query.channel, req.cookies.auth, function (err, authLevel) {
        if (err || authLevel > 2) {
            return res.json({
                error  : false,
                success: false,
                message: 'Cannot view channel messages.'
            });
        }

        database.schema.Message.find(constructQuery(req.query), function (err, messages) {
            if (err) {
                return res.json({
                    error  : true,
                    success: false,
                    message: String(err)
                });
            }

            res.json({
                error   : false,
                success : true,
                message : '',
                messages: messages
            });
        });
    });
}

/////////////
// Exports //
module.exports.path = '/messages';
module.exports.get  = get;
