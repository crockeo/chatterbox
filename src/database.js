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
    User: mongoose.model('User', {
        email   : String,
        username: String,
        password: String,
        created : Date,
        verified: Date,
        picture : String
    })
};

/////////////
// Exports //
module.exports.connect = connect;
module.exports.schema = schema;
