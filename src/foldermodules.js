// Name  : foldermodules.js
// Author: Cerek Hillen
//
// Description:
//   A module to load other modules from a folder with a set of operations to
//   perform based on different values that may or may not exist within the
//   folder.

/////////////
// Imports //
var fs = require('fs');

//////////
// Code //

// Importing a specified module.
function importModule(module, config) {
    if (typeof config.required !== 'undefined')
        for (var i = 0; i < config.required.length; i++)
            if (typeof module[config.required[i]] === 'undefined')
                throw new Error('Module does not have a required value: ' + config.required[i]);

    config.fn(module);
}

// Importing a whole folder given some configuration. Performed synchronously
// so that modules are imported before server starts.
//
// The configuration has 
function importFolder(config) {
    if (typeof config === 'undefined' || typeof config.path === 'undefined' || typeof config.fn === 'undefined')
        throw new Error('Invalid configuration.');

    if (config.path[0] !== '/')
        config.path = '/' + config.path;

    var files = fs.readdirSync(__dirname + config.path);
    for (var i = 0; i < files.length; i++)
        importModule(require(__dirname + config.path + '/' + files[i]), config);
}

/////////////
// Exports //
module.exports.importModule = importModule;
module.exports.importFolder = importFolder;
