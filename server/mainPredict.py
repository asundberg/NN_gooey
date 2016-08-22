import sys, json, numpy as np
import data
import test as Test

#Read data from stdin
def read_in():
    lines = sys.stdin.readlines()
    #Since our input would only be having one line, parse our JSON data from that
    return json.loads(lines[0])


def main():
    #get our data as an array from read_in()
    lines = read_in()
    # result = Test.test(lines)
    result = Test.testModel(lines)

    # print json.dumps(result)
    print json.dumps(result)

#start process
if __name__ == '__main__':
    main()
