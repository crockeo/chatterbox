// Name  : common.js
// Author: Cerek Hillen
//
// Description:
//   Some common functionality to be shared between a number of web pages.

//////////
// Code //

// Making an AJAX request to a given URL.
function makeRequest(config) {
    var req = new XMLHttpRequest();

    req.onprogress = config.onprogress;
    req.onabort = config.onabort;
    req.onerror = config.onerror;
    req.onload = function () { config.onload(this.response) };

    req.open(config.method, config.path);

    for (var key in config.headers)
        if (config.headers.hasOwnProperty(key))
            req.setRequestHeader(key, config.headers[key]);

    req.send(config.body);
}

// Checking whether or not a user is logged in.
function checkLogged(callback) {
    if (typeof callback !== 'function')
        throw new Error('Callback must be a function');

    makeRequest({
        method: 'GET',
        path: '/api/islogged',

        headers: {
            'Accept': 'application/json'
        },

        onload: function (response) {
            try       { callback(JSON.parse(response).logged); }
            catch (e) { callback(false);                       }
        }.bind(this)
    });
}
