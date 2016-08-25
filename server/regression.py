import numpy
import pandas
from keras.models import Sequential
from keras.layers import Dense

# load dataset
def trainModel(lines):
	return "hi"
	# dataframe = pandas.read_csv("machNoHeader.csv", sep=',', header=None)
	# dataset = dataframe.values
	# # split into input (X) and output (Y) variables
	# X = dataset[:,0:20]
	# Y = dataset[:,20]

	# # define base mode
	# def baseline_model():
	# 	# create model
	# 	model = Sequential()
	# 	model.add(Dense(20, input_dim=20, init='normal', activation='relu'))
	# 	model.add(Dense(1, init='normal', activation='relu'))
	# 	# Compile model
	# 	model.compile(loss='mean_squared_error', optimizer='adam')
	# 	return model

	# # fix random seed for reproducibility
	# seed = 7
	# # evaluate model with standardized dataset
	# numpy.random.seed(seed)

	# model = baseline_model()
	# model.fit(X, Y, nb_epoch=100, batch_size=150,verbose=0)
	# score = model.evaluate(X, Y, verbose=0)
	# input = numpy.array([4,	4,	2,	2,	4,	2,	3,	5,	3,	4,	2,	5,	2,	1,	4,	4,	2,	0,	5,	2]).reshape(1,20) 
	# predict = model.predict(input, batch_size=150, verbose=0)

	# print("score: ",score)
	# print("prediction, expecting 68: ",predict[0][0])

	# input2 = numpy.array([1,	2,	3,	3,	2,	4,	3,	4,	5,	5,	2,	3,	2,	3,	2,	2,	2,	4,	4,	1]).reshape(1,20)
	# predict2 = model.predict(input2, batch_size=150, verbose=0 )
	# print("prediction2, expecting 51: ", predict2[0][0])
