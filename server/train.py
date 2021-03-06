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

def trainModel(lines):
  X = numpy.array(lines['input']).astype(float)
  Y = numpy.array(lines['output'])
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
  hiddenLayer = lines['hiddenLayer']
  seed = 7
  numpy.random.seed(seed)

  #change filename, testType, and initDelimiter (if not comma)

  #initializations
  testType = lines['classType']
  currentTest=testList[testType]; #from param
  initWgt = 'uniform'
  initAct = 'relu'
  initOptimizer='adam'
  initLoss=''
  initDelimiter=",";

  Xframe = pandas.DataFrame(X)
  Yframe = pandas.DataFrame(Y)
  Xshape = Xframe.shape
  Yshape = Yframe.shape
  numX = Xshape[1]
  numY = Yshape[0]
  numInputs = numX
  encoder = LabelEncoder()
  encoded_Y = encoder.transform(Y)
  currentTest['outputY'] = encoded_Y
  # print(numY)
  # print(numX)

  #need the following line for multi-class
  if testType=='multi_class':
    dummy_y = np_utils.to_categorical(encoded_Y)
    currentTest['outputY']=dummy_y
    currentTest['outputNum']=dummy_y.shape[1]

  def create_baseline():
    # create model
    model = Sequential()
    model.add(Dense(hiddenLayer[0], input_dim=numInputs, init=initWgt, activation=initAct))
    hiddenLayer.pop(0)
    for num in hiddenLayer:
      model.add(Dense(num, init=initWgt, activation=initAct))
    model.add(Dense(currentTest['outputNum'], init=initWgt, activation=currentTest['outputAct']))
    # Compile model
    model.compile(loss=currentTest['loss'], optimizer=initOptimizer, metrics=['accuracy'])
    return model

  model = create_baseline()
  history = model.fit(X, currentTest['outputY'], batch_size=150, nb_epoch=100, verbose=0)
  results = model.evaluate(X, currentTest['outputY'], verbose=0)

  decoder = Decoder()
  decoder.setDecoder(encoder.getKeyVal())

  lib = {
    'lossType': currentTest['loss'],
    'decoder': decoder.getDecoder()
  }

  modelStuffPath = lines['modelStuffPath']
  modelId = lines['modelId']

  with open(modelStuffPath +"/lib/" + str(modelId) + "_lib.json", 'w') as json_data:
      json.dump(lib, json_data)

  config = model.to_json()
  with open(modelStuffPath+ "/config/" + str(modelId) + "_config.json", "w") as json_file:
      json_file.write(config)
  # serialize weights to HDF5
  model.save_weights(modelStuffPath+"/weights/" + str(modelId) + "_model.h5")
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
    'predicted': predictedScore,
    'modelId': modelId
  }
  return sendBack
