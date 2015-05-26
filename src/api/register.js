// Name  : register.js
// Author: Cerek Hillen
//
// Description:
//

/////////////
// Imports //
var bcrypt = require('bcrypt')

    database = require('../database.js');

//////////
// Code //

// Attempting to POST on the path specified by this module.
function post(req, res) {
    // TODO: Implement some shit with registering a new user.
    res.json({
        error: false,
        success: false,
        message: 'Unimplemented'
    });
}

/////////////
// Exports //
module.exports.path = '/register';
module.exports.post = post;
