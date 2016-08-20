import numpy
import pandas
import math
import json
from keras.utils import np_utils
from keras.models import Sequential
from keras.layers import Dense
from keras.models import model_from_json
#setUp Decoder as well

def test(lines):
    json_file = open('model.json', 'r')

    loaded_model_json = json_file.read()
    json_file.close()
    loaded_model = model_from_json(loaded_model_json)
    weights = loaded_model.get_weights
    return [w.tolist() for w in weights]