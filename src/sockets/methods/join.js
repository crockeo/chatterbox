// Name  : join.js
// Author: Cerek Hillen
//
// Description:
//   Functionality to subscribe a new channel.

/////////////
// Imports //
var database = require('../../database.js'),
    helper   = require('../helper.js');

//////////
// Code //

//
function doRealJoin(io, socket, channel) {
    setTimeout(function () {
        console.log('Joining: ' + channel);

        socket.join(channel);
        socket.emit('join', channel);

        var v = helper.getValidation(socket.id);
        if (v !== undefined && v.channels.indexOf(channel) === -1) {
            helper.joinChannel(socket.id, channel);
            io.to(channel).emit('userconnect', {
                channel : channel,
                user    : {
                    username: v.username,
                    picture : v.picture
                }
            });
        }
    }, 0);
}

// A socket attempting to join a new channel.
function join(io, socket) {
    return function (channel) {
        database.schema.Channel.find({
            name: channel.name
        }, function (err, channels) {
            if (err) {
                socket.emit('joinerr', {
                    err    : err,
                    message: 'Failed to find the set of channels.'
                });

                return;
            }

            if (channels.length === 0) {
                new database.schema.Channel({
                    name    : channel.name,
                    authType: 'open',
                    password: null
                }).save(function (err) {
                    if (err) {
                        socket.emit('joinerr', {
                            err    : err,
                            message: 'Failed to create the new channel.'
                        });

                        return;
                    }

                    doRealJoin(io, socket, channel.name);
                });

                return;
            }

            var dbChannel = channels[0];

            // Automatically joining an open channel.
            if (dbChannel.authType == 'open') {
                doRealJoin(io, socket, channel.name);
                return;
            }

            // Requiring a password to join a password that needs a password.
            if (dbChannel.authType == 'password') {
                if (dbChannel.password === channel.password)
                    doRealJoin(io, socket, channel.name);
                else {
                    socket.emit('joinerr', {
                        err    : null,
                        message: 'Invalid channel password.'
                    });
                }

                return;
            }

            // Requiring a user to have been invited to a channel to join an
            // invite-only channel.
            if (dbChannel.authType == 'invite') {
                database.schema.InChannel.find({
                    username: channel.username,
                    chatName: channel.chatName
                }, function (err, matches) {
                    if (err || matches.length !== 0) {
                        socket.emit('joinerr', {
                            err    : null,
                            message: 'Failed to join invite-only channel.'
                        });

                        return;
                    }

                    doRealJoin(io, socket, channel.name);
                });

                return;
            }
        });

    };
}

/////////////
// Exports //
module.exports.join = join;
