// Name  : app.js
// Author: Cerek Hillen
//
// Description:
//   The main entry point to the web application. Links together serving the
//   compiled static files and the dynamic API endpoints.

/////////////
// Imports //
var io      = require('socket.io'),
    express = require('express'),
    http    = require('http'),
    fs      = require('fs'),

    socketmanager = require('./sockets/manager.js'),
    database      = require('./database.js'),
    api           = require('./api.js');


//////////
// Code //

// Connecting to the database.
var url = process.env.MONGO_URL;
if (url === undefined)
  url = 'mongodb://localhost/chatterbox';
  database.connect(url);

// BE CAREFUL AROUND HERE
//
// If you run this program w/ a 'cleandb' argument, it will go through all of
// the existent schemas in the database.js file and remove them.
var si;
if (process.argv[0] === 'node')
    si = 2;
else if (process.argv[0] === 'chatterbox')
    si = 1;

if (process.argv[si] === 'cleandb') {
    console.log('Are you sure you want to clean out the database?');
    console.log('Press any key to continue, and ^C to exit.');

    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.once('data', function (chunk) {
        var keys = [];
        for (var key in database.schema)
            if (database.schema.hasOwnProperty(key))
                keys.push(key);

        var removeSchema = function (index, callback) {
            if (index >= keys.length)
                return callback();

            database.schema[keys[index]].remove({}, function (err) {
                if (err) {
                    console.log('Failed to remove "' + keys[index] + '" from the database.');
                    process.exit();
                }

                console.log('Removing "' + keys[index] + '".');
                removeSchema(index + 1, callback);
            });
        };

        removeSchema(0, function () {
            console.log('Adding default data...');

            new database.schema.Channel({
                name    : 'main',
                authType: 'open',
                password: ''
            }).save(function (err) {
                if (err)
                    console.log('Failed to create the default channel.');

                console.log('Done!');
                process.exit();
            });

        });
    });

    return;
}

// Creating the app.
var app = express();

// Determining the port of the app.
var port = process.env.PORT;
if (port === undefined)
  port = 3000;

// Switch this between true and false if you want to log / not log requests.
if (false) {
    app.use(function (req, res, next) {
        console.log(new Date() + ': ' + req.method + ' - ' + req.url);
        next();
    });
}

// Serving static files.
app.use('/static', express.static(__dirname + '/static'));

// Serving HTML files.
app.use(express.static(__dirname + '/static/html'));

// Registering the API section of the app.
console.log('Initializing the API...');
api.init();
app.use('/api', api.app);

// Serving a 404 page (plaintext if a 404.html does not exist).
app.use(function (req, res, next) {
  fs.exists(__dirname + '/static/html/404.html', function (exists) {
    if (exists)
      res.status(404).sendFile(__dirname + '/static/html/404.html');
    else
      res.status(404).send('Error 404: Page not found.');
  });
});

// Setting up socket.io
var realHttp = http.Server(app),
    realIo   = io(realHttp);

socketmanager.initIO(realIo);

// Serving the content.
realHttp.listen(port, function () {
    console.log('Server started on port ' + port);
});
