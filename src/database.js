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
    Channel: mongoose.model('Channel', {
        name    : String,
        authType: String,
        password: String
    }),

    // Cacheing whether or not a user is authenticated to be part of a channel.
    InChannel: mongoose.model('InChannel', {
        username: String,
        chatName: String
    }),

    Img: mongoose.model('Img', {
        id         : Number,
        contentType: String,
        data       : Buffer
    })
};

/////////////
// Exports //
module.exports.connect = connect;
module.exports.schema = schema;
