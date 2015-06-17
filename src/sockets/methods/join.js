// Name  : join.js
// Author: Cerek Hillen
//
// Description:
//   Functionality to subscribe a new channel.

//////////
// Code //

// A socket attempting to join a new channel.
function join(io, socket) {
    return function (channel) {
        socket.join(channel);
        console.log('Joining: ' + channel);
    };
}

/////////////
// Exports //
module.exports.join = join;
