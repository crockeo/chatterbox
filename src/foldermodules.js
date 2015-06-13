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
    for (var key in module)
        if (module.hasOwnProperty(key) && typeof config.fns[key] !== 'undefined')
            config.fns[key](module);
}

// Importing a whole folder given some configuration. Performed synchronously
// so that modules are imported before server starts.
function importFolder(config) {
    if (typeof config === 'undefined' || typeof config.path === 'undefined')
        throw new Error('No configuration specified.');

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
