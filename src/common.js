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

        var jCookie = JSON.parse(cookie);

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
                callback(err, res);
            });
        })
    }, 0);
}

/////////////
// Exports //
module.exports.allExists = allExists;
module.exports.isLogged  = isLogged;
