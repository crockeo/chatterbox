// Name  : user.js
// Author: Cerek Hillen
//
// Description:
//   This module maintains the API endpoint do query information about a set of
//   users or a given user.

/////////////
// Imports //
var database = require('../database.js'),
    common   = require('../common.js');

//////////
// Code //

// The function to handle get requests on this path.
function get(req, res) {
    res.json({
        something: 'Ayy lmao'
    });
}

/////////////
// Exports //
module.exports.path = '/user';
module.exports.get = get;
