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

		console.log('NEW WEIGHT', JSON.stringify(trainingObj.weights))
		Training.create({
			config: trainingObj.config.toString('utf-8'),
			weights: JSON.stringify(trainingObj.weights),
			lib: trainingObj.lib.toString('utf-8')
		})
		.then(function (newObj) {
			console.log("newobj",JSON.parse(newObj.weights));
			res.send(newObj);
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
		console.log("WEIGHT NEW", JSON.parse(foundTraining.weights))
		var convertWeights = foundTraining.weights.toString('utf-8').split(',').map(str=>Number(str))
		tempTraining.config = JSON.stringify(JSON.parse(foundTraining.config.toString('utf-8')));
		tempTraining.weights = convertWeights;
		tempTraining.lib = foundTraining.lib.toString('utf-8')
		py.stdin.write(JSON.stringify(tempTraining));
		py.stdin.end(); 
	})
	.catch(next)

	var predictedOutputs;
	py.stdout.on('data', function (data) {
		predictedOutputs = JSON.parse(data);
	});

	py.stdout.on('end', function () {
		console.log("ended")
		console.log(predictedOutputs)
		res.send(predictedOutputs)
	});



})


//{"input":"[[1,2],[3,4]]", "output":"[[5,6],[7,8]]"}