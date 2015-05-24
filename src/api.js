// Name  : api.js
// Author: Cerek Hillen
//
// Description:
//   This module should register every single API route.

/////////////
// Imports //
var bodyParser = require('body-parser'),
    express    = require('express'),
    fs         = require('fs');

//////////
// Code //

// Creating the API section of the app.
var app = express();

// Parsing POST requests as JSON.
app.use(bodyParser.json());

// registerEndpoint registers a whole module that can contain a set of HTTP
// methods for a single endpoint.
function registerEndpoint(module) {
  // If no path is specified, one cannot automatically register a module.
  if (module.path === undefined)
    return false;

  // Attempting to register all of the methods.
  var methods = ['options', 'get', 'head', 'post', 'put', 'delete', 'trace', 'connect'];
  for (var i = 0; i < methods.length; i++)
    if (module[methods[i]] !== undefined)
      app[methods[i]](module.path, module[methods[i]]);
}

// initFromDir scans a given directory (specified by the argument) and attempts
// to register every file in that directory using the 'registerEndpoint'
// function.
function initFromDir(path) {
  var files = fs.readdirSync(__dirname + '/' + path);
  for (var i = 0; i < files.length; i++) {
    var module = require('./' + path + '/' + files[i]);
    registerEndpoint(module);
  }
}

// init scans the 'api' directory for every single Javascript file and attempts
// to register it using the 'registerEndpoint' function (after requiring it).
function init() { return initFromDir('api'); }

/////////////
// Exports //
module.exports.app         = app;
module.exports.initFromDir = initFromDir;
module.exports.init        = init;
