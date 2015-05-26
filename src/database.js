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

// Creating a bunch of the raw schema.
var UserSchema = mongoose.Schema({
    email   : String,
    username: String,
    password: String,
    created : Date,
    verified: Date
})

UserSchema.methods.hashMe = function (callback) {
    if (callback === undefined)
        return;

    bcrypt.hash(this.username + this.password, 10, function (err, hash) {
        if (err) {
            callback(err, '');
            return;
        }

        callback(null, hash);
    });
}

// The schema to be used in the database.
var schema = {
    User: mongoose.model('User', UserSchema)
};

/////////////
// Exports //
module.exports.connect = connect;
module.exports.schema = schema;
