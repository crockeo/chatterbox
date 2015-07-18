// Name  : message.js
// Author: Cerek Hillen
//
// Description:
//   Functionality to propagate messages from a socket to all other sockets.

/////////////
// Imports //
var database = require('../../database.js'),
    helper   = require('../helper.js');

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

        // Creating an object to contain message data.
        var msgData = {
            channel : msg.channel,
            username: validation.username,
            picture : validation.picture ? validation.picture : 'blank_user_profile.jpg',
            time    : msg.time,
            type    : msg.type,
            data    : msg.data
        };

        // Trying to cache the message.
        new database.schema.Message(msgData).save(function (err) {
            if (err)
                console.log('Failed to cache message: ' + String(err));
            io.to(msg.channel).emit('message', msgData);
        });
    };
}

/////////////
// Exports //
module.exports.message = message;
