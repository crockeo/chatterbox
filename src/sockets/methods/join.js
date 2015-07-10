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

// Actually joining a given channel on a given socket.
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

            var validation = helper.getValidation(socket.id);
            if (channels.length === 0) {
                if (validation === undefined) {
                    return socket.emit('joinerr', {
                        err    : new Error('Unregistered users cannot create new channels.'),
                        message:           'Unregistered users cannot create new channels.'
                    });
                }

                new database.schema.Channel({
                    name    : channel.name,
                    authType: 'invite',
                    password: null
                }).save(function (err) {
                    if (err) {
                        socket.emit('joinerr', {
                            err    : err,
                            message: 'Failed to create the new channel.'
                        });

                        return;
                    }

                    new database.schema.InChannel({
                        username : validation.username,
                        chatName : channel.name,
                        authLevel: 0
                    }).save(function (err) {
                        if (err) {
                            socket.emit('joinerr', {
                                err    : err,
                                message: 'Failed to set up user ownership.'
                            });

                            return;
                        }

                        doRealJoin(io, socket, channel.name);
                    });
                });

                return;
            }

            var dbChannel = channels[0];

            // Automatically joining an open channel.
            if (dbChannel.authType == 'open') {
                doRealJoin(io, socket, channel.name);
                return;
            }

            // Trying to join a closed channel. One must either be invited or
            // have the correct password (on a password-authorization channel).
            if (dbChannel.authType == 'password' || dbChannel.authType == 'invite') {
                database.schema.InChannel.find({
                    username: channel.username,
                    chatName: channel.chatName
                }, function (err, matches) {
                    if (err || matches.length === 0) {
                        // Even if there are no InChannels we still try to log
                        // in users to a 'password' channel.
                        if (dbChannel.authType == 'password') {
                            // Failing to log in.
                            if (dbChannel.password !== channel.password) {
                                return socket.emit('joinerr', {
                                    err    : null,
                                    message: 'Invalid channel password.'
                                });
                            }

                            // Creating an InChannel for that user if they're
                            // logged in and they have the right channel
                            // password.
                            if (validation !== undefined) {
                                return new database.schema.InChannel({
                                    username : validation.username,
                                    chatName : channel.name,
                                    authLevel: 0
                                }).save(function (err) {
                                    if (err) {
                                        socket.emit('joinerr', {
                                            err    : err,
                                            message: 'Failed to set up user ownership.'
                                        });

                                        return;
                                    }

                                    doRealJoin(io, socket, channel.name);
                                });
                            }
                        }
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
