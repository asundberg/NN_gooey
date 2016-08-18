import numpy
import pandas
import math
import json
# from encoder import Encoder as LabelEncoder
# from encoder import Decoder
from keras.utils import np_utils
from keras.models import Sequential
from keras.layers import Dense
from keras.models import model_from_json

def getData():
	return [1.0,2.0,3.0,4.0,5.1,6.1,7.1,8.1,9.1,10.2,0.94,0.99]

def trainModel():
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
	# filename = "/Users/Ddangu/nn_gooey_practice/datasets/soybean-small.data.txt"
	X = numpy.array([[1,2,3,4,5],[11,12,13,14,15],[21,22,23,24,25]])
	# filename="/Users/Ddangu/nn_gooey_practice/datasets/pima-indians-diabetes.txt"
	# dataframe = pandas.read_csv(filename, sep=initDelimiter, header=None)
	# dataset = dataframe.values
	# shape = dataframe.shape
	# numX = shape[1]
	# numY = shape[0]
	# numInputs = numX-1
	print pandas.DataFrame(X).shape
	
trainModel()
