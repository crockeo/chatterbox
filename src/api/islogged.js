// Name  : islogged
// Author: Cerek Hillen
//
// Description:
//   An endpoint to determine whether the current user is logged in under a
//   valid authentication.

//////////
// Code //

// Handling a GET request on this path.
function get(req, res) {
    // TODO: Implement some basic stuff.
    res.json({ logged: false });
}

/////////////
// Exports //
module.exports.path = '/islogged';
module.exports.get = get;
