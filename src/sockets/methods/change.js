// Name  : change.js
// Author: Cerek Hillen
//
// Description:
//   A piece of functionality to 

/////////////
// Imports //
var helper = require('../helper.js');

//////////
// Code //

// Updating a user's last channel when they change their channel.
function change(io, socket) {
    return function (channel) {
        helper.setChannel(socket.id, channel);
    }
}

/////////////
// Exports //
module.exports.change = change;
