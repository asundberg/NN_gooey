import numpy
import pandas
import math
import json
from keras.utils import np_utils
from keras.models import Sequential
from keras.layers import Dense
from keras.models import model_from_json
#setUp Decoder as well

def testModel(lines):
  configPath = lines['config']
  weightsPath = lines['weights']
  libPath = lines['lib']
  userInputs = lines['inputs']
  testType = lines['testType']

  #check with Iris
  if testType == 'single':
    inputs = numpy.asarray(userInputs).reshape(1, len(userInputs))
  else:
    inputs = numpy.asarray(userInputs).reshape(len(userInputs), len(userInputs[0]))

  #inputs = numpy.array([4, 0, 2, 1, 1, 1, 0, 1, 0, 2, 1, 1, 0, 2, 2, 0, 0, 0, 1, 0, 3, 1, 1, 1, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0]).reshape(1,35)
  json_file = open(configPath, 'r')
  loaded_model_json = json_file.read()
  json_file.close()

  loaded_model = model_from_json(loaded_model_json)
  # load weights into new model
  loaded_model.load_weights(weightsPath)
  # print("Loaded model from disk")
  # cfg = loaded_model.get_config()
  # actFunc = cfg[len(cfg)-1]['config']['activation']

  with open(libPath) as json_data:
      lib_data = json.load(json_data)
  # evaluate loaded model on test data
