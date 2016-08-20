var Express = require('express');
var child_process = require('child_process');
var path = require('path');
var app = Express(); // Create an express app!
var Training = require('./db/models').Training;

module.exports = app;

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var indexHtmlPath = path.join(__dirname, '../index.html');
var npmPath = path.join(__dirname, '../node_modules');
var browserPath = path.join(__dirname, '../browser');

app.use(Express.static(npmPath));
app.use(Express.static(browserPath));

app.get('/', function (req, res) {
	res.sendFile(indexHtmlPath);
});

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
		console.log(finalArr[0]);
		var trainingObj = finalArr[0];
		var sendBackObj = [{
			predictions: trainingObj.predictions,
			accuracy: trainingObj.accuracy 
		}]

		Training.create({
			config: trainingObj.config,
			weights: trainingObj.weights,
			lib: trainingObj.lib
		})
		.then(function (newObj) {
			console.log(newObj);
			res.send(sendBackObj);
		})
		.catch(next);
	});
	py.stdin.write(JSON.stringify(data));
	py.stdin.end();
});

app.post('/test/:id', function(req,res,next){
	var spawn = child_process.spawn;
	var py = spawn('python', ['server/predict.py']);
	// var inputs = req.body.inputArr;
	var inputs = [6,148,72,35,0,44.6,0.627,50]
	var tempTraining = {};
	tempTraining.inputs  = inputs;
	
	Training.findById(req.params.id)
	.then(foundTraining => {
		tempTraining.config = foundTraining.config;
		tempTraining.weights = foundTraining.weights;
		tempTraining.lib = foundTraining.lib
		py.stdin.write(JSON.stringify(tempTraining));
		py.stdin.end(); 
		console.log("FOUND IT", foundTraining)
	})
	.catch(next)

	var predictedOutputs;
	py.stdout.on('data', function (data) {
		predictedOutputs = JSON.parse(data);
	});

	py.stdout.on('end', function () {
		console.log("ended")
		console.log(predictedOutputs)
	});



})


//{"input":"[[1,2],[3,4]]", "output":"[[5,6],[7,8]]"}