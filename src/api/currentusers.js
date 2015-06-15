// Name  : currentusers.js
// Author: Cerek Hillen
//
// Description:
//   An API endpoint to get the current list of users connected to chat.

/////////////
// Imports //
var socketmanager = require('../sockets/manager.js');

//////////
// Code //

// Handling a GET request on this module's path.
function get(req, res) {
    socketmanager.getCurrentUsers(function (users) {
        res.json(users);
    });
}

/////////////
// Exports //
module.exports.path = '/currentusers';
module.exports.get  = get;
