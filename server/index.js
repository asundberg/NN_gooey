var http = require('http');
var server = http.createServer();

// Require our express app from the app.js file.
var app = require('./app');

// Every server request runs through our express app!
server.on('request', app);

// Export our server for this file to be require('')d
server.listen(1337,function(){
	console.log("listening to port 1337");
})
