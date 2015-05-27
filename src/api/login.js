// Name  : login.js
// Author: Cerek Hillen
//
// Description:
//   The API endpoint for logging a user in.

//////////////
// Includes //
var bcrypt = require('bcrypt'),

    database = require('../database.js');

//////////
// Code //

// Attempting to POST to this endpoint.
function post(req, res) {
    // TODO: Implement logging in.
    res.json({
        error: false,
        success: false,
        message: 'Unimplemented'
    });
}

/////////////
// Exports //
module.exports.path = '/login';
module.exports.post = post;
