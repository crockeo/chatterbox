// Name  : join.js
// Author: Cerek Hillen
//
// Description:
//   Functionality to subscribe a new channel.

/////////////
// Imports //
var helper = require('../helper.js');

//////////
// Code //

// A socket attempting to join a new channel.
function join(io, socket) {
    return function (channel) {
        socket.join(channel);

        var v = helper.getValidation(socket.id);
        if (v !== undefined) {
            helper.joinChannel(socket.id, channel);
            io.to(channel).emit('userconnect', {
                channel : channel,
                user    : {
                    username: v.username,
                    picture : v.picture
                }
            });
        }

        console.log('Joining: ' + channel);
    };
}

/////////////
// Exports //
module.exports.join = join;
