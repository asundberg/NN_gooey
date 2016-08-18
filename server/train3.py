import numpy
import pandas
import math
import json
from encoder import Encoder as LabelEncoder
from encoder import Decoder
from keras.utils import np_utils
from keras.models import Sequential
from keras.layers import Dense
from keras.models import model_from_json

def getData():
	return [1.0,2.0,3.0,4.0,5.1,6.1,7.1,8.1,9.1,10.2,0.94,0.99]

def trainModel(lines):
	lines = lines
	testList = {
		'binary': {
			'outputAct':'sigmoid',
			'loss':'binary_crossentropy',
			'outputY':[],
			'outputNum':1
		},
		'multi_class': {
			'outputAct':'softmax',
			'loss':'categorical_crossentropy',
			'outputY':[],
			'outputNum':1
		}
	}

	seed = 7
	numpy.random.seed(seed)

	#change filename, testType, and initDelimiter (if not comma)

	#initializations
	# testType ='multi_class'
	testType = 'binary'
	currentTest=testList[testType]; #from param
	initWgt = 'uniform'
	initAct = 'relu'
	initOptimizer='adam'
	initLoss=''
	initDelimiter=",";
	
	filename="/Users/Ddangu/nn_gooey_practice/datasets/pima-indians-diabetes.txt"
	dataframe = pandas.read_csv(filename, sep=initDelimiter, header=None)
	dataset = dataframe.values
	shape = dataframe.shape
	numX = shape[1]
	numY = shape[0]
	numInputs = numX-1
	X = dataset[:,0:numInputs].astype(float)
	Y = dataset[:,numInputs]
	encoder = LabelEncoder()
	encoded_Y = encoder.transform(Y)
	currentTest['outputY'] = encoded_Y

	#need the following line for multi-class
	if testType=='multi_class':
		dummy_y = np_utils.to_categorical(encoded_Y)
		currentTest['outputY']=dummy_y
		currentTest['outputNum']=dummy_y.shape[1]

	def create_baseline():
		# create model
		model = Sequential()
		model.add(Dense(numInputs, input_dim=numInputs, init=initWgt, activation=initAct))
		model.add(Dense(currentTest['outputNum'], init=initWgt, activation=currentTest['outputAct']))
		# Compile model
		model.compile(loss=currentTest['loss'], optimizer=initOptimizer, metrics=['accuracy'])
		return model

	model = create_baseline()
	history = model.fit(X, currentTest['outputY'], batch_size=150, nb_epoch=100, verbose=0)
	results = model.evaluate(X, currentTest['outputY'], verbose=0)
	# print('Test score:', results[0])
	# print('Test accuracy:', results[1])
	# print(history.history['acc']) #loss and accuracy per epoch

	decoder = Decoder()
	decoder.setDecoder(encoder.getKeyVal())

	lib = {
		'lossType': currentTest['loss'],
		'decoder': decoder.getDecoder()
	}

	with open("lib.json", 'w') as json_data:
	    json.dump(lib, json_data)

	model_json = model.to_json()
	with open("model.json", "w") as json_file:
	    json_file.write(model_json)
	# serialize weights to HDF5
	model.save_weights("model.h5")
	# print("Saved model to disk")

	score = model.predict(X, batch_size=150, verbose=0)

	#if multi_class
	def find_max(arr):
		maxIndex = numpy.argmax(arr)
		return maxIndex

	def find_binary(arr):
		if(arr[0]>0.5):
			return 1
		return 0

	def decodePredictedOutput(arr):
		if(testType == 'multi_class'):
			arr = map(find_max, arr)
		else: 
			arr = map(find_binary, arr)
		return map(decoder.decode, arr)

	predictedScore = decodePredictedOutput(score)

	sendBack = {
		'accuracy': history.history['acc'],
		'predicted': predictedScore
	}

	return sendBack
