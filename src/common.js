// Name  : common.js
// Author: Cerek Hillen
//
// Description:
//   A set of common functionality used between the rest of the server.

/////////////
// Imports //
var bcrypt = require('bcrypt'),

    database = require('./database.js');

//////////
// Code //

// Checking that all of the keys in a given array exist in a piece of JSON.
function allExists(json, keys, callback) {
    setTimeout(function () {
        for (var i = 0; i < keys.length; i++) {
            if (json[keys[i]] === undefined) {
                callback(false);
                return;
            }
        }

        callback(true);
    }, 0);
}

// Checking if a user is logged in given a (text) cookie.
function isLogged(cookie, callback) {
    setTimeout(function () {
        if (typeof cookie !== 'string') {
            callback(null, false);
            return;
        }

        var jCookie;

        try { jCookie = JSON.parse(cookie);   }
        catch (e) {
            callback(e, false);
            return;
        }

        if (jCookie.username === undefined || jCookie.auth === undefined) {
            callback(null, false);
            return;
        }

        database.schema.User.find({
            username: jCookie.username
        }, function (err, users) {
            if (err || users.length === 0) {
                callback(err, false);
                return;
            }

            var user = users[0];
            bcrypt.compare(user.username + user.password, jCookie.auth, function (err, res) {
                callback(err, res, user);
            });
        })
    }, 0);
}

// Generating an authorization cookie from a username and password pair.
function generateAuthCookie(body, callback) {
    // Ensuring that we have all mandatory parts of the body. I choose to use a
    // single value as opposed to a bunch of arguments so that I can directly
    // call it on req.body in some cases.
    if (typeof body.username !== 'string' || typeof body.password !== 'string') {
        callback(err, '');
        return;
    }

    bcrypt.hash(body.username + body.password, 10, function (err, hash) {
        if (err) {
            callback(err, '');
            return;
        }

        // Setting an extra value in the cookie if the user wishes
        // to stay logged in for an extended period of time.
        var expireStr = '';
        if (body.remember) {
            var now = new Date();
            now.setTime(now.getTime() + 31 * 24 * 60 * 60 * 1000);
            expireStr = ';expires=' + now.toUTCString();
        }

        callback(null, 'auth=' + JSON.stringify({
            username: body.username,
            auth: hash
        }) + ';path=/' + expireStr);
    });
}

/////////////
// Exports //
module.exports.allExists          = allExists;
module.exports.isLogged           = isLogged;
module.exports.generateAuthCookie = generateAuthCookie;
