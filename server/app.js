var Express = require('express');
var child_process = require('child_process');
var path = require('path');
var app = Express(); // Create an express app!
var spawn = child_process.spawn;
var py = spawn('python', ['server/testing.py']);
module.exports = app;

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var indexHtmlPath = path.join(__dirname, '../index.html');
var npmPath = path.join(__dirname, '../node_modules');
var browserPath = path.join(__dirname, '../browser');
console.log(npmPath);

app.use(Express.static(npmPath));
app.use(Express.static(browserPath));

app.get('/', function (req, res) {
    res.sendFile(indexHtmlPath);
});

app.post('/train', function(req,res,next){
	var trainingData = req.body;
	var input = trainingData.input;
	var output = trainingData.output;
	var data = [input, output];
	var finalArr = [];

	py.stdout.on('data', function(data){
	  finalArr.push(data);
	});

	py.stdout.on('end', function(){
	  res.send(finalArr); //sends a buffer of arrays need to do res.data to retrieve
	  next();
	});

	py.stdin.write(JSON.stringify(data));

	py.stdin.end();
})

//{"input":"[[1,2],[3,4]]", "output":"[[5,6],[7,8]]"}
