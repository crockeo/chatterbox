// Name  : leave.js
// Author: Cerek Hillen
//
// Description:
//   Functionality to leave a channel.

//////////
// Code //

// A socket attempting to leave a channel.
function leave(io, socket) {
    return function (channel) {
        socket.leave(channel);
        console.log('Leaving: ' + channel);
    };
}

/////////////
// Exports //
module.exports.leave = leave;
