// Name  : islogged
// Author: Cerek Hillen
//
// Description:
//   An endpoint to determine whether the current user is logged in under a
//   valid authentication.

/////////////
// Imports //
var bcrypt = require('bcrypt'),

    database = require('../database.js');

//////////
// Code //

// Handling a GET request on this path.
function get(req, res) {
    var auth = req.cookies.auth;

    if (auth === undefined) {
        res.json({ logged: false });
        return;
    }

    var auths = auth.split('|');
    if (auths.length !== 2) {
        res.json({ logged: false });
        return;
    }

    database.schema.User.find({
        username: auth[0]
    }, function (err, users) {
        if (err || users.length !== 1) {
            res.json({ logged: false });
            return;
        }

        res.json({ logged: auth[1] === users[0] });
    });
}

/////////////
// Exports //
module.exports.path = '/islogged';
module.exports.get = get;
