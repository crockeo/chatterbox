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
        channel : 'system',
        username: 'System',
        picture : 'system',
        time    : new Date(),
        type    : 'text',
        data    : { text: message }
    };
}

// I understand that global scope is bad and all that, but at the same time in a
// module system, it's not REALLY global, is it? It's more like saying 'hey here
// look at me, I'm a static private variable in a class' if we're using OO
// analogies.
var validated = {};

// Cacheing a validation of a given socket (and its associated authentication).
function addValidation(id, validation) {
    validation.channels = [];
    validated[id] = validation;
}

// Deleting a validation from the set of validated socket ids.
function removeValidation(id) { validated[id] = undefined; }

// Accessing the cached validation (if it exists).
function getValidation(id) { return validated[id]; }

// Joining or leaving a channel in the validation.
function joinChannel(id, name) { validated[id].channels.push(name); }

function leaveChannel(id, name) {
    var idx = validated[id].channels.indexOf(name);
    if (idx != -1)
        validated[id].channels.splice(idx, 1);
}

// Setting the current channel of a given validation.
function setChannel(id, channel) { validated[id].channel = channel; }

// A function that returns a list of users that exist in a given channel.
//
// In its current state, it has unnecessarily high time complexity because of
// the nature of the existant data structure. If I move things around a little
// with the rest of the project it can be greatly optimized.
function getChannelUsers(channel, callback) {
    if (typeof channel !== 'string' || typeof callback !== 'function')
        throw new Error('Invalid arguments to getChannelUsers.');

    var users = [];
    for (var key in validated) {
        if (validated.hasOwnProperty(key) && validated[key] !== undefined) {
            if (validated[key].channels.indexOf(channel) !== -1) {
                users.push({
                    username: validated[key].username,
                    picture : validated[key].picture
                });
            }
        }
    }

    callback(users);
}

/////////////
// Exports //
module.exports.serverMessage    = serverMessage;
module.exports.addValidation    = addValidation;
module.exports.removeValidation = removeValidation;
module.exports.getValidation    = getValidation;
module.exports.joinChannel      = joinChannel;
module.exports.leaveChannel     = leaveChannel;
module.exports.setChannel       = setChannel;
module.exports.getChannelUsers  = getChannelUsers;
