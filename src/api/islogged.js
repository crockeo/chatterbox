// Name  : islogged
// Author: Cerek Hillen
//
// Description:
//   An endpoint to determine whether the current user is logged in under a
//   valid authentication.

/////////////
// Imports //
var bcrypt = require('bcrypt'),

    database = require('../database.js'),
    common   = require('../common.js');

//////////
// Code //

// Handling a GET request on this path.
function get(req, res) {
    common.isLogged(req.cookies.auth, function (err, logged) {
        if (err || !logged)
            res.json({ logged: false });
        else
            res.json({ logged: true });
    });
}

/////////////
// Exports //
module.exports.path = '/islogged';
module.exports.get = get;
