print "hello"
print "from"
print "the"
print "other"
print "side"
print "_done"

# # Create first network with Keras
# from keras.models import Sequential
# from keras.layers import Dense
# import numpy
# # fix random seed for reproducibility
# seed = 7
# numpy.random.seed(seed)

# print "Loading data"
# # load pima indians dataset
# dataFile = "mammal.csv";
# # def trainModel():
#   dataset = numpy.loadtxt(dataFile, delimiter=" ")

#   print "Still loading data"
#   # split into input (X) and output (Y) variables
#   X = dataset[:,0:16]
#   Y = dataset[:,16]
#   # create model

#   # print "Creating model"
#   model = Sequential()
#   model.add(Dense(12, input_dim=16, init='uniform', activation='relu'))
#   model.add(Dense(8, init='uniform', activation='relu'))
#   model.add(Dense(1, init='uniform', activation='sigmoid'))
#   # Compile model
#   model.compile(loss='mse', optimizer='adam', metrics=['accuracy'])

#   # print "Fitting model"
#   # Fit the model
#   model.fit(X, Y, nb_epoch=150, batch_size=10)
#   # evaluate the model
#   scores = model.evaluate(X, Y)
#   # print("%s: %.2f%%" % (model.metrics_names[1], scores[1]*100))
#   print("_done")
