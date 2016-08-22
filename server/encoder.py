import numpy

class Encoder:

  def __init__(self):
    self.keyVal = {}

  def transform(self,Y):
    uniqueVal = set(Y)
    counter = 0;
    #Make Dictionary of Key Values
    for x in uniqueVal:
        self.keyVal[str(x)] = counter
        counter+=1
    #transform Y
    newarr=[]
    for index in range(0,len(Y)):
      newarr.append(self.keyVal[str(Y[index])])
    return newarr

  def getKeyVal(self):
    return self.keyVal

class Decoder:
  def __init__(self):
    self.keyVal = {}

  def setDecoder(self, encoder):
    self.keyVal = dict((v,k) for k,v in encoder.iteritems())

  def getDecoder(self):
    return self.keyVal

  def decode(self, y):
    return self.keyVal[y]
