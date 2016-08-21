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
	var modelId;
	var modelStuffPath = path.join(__dirname, '../modelStuff');
	var data;
	//creating new so that we can get the modelId
	Training.create({})
	.then(newModel => {
		//console.log("new model id: " + newModel.id);
		modelId = newModel.id;
		data = {
			classType: classType,
			input: input,
			output: output,
			hiddenLayer: hiddenLayer,
			modelId: modelId,
			modelStuffPath: modelStuffPath
		};
		//console.log("data", data);
		py.stdin.write(JSON.stringify(data));
		py.stdin.end();
	})

	// var data = [input, output];
	var finalArr = [];

	py.stdout.on('data', function (data) {
		finalArr.push(JSON.parse(data));
	});

	py.stdout.on('end', function () {
		console.log('ended');
		console.log('finalArr', finalArr[0]);
		var trainingObj = finalArr[0];
		var sendBackObj = [{
			predictions: trainingObj.predictions,
			accuracy: trainingObj.accuracy,
			modelId: trainingObj.modelId //url for testing is localhost:1337/#/test/5
		}];

		//console.log('NEW WEIGHT', JSON.stringify(trainingObj.weights))
		Training.findById(sendBackObj.modelId)
		.then(foundModel => {
			return foundModel.update({
				config: "modelStuff/config/"+sendBackObj.modelId+"_config.json",
				weights: "modelStuff/weights/"+sendBackObj.modelId+"_model.h5",
				lib: "modelStuff/lib/"+sendBackObj.modelId+"_lib.json"
			})
		})
		.then(function() { //update method does not return anything
			res.send(sendBackObj);
		})
		.catch(next);
	});


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
		// console.log("WEIGHT NEW", JSON.parse(foundTraining.weights))
		// var convertedWeights = JSON.parse(foundTraining.weights)
		// var convertWeights = foundTraining.weights.toString('utf-8').split(',').map(str=>Number(str))

		// tempTraining.config = JSON.stringify(JSON.parse(foundTraining.config.toString('utf-8')));
		// tempTraining.weights = convertWeights;
		// tempTraining.lib = foundTraining.lib.toString('utf-8')
		tempTraining.configPath = foundTraining.config;
		tempTraining.weightsPath = foundTraining.weights;
		tempTraining.libPath = foundTraining.lib;
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
