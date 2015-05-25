// Name  : socketmanager.js
// Author: Cerek Hillen
//
// Description:
//   This module manages how sockets are handled.

//////////
// Code //

// Initializing a socket.
function initSocket(socket) {
    // TODO: Initialization stuff.
    console.log('Initializing a socket.');

    socket.on('message', function (msg) {
        console.log('Received message: ' + msg);
    });

    socket.on('disconnect', function () {
        console.log('Disconnecting a socket');
    });
}

/////////////
// Exports //
module.exports.initSocket = initSocket;
