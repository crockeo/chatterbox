// Name  : socketmanager.js
// Author: Cerek Hillen
//
// Description:
//   This module manages how sockets are handled.

/////////////
// Imports //
var common = require('./common.js');

//////////
// Code //

// The object of sockets that are currently connected.
var sockets = [];

// The set of validated authorizations.
var validated = {};

// The function to remove a socket from the set of sockets.
function removeSocket(socket) {
    console.log('Removing a socket...');

    for (var i = 0; i < sockets.length; i++) {
        if (sockets[i] == socket) {
            sockets.splice(i, 1);
            return;
        }
    }
}

// Performing some function on each socket.
function eachSocket(fn) {
    for (var i = 0; i < sockets.length; i++)
        fn(sockets[i]);
}

// Constructing a new message from the server.
function serverMessage(msg) {
    return {
        username: 'System',
        text: msg,
        time: new Date()
    };
}

// Initializing a socket.
function initSocket(socket) {
    console.log('Adding a socket...');

    socket.on('register', function (cookie) {
        common.isLogged(cookie, function (err, logged) {
            socket.emit('message', serverMessage('Connected to the server.'));

            if (!err && logged) {
                var jCookie;

                try       { jCookie = JSON.parse(cookie); }
                catch (e) { return;                       }

                validated[jCookie.auth] = true;
                socket.emit('message', serverMessage('Logged in to the server.'));
            }

            socket.on('message', function (msg) {
                if (!msg.username || !msg.auth || !validated[jCookie.auth]) {
                    socket.emit('message', {
                        username: 'System',
                        text: 'You must be logged in to send chat messages.',
                        time: new Date()
                    });

                    return;
                }

                console.log('Received message: ' + msg);

                // Propagating the contents of the message back out to the
                // rest of the sockets - while removing any sensitive
                // information.
                eachSocket(function (socket) {
                    socket.emit('message', {
                        username: msg.username,
                        text: msg.text,
                        time: msg.time
                    });
                });
            });

            // Attempting to remove this socket upon a disconnect.
            socket.on('disconnect', function () { removeSocket(socket); });

            sockets.push(socket);
        });
    });
}

/////////////
// Exports //
module.exports.initSocket = initSocket;
