// Name  : helper.js
// Author: Cerek Hillen
//
// Description:
//   A number of helper methods surrounding sockets.

//////////
// Code //

// Constructing a message from the server.
function serverMessage(message) {
    return {
        channel : 'main',
        username: 'System',
        picture : 'system.png',
        text    : message,
        time    : new Date()
    };
}

// I understand that global scope is bad and all that, but at the same time in a
// module system, it's not REALLY global, is it? It's more like saying 'hey here
// look at me, I'm a static private variable in a class' if we're using OO
// analogies.
var validated = {};

// Cacheing a validation of a given socket (and its associated authentication).
function addValidation(id, validation) { validated[id] = validation; }

// Deleting a validation from the set of validated socket ids.
function removeValidation(id) { validated[id] = undefined; }

// Accessing the cached validation (if it exists).
function getValidation(id) { return validated[id]; }

// Getting the set of users currently connected & validated by the server.
function getCurrentUsers(callback) {
    if (typeof callback !== 'function')
        return;

    setTimeout(function () {
        var users = [];
        for (var key in validated) {
            if (validated.hasOwnProperty(key) && validated[key] !== undefined) {
                users.push({
                    username: validated[key].username,
                    picture : validated[key].picture
                });
            }
        }

        callback(users);
    }, 0);
}

/////////////
// Exports //
module.exports.serverMessage    = serverMessage;
module.exports.addValidation    = addValidation;
module.exports.removeValidation = removeValidation;
module.exports.getValidation    = getValidation;
module.exports.getCurrentUsers  = getCurrentUsers;
