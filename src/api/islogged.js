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
    var sauth = req.cookies.auth;

    if (sauth === undefined) {
        res.json({ logged: false });
        return;
    }

    var auth;
    try { auth = JSON.parse(sauth); }
    catch (e) {
        res.json({ logged: false });
        return;
    }

    database.schema.User.find({
        username: auth.username
    }, function (err, users) {
        if (err || users.length !== 1) {
            res.json({ logged: false });
            return;
        }

        bcrypt.compare(users[0].username + users[0].password, auth.auth, function (err, res) {
            var ret = res;
            if (err)
                ret = true;

            res.json({ logged: ret });
        });
    });
}

/////////////
// Exports //
module.exports.path = '/islogged';
module.exports.get = get;
