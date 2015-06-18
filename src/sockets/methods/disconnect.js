// Name  : disconnect.js
// Author: Cerek Hillen
//
// Description:
//   Functionality to run on a socket disconnect.

/////////////
// Imports //
var helper = require('../helper.js');

//////////
// Code //

// Disconnecting a socket.
function disconnect(io, socket) {
    return function () {
        var validation = helper.getValidation(socket.id);
        if (validation !== undefined) {
            io.emit('userdisconnect', validation.username);
            helper.removeValidation(socket.id);
        }
    }
}

/////////////
// Exports //
module.exports.disconnect = disconnect;