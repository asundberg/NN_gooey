import sys, json, numpy as np
import train as Train
import data
#Read data from stdin
def read_in():
    lines = sys.stdin.readlines()
    #lines 0 is Func for main to call, 1 is data passed in
    return lines[0]

def main():
    #get our data as an array from read_in()
    lines = read_in()
    result = Train.trainModel(lines)
    print json.dumps(result)

#start process
if __name__ == '__main__':
    main()
