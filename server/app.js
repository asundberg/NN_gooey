var Express = require('express');
//var child_process = require('child_process');
var path = require('path');
var app = Express(); // Create an express app!
//var Training = require('./db/models').Training;

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var npmPath = path.join(__dirname, '../node_modules');
var browserPath = path.join(__dirname, '../browser');


app.use(Express.static(npmPath));
app.use(Express.static(browserPath));

app.use('/', require('./routes'));

app.use(function (err, req, res, next) {
    console.error(err, typeof next);
    console.error(err.stack);
    res.status(err.status || 500).send(err.message || 'Internal server error.');
});

module.exports = app;
