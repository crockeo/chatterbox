// Name  : invite.js
// Author: Cerek Hillen
//
// Description:
//   An API endpoint for inviting a user into a channel.

//////////
// Code //

// Handling a POST request to this API endpoint.
function post(req, res) {
    // TODO: Complete.

    res.json({
        error  : null,
        success: false,
        message: 'Not yet implemented!'
    });
}

/////////////
// Exports //
module.exports.path = '/invite';
module.exports.post = post;
