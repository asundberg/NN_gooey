// To use:
// -- Initialize --
// var processor = Processor(data);

// -- Remove any unwanted columns from input --
// processor.inputLayer = processor.removeColumn(processor.inputLayer, colName);

// -- Process to usable input and output matrices --
// var inputOutput = processor.setOutputLayer([colName1, colName2,...]).process();
// var input = inputOutput.input;
// var output = inputOutput.output;

// Constructor function
function Processor(data) {
    this.data;
    this.masterArr;
    this.headers;
    this.inputLayer;
    this.outputLayer;
    this.trainingData;
    this.testData;
    if(data) {
        this.init(data);
    }
}

// Parses CSV data into Array
Processor.prototype.parseCSV = function(content, delimiter) {
    // If there isn't a delimiter, set one to comma
    if(!delimiter) var delimiter = ',';
    // Split data based on newline and delimiter and push onto array
    var rows = content.toString().trim().split('\n');
    var array = []
    rows.forEach(function(row) {
        // Remove quotes
        var cleanedRow = row.replace(/\"/g, "");
        array.push(cleanedRow.toString().split(delimiter));
    })
    return array;
}

// Initializes values based on data
Processor.prototype.init = function(data) {
    this.data = data
    // Create master array
    this.masterArr = this.parseCSV(data, ";");
    // Save headers separately
    this.headers = this.masterArr[0];
    // Initializes inputLayer as masterArr
    this.inputLayer = this.masterArr.slice(0);
    // Initializes empty outputLayer
    this.outputLayer = [];
};

// Checks if matrix has a column
Processor.prototype.hasColumn = function(array, columnName) {
    if(!array[0]) return false;
    else return array[0].indexOf(columnName) >= 0;
}

Processor.prototype.addColumn = function(array, columnName) {
    // Check if layer already has column
    if(this.hasColumn(array, columnName)) throw "Column already exists in array";
    else {
        // addColumn to array
        var columnIndex = this.columnIndex(this.masterArr, columnName)
        this.masterArr.forEach(function(row, i) {
            if(!array[i]) array[i] = [];
            array[i].push(row[columnIndex]);
        })
        return array;
    }
}

Processor.prototype.removeColumn = function(array, columnName) {
    // Remove column from array
    if(!this.hasColumn(array, columnName)) throw "Column does not exist in array";
    else {
        var columnIndex = this.columnIndex(array, columnName);
        array = array.map(function(row) {
            return row.slice(0, columnIndex).concat(row.slice(columnIndex + 1));
        });
        // If the rows are empty return empty array
        if(array[0].length == 0) return [];
        else return array;
    }
}

// Returns column index for matrix. Matrix must have headers.
Processor.prototype.columnIndex = function(array, columnName) {
    if(!array[0]) return -1;
    else {
        return array[0].indexOf(columnName);
    }
}

// Normalize datavalues
Processor.prototype.normalize = function(array) {
    // Find mins and max for each column
    var minMax = [], min, max;
    for(var i = 0; i < array[0].length; i++) {
        min = array[0][i];
        max = array[0][i]
        for(var j = 0; j < array.length; j++) {
            num = array[j][i];
            if(isNaN(num)) throw "Matrix must have numerical values only";
            if(num < min) min = num;
            if(num > max) max = num;
        }
        minMax.push({
            min: min,
            max: max
        })
    }
    // Normalize
    for(var i = 0; i < array[0].length; i++) {
        min = minMax[i].min;
        max = minMax[i].max;
        for(var j = 0; j < array.length; j++) {
            num = array[j][i];
            array[j][i] = (num - min) / (max - min);
        }
    }
    return array;
}

// HEADERS must be REMOVED before calling numberize
// Turn categories into numbers
Processor.prototype.numberize = function(array) {
    if(!array[0]) throw "Array is empty";
    var uniques = {}, entry;
    var count = 1;
    var numberizedArr = [];
    var numberizedRow;
    for(var i = 0; i < array[0].length; i++) {
        // If the column does not have numbers, replace with numbers
        if(isNaN(array[0][i])) {
            for(var j = 0; j < array.length; j++) {
                ele = array[j][i];
                if(!uniques[ele]) uniques[ele] = count++;
                array[j][i] = uniques[ele];
            }
            count = 1;
        }
    }
    return array;
}

// Takes in array of column names, removes any from input, adds all to output
Processor.prototype.setOutputLayer = function(columnNames) {
    columnNames.forEach(function(column) {
        // Remove columns from input layer
        if(this.hasColumn(this.inputLayer, column)) {
            this.inputLayer = this.removeColumn(this.inputLayer, column);
        }
        // Add columns to output layer
        if(!this.hasColumn(this.outputLayer, column)) this.addColumn(this.outputLayer, column);
    }, this);
    return this;
}

// Returns array with input and output matrices => [input, output];
// return input and output arrays normalized, numberized, without headers
Processor.prototype.process = function() {
    // remove headers
    var input = this.inputLayer.slice(1);
    var output = this.outputLayer.slice(1);
    // numberize
    input = this.numberize(input);
    output = this.numberize(output);
    // normalize
    input = this.normalize(input);
    output = this.normalize(output);

    return {
        input: input,
        output: output
    };
}

module.exports = Processor;
