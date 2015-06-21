// Name  : register.js
// Author: Cerek Hillen
//
// Description:
//   Socket functionality covering registration of sockets.

/////////////
// Imports //
var common = require('../../common.js'),
    helper = require('../helper.js'),
    join   = require('./join.js');

//////////
// Code //

// Valiating the authentication and registering a socket.
function register(io, socket) {
    return function (cookie) {
        common.isLogged(cookie, function (err, logged, userinfo) {
            socket.emit('message', helper.serverMessage('Connected to the server.'));

            if (!err && logged) {
                var jCookie;

                try       { jCookie = JSON.parse(cookie);   }
                catch (e) { console.log(String(e)); return; }

                helper.addValidation(socket.id, {
                    username: jCookie.username,
                    picture : userinfo ? userinfo.picture : undefined,
                    auth    : jCookie.auth
                });

                join.join(io, socket)({
                    name: 'main'
                });

                socket.emit('message', helper.serverMessage('Logged in to the server.'));
            }

            socket.join('main');
        });
    };
}

/////////////
// Exports //
module.exports.register = register;
