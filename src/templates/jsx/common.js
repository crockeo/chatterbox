// Name  : common.js
// Author: Cerek Hillen
//
// Description:
//   Some common functionality to be shared between a number of web pages and
//   the server.

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

// Responding to a standard form submit. Meant to be .bind()-ed with the calling
// React class.
function handleFormSubmit(response) {
    var json = JSON.parse(response);

    var errorClass;
    if (json.error)
        errorClass = 'text-danger';
    else if (!json.success)
        errorClass = 'text-warning';
    else
        errorClass = 'text-success';

    this.setState({
        errorClass: errorClass,
        error: json.message
    });
}

// Checking that all of the keys in a given array exist in a piece of JSON.
function allExists(json, keys, callback) {
    setTimeout(function () {
        for (var i = 0; i < keys.length; i++) {
            if (json[keys[i]] === undefined) {
                callback(false);
                return;
            }
        }

        callback(true);
    }, 0);
}

/////////////
// Exports //

//
// This section is dedicated to functions specifically usable by the server.
//

if (typeof module !== 'undefined' && module.exports) {
    module.exports.allExists = allExists;
}
