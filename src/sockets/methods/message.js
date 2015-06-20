// Name  : message.js
// Author: Cerek Hillen
//
// Description:
//   Functionality to propagate messages from a socket to all other sockets.

/////////////
// Imports //
var helper = require('../helper.js');

//////////
// Code //

// Directing and propagating incoming messages.
function message(io, socket) {
    return function (msg) {
        var validation = helper.getValidation(socket.id);
        if (!msg.auth || validation === undefined) {
            var serverMsg = helper.serverMessage('You must be logged in to send chat messages.');
            serverMsg.channel = msg.channel;
            socket.emit('message', serverMsg);

            return;
        }

        io.to(msg.channel).emit('message', {
            channel : msg.channel,
            username: validation.username,
            picture : validation.picture ? validation.picture : 'blank_user_profile.jpg',
            text    : msg.text,
            time    : msg.time
        });
    };
}

/////////////
// Exports //
module.exports.message = message;
