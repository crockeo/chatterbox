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
module.exports.initSocket = initSocket;
module.exports.initIO     = initIO;
