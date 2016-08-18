import sys, json, numpy as np
import train as Train
#Read data from stdin
def read_in():
    lines = sys.stdin.readlines()
    #Since our input would only be having one line, parse our JSON data from that
    return json.loads(lines[0])

def main():
    #get our data as an array from read_in()
    lines = read_in()

    #create a numpy array
    np_lines = np.array(lines)
    result = Train.trainModel()
    #return the result to the output stream
    # np_lines[0] is the colX, np_lines[1] is colY
    print result
    for row in np_lines[0]:
        print row

#start process
if __name__ == '__main__':
    main()