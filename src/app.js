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
    http    = require('http');
    fs      = require('fs'),

    socketManager = require('./socketmanager.js'),
    database      = require('./database.js'),
    api           = require('./api.js');


//////////
// Code //

// Creating the app.
var app = express();

// Connecting to the database.
var url = process.env.MONGO_URL;
if (url === undefined)
  url = 'mongodb://localhost/default-project';
  database.connect(url);

// Determining the port of the app.
var port = process.env.PORT;
if (port === undefined)
  port = 3000;

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

realIo.on('connection', function (socket) {
    socketManager.initSocket(socket);
});

// Serving the content.
realHttp.listen(port, function () {
    console.log('Server started on port ' + port);
});
