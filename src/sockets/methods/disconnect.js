// Name  : disconnect.js
// Author: Cerek Hillen
//
// Description:
//   Functionality to run on a socket disconnect.

/////////////
// Imports //
var channelpref = require('../../api/channelpref.js'),
    helper      = require('../helper.js');

//////////
// Code //

// Disconnecting a socket.
function disconnect(io, socket) {
    return function () {
        var validation = helper.getValidation(socket.id);
        if (validation !== undefined) {
            channelpref.updateChannelPref(validation.username, validation.channels, validation.channel, function (err) {
                if (err) {
                    console.log('Failed to update channel preferences for "' + validation.username + '": ' + String(err));
                }
            });

            for (var i = 0; i < validation.channels.length; i++) {
                io.emit('userdisconnect', {
                    username: validation.username,
                    channel : validation.channels[i]
                });
            }

            helper.removeValidation(socket.id);
        }
    }
}

/////////////
// Exports //
module.exports.disconnect = disconnect;
