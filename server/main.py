import sys, json, numpy as np
import train as Train
import data
#Read data from stdin
def read_in():
    lines = sys.stdin.readlines()
    print lines[0]
    #lines 0 is Func for main to call, 1 is data passed in
    data = [lines[0], json.loads(lines[1])]
    return data

def main():
    #get our data as an array from read_in()
    lines = read_in()
    print lines[1]
    if(lines[0] == 'train'):
    	result = Train.trainModel(lines[1])
    	sendBack = json.dumps(result)
    else:
    	sendBack =  {"error": "error occurred Be aware"}

    print sendBack

#start process
if __name__ == '__main__':
    main()
