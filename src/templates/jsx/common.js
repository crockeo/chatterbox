// Name  : common.js
// Author: Cerek Hillen
//
// Description:
//   Some common functionality to be shared between a number of web pages.

//////////
// Code //

function checkLogged(callback) {
    if (typeof callback !== 'function')
        throw new Error('Callback must be a function');

    var req = new XMLHttpRequest();

    // Using self = this as opposed to binding the function the below seeing
    // as I wish to have a reference to 'this' pointing at the response
    // object as well as 'self' pointing to the LoginApp.
    var self = this;

    req.onload = function () {
        try       { callback(JSON.parse(this.response).logged); }
        catch (e) { callback(false);                            }
    };

    req.open('GET', '/api/islogged');
    req.setRequestHeader('Accept', 'application/json');
    req.send();
}
