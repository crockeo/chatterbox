// Name  : common.js
// Author: Cerek Hillen
//
// Description:
//   Some common functionality to be shared between a number of web pages and
//   the server.

//////////
// Code //

// The global time that redirects should take to start (in milliseconds).
GLOBAL_REDIRECT_TIME = 100;

// Performing some callback with a global context.
function withGlobal(callback) {
    if (typeof callback !== 'function')
        throw new Error('');
    callback(typeof window === 'undefined' ? this : window);
}

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
withGlobal(function (global) {
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
});

// Responding to a standard form submit. Meant to be .bind()-ed with the calling
// React class. To be ran on a JSON object instead of serialized JSON.
function handleFormSubmitJSON(json) {
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

// Responding to a standard form submit. Meant to be .bind()-ed with the calling
// React class.
function handleFormSubmit(response) { handleFormSubmitJSON.bind(this)(JSON.parse(response)) }

// Getting a given query parameter from the URL.
withGlobal(function (global) {
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
});

// Code to add or remove a CSS class from a given element.
function addClass(element, classToAdd) {
    var currentClassValue = element.className;

    if (currentClassValue.indexOf(classToAdd) == -1) {
        if ((currentClassValue == null) || (currentClassValue === "")) {
            element.className = classToAdd;
        } else {
            element.className += " " + classToAdd;
        }
    }
}

function removeClass(element, classToRemove) {
    var currentClassValue = element.className;

    if (currentClassValue == classToRemove) {
        element.className = "";
        return;
    }

    var classValues = currentClassValue.split(" ");
    var filteredList = [];

    for (var i = 0 ; i < classValues.length; i++) {
        if (classToRemove != classValues[i]) {
            filteredList.push(classValues[i]);
        }
    }

    element.className = filteredList.join(" ");
}
