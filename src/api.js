// Name  : api.js
// Author: Cerek Hillen
//
// Description:
//   This module should register every single API route.

/////////////
// Imports //
var cookieParser  = require('cookie-parser'),
    bodyParser    = require('body-parser'),
    express       = require('express'),
    fs            = require('fs'),

    foldermodules = require('./foldermodules');

//////////
// Code //

// Creating the API section of the app.
var app = express();

// Parsing POST requests as JSON.
app.use(bodyParser.json());
app.use(cookieParser());

// initFromDir scans a given directory (specified by the argument) and attempts
// to register every file in that directory using the 'registerEndpoint'
// function.
function initFromDir(path) {
    var methods = ['options', 'get', 'head', 'post', 'put', 'delete', 'trace', 'connect'];
    var fns = {};
    for (var i = 0; i < methods.length; i++) {
        fns[methods[i]] = (function (module) {
            var name = methods[i];

            return function (module) { app[name](module.path, module[name]); };
        })();
    }

    foldermodules.importFolder({
        path: path,
        fns: fns
    });
}

// init scans the 'api' directory for every single Javascript file and attempts
// to register it using the 'registerEndpoint' function (after requiring it).
function init() { return initFromDir('api'); }

/////////////
// Exports //
module.exports.app         = app;
module.exports.initFromDir = initFromDir;
module.exports.init        = init;
