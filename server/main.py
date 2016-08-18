import sys, json, numpy as np
import train as Train
import data
#Read data from stdin
def read_in():
    lines = sys.stdin.readlines()
    #Since our input would only be having one line, parse our JSON data from that
    return json.loads(lines[0])

def main():
    #get our data as an array from read_in()
    lines = read_in()
 
    result = Train.trainModel(lines)
    print result

#start process
if __name__ == '__main__':
    main()