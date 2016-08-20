var Express = require('express');
var child_process = require('child_process');
var path = require('path');
var app = Express(); // Create an express app!
var Training = require('./db/models').Training;

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var npmPath = path.join(__dirname, '../node_modules');
var browserPath = path.join(__dirname, '../browser');

app.use(Express.static(npmPath));
app.use(Express.static(browserPath));

app.use('/', require('./routes'));

// app.post('/upload', function(req,res) )

app.post('/train', function (req,res,next) {
	//put py spawn here
	var spawn = child_process.spawn;
	var py = spawn('python', ['server/main.py']);

	var trainingData = req.body;
	var input = trainingData.inputArr;
	var output = trainingData.outputArr;
	var classType = trainingData.classType;
	var hiddenLayer = trainingData.hiddenLayersArr;
	var data = {
		classType: classType,
		input: input,
		output: output,
		hiddenLayer: hiddenLayer
	};
	// var data = [input, output];
	var finalArr = [];

	py.stdout.on('data', function (data) {
		finalArr.push(JSON.parse(data));
	});

	py.stdout.on('end', function () {
		console.log('ended');
		console.log('FINAL ARR', finalArr[0]);
		var trainingObj = finalArr[0];
		Training.create({
			config: trainingObj.config,
			weights: trainingObj.weights,
			lib: trainingObj.lib
		})
		.then(function (newObj) {
			res.send(finalArr[0].accuracy);
		})
		.catch(next);
		// console.log("final ARR", finalArr.toString('utf8'));
		// res.send(finalArr); //sends a buffer of arrays need to do res.data to retrieve
		// next();
	});

	py.stdin.write(JSON.stringify(data));
	// py.stdin.write(JSON.stringify({'data':[1,2,3,4]}));
	py.stdin.end();
});

app.use(function (err, req, res, next) {
    console.error(err, typeof next);
    console.error(err.stack);
    res.status(err.status || 500).send(err.message || 'Internal server error.');
});

module.exports = app;
