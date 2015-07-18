// Name  : database.js
// Author: Cerek Hillen
//
// Description:
//   Managing database schema and connections to a MongoDB database.

/////////////
// Imports //
var mongoose = require('mongoose'),
    bcrypt   = require('bcrypt');

//////////
// Code //

// Connecting to a given database at a given connection url.
function connect(connUrl) { mongoose.connect(connUrl); }

// The schema to be used in the database.
var schema = {
    // A schema to represent a user in the database.
    User: mongoose.model('User', {
        email   : String,
        username: String,
        password: String,
        created : Date,
        verified: Date,
        picture : String
    }),

    // A schema to represent a chat channel. It includes information about
    // authentication methods to enter a channel.
    //
    // authType options:
    //   'open'     - Anyone can join this channel.
    //   'password' - Anyone can join this channel so long as they have the
    //                correct password.
    //   'invite'   - Only those who have been invited to the channel can join
    //                the channel.
    Channel: mongoose.model('Channel', {
        name    : String,
        authType: String,
        password: String
    }),

    // Cacheing whether or not a user is authenticated to be part of a channel.
    // Authorization levels follow:
    //   0 - Admin
    //   1 - Moderator
    //   2 - User
    InChannel: mongoose.model('InChannel', {
        username : String,
        chatName : String,
        authLevel: Number
    }),

    // Storing a raw image file in the database.
    Img: mongoose.model('Img', {
        id         : Number,
        contentType: String,
        hash       : String,
        data       : Buffer
    }),

    // Storing the preferred channels for a user to auto-join on the next page
    // load.
    ChannelPref: mongoose.model('ChannelPref', {
        username: String,
        channels: [String]
    }),

    // Representing a chat message in the database.
    Message: mongoose.model('Message', {
        channel : String,
        username: String,
        picture : String,
        time    : Date,
        type    : String,
        data    : Object
    })
};

/////////////
// Exports //
module.exports.connect = connect;
module.exports.schema = schema;
