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
(function (global) {
    var checkedCookie = null;
    var logged = null;

    global.checkLogged = function (callback) {
        if (typeof callback !== 'function')
            throw new Error('Callback must be a function.');

        var authCookie = Cookies.get('auth');
        if (authCookie === checkedCookie && logged !== null) {
            callback(logged);
            return;
        }

        makeRequest({
            method: 'GET',
            path: '/api/islogged',

            headers: {
                'Accept': 'application/json'
            },

            onload: function (response) {
                var json;
                try       { json = JSON.parse(response); }
                catch (e) { callback(false); return;     }

                checkedCookie = authCookie;
                logged = json.logged;
                callback(logged);
            }
        });
    };
})(typeof window === undefined ? this : window);

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

// Getting a given query parameter from the URL.
(function (global) {
    var cache = {};

    global.getQueryParam = function(name) {
        if (cache[name] !== undefined)
            return cache(name);

        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
            results = regex.exec(location.search);

        if (results === null)
            cache[name] = '';
        else
            cache[name] = decodeURIComponent(results[1].replace(/\+/g, ' '));

        return cache[name];
    };
})(typeof window === undefined ? this : window);
