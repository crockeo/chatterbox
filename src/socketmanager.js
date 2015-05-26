// Name  : socketmanager.js
// Author: Cerek Hillen
//
// Description:
//   This module manages how sockets are handled.

//////////
// Code //

// The object of sockets that are currently connected.
var sockets = [];

// The function to add a socket to the set of sockets.
function addSocket(socket) {
    console.log('Adding a socket...');

    sockets.push(socket);
}

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
    for (var key in sockets)
        if (sockets.hasOwnProperty(key))
            fn(sockets[key]);
}

// Initializing a socket.
function initSocket(socket) {
    addSocket(socket);

    socket.on('message', function (msg) {
        if (!msg.username || !msg.auth) {
            socket.emit('message', {
                username: 'System',
                text: 'You must be logged in to send chat messages.',
                time: new Date()
            });

            return;
        }

        console.log('Received message: ' + msg);
        eachSocket(function (socket) {
            socket.emit('message', msg);
        });
    });

    // Attempting to remove this socket upon a disconnect.
    socket.on('disconnect', function () { removeSocket(socket); });
}

/////////////
// Exports //
module.exports.initSocket = initSocket;
