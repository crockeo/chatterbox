// Name  : manager.js
// Author: Cerek Hillen
//
// Description:
//   This module manages how sockets are handled.

/////////////
// Imports //
var foldermodules = require('../foldermodules.js'),
    common        = require('../common.js'),
    helper        = require('./helper.js');

//////////
// Code //

// The function to remove a socket from the set of sockets.
function removeSocket(socket) {
    console.log('Removing a socket...');

    if (validated[socket.id] !== undefined) {
        eachSocket(function (outSocket) {
            outSocket.emit('userdisconnect', validated[socket.id].username);
        });

        delete validated[socket.id];
    }

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
        picture : 'system.png',
        text    : msg,
        time    : new Date()
    };
}

// Initializing a socket.
function initSocket(socket) {
    console.log('Adding a socket...');

    socket.on('register', function (cookie) {
        common.isLogged(cookie, function (err, logged, userinfo) {
            sockets.push(socket);
            socket.emit('message', serverMessage('Connected to the server.'));

            if (!err && logged) {
                var jCookie;

                try       { jCookie = JSON.parse(cookie); }
                catch (e) { return;                       }

                validated[socket.id] = {
                    username: jCookie.username,
                    picture : userinfo ? userinfo.picture : undefined,
                    auth    : jCookie.auth
                };

                // Alerting user connection.
                eachSocket(function (outSocket) {
                    outSocket.emit('userconnect', {
                        username: validated[socket.id].username,
                        picture: validated[socket.id].picture
                    });
                });

                socket.emit('message', serverMessage('Logged in to the server.'));
            }

            socket.on('message', function (msg) {
                if (!msg.auth || validated[socket.id] === undefined) {
                    socket.emit('message', serverMessage('You must be logged in to send chat messages.'));

                    return;
                }

                console.log('Received message: ' + msg);

                // Propagating the contents of the message back out to the
                // rest of the sockets - while removing any sensitive
                // information.
                eachSocket(function (outSocket) {
                    outSocket.emit('message', {
                        username: validated[socket.id].username,
                        picture : validated[socket.id].picture ? validated[socket.id].picture : 'blank_user_profile.jpg',
                        text    : msg.text,
                        time    : msg.time
                    });
                });
            });

            // Attempting to remove this socket upon a disconnect.
            socket.on('disconnect', function () { removeSocket(socket); });
        });
    });
}

// Initializing a socket.
function initSocket(socket) {
    foldermodules.importFolder({
        path: 'sockets/methods',

        fn: function (module) {
            for (var key in module)
                if (module.hasOwnProperty(key))
                    socket.on(key, module[key](socket));
        }
    });
}

// Initializing socket.io.
function initIO(io) {
    var keys      = [];
    var listeners = {};
    foldermodules.importFolder({
        path: 'sockets/methods',

        fn: function (module) {
            for (var key in module) {
                if (module.hasOwnProperty(key)) {
                    keys.push(key);
                    listeners[key] = module[key];
                }
            }
        }
    });

    io.on('connect', function (socket) {
        for (var i = 0; i < keys.length; i++)
            socket.on(keys[i], listeners[keys[i]](io, socket));
    });
}

/////////////
// Exports //
module.exports.getCurrentUsers = helper.getCurrentUsers;
module.exports.initSocket      = initSocket;
module.exports.initIO          = initIO;
