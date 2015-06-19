// Name  : leave.js
// Author: Cerek Hillen
//
// Description:
//   Functionality to leave a channel.

/////////////
// Imports //
var helper = require('../helper.js');

//////////
// Code //

// A socket attempting to leave a channel.
function leave(io, socket) {
    return function (channel) {
        helper.leaveChannel(socket.id, channel);
        socket.leave(channel);

        var v = helper.getValidation(socket.id);
        if (v !== undefined) {
            io.to(channel).emit('userdisconnect', {
                channel : channel,
                user    : {
                    username: v.username,
                    picture : v.picture
                }
            });
        }

        console.log('Leaving: ' + channel);
    };
}

/////////////
// Exports //
module.exports.leave = leave;
