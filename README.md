# BrainLab

BrainLab is a graphical user interface that lets users upload datasets to train a neural network with. Users can choose to create an account, save their trained models, and test new inputs against a model to predict outputs. They can also test inputs on the spot without saving the model.

A neural network is trained based on layers of inputs, outputs, as well as hidden layers, each containing a specific number of neurons which can be adjusted according to the complexity of the dataset, for increased accuracy. BrainLab gives its users a general overview of what their network looks like, without getting into too much detail, or requiring any prior knowledge from users about NNs.

Once the network is finished training, the user will see a graph that shows how the accuracy of the network progressed throughout the training. There is also data visualization for how the network classified the dataset, and whether a given sample was accurately classified (predicted vs actual). All visuals were created with d3.

Technologies: Python, Keras (a Python library), SQL, Node.js, Angular.js, Angular Material, and d3.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisities

Please install anaconda (Python 2.7 version) [here](https://docs.continuum.io/anaconda/install). Once you do, upgrade numpy and scipy. Type the command below in your terminal.

```
pip install numpy --upgrade
pip install scipy --upgrade
```
The next steps will be to install Theano and Keras. Keras is a python library that we use to build, train, and test the neural network model. We used Theano as our backend for keras. 

```
pip install theano
pip install keras
```
Check that you are up-to-date with the master branch of Keras. You can update with:

```
pip install git+git://github.com/fchollet/keras.git --upgrade --no-deps
```
In addition, check that you are up-to-date with the master branch of Theano. You can update with:

```
pip install git+git://github.com/Theano/Theano.git --upgrade --no-deps
```

### Installing

After cloning this repo, open up terminal and make sure you're in the directory NN_gooey. Then do an npm install:

```
npm install
```

Then, create a database. If you're using PostgresSQL type into your terminal:

```
createdb nn_gooey
```

Now you're ready to boot up the app. Type into terminal:
```
npm start
```
We use SCSS for styling. All scss files are in /browser/scss folder and get compiled into /public/stylesheets as .css. If you would like to make changes to styling, make sure to type into terminal:
```
npm run build-css
```
so that SCSS can watch any changes and then compile them.


## Running the tests

Type "npm test" in your terminal to run tests.

### Tests

We used mocha and chai to test our routes.

```
Give an example
```

## Deployment

We used heroku to deploy this app.

## Built With

* Keras
* Node.js
* Express.js
* AngularJS
* Angular Material
* D3.js
* Sequelize

## Contributing

This is an open source project. Feel free to add features and create a pull request!

## Authors

See the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## Acknowledgments

* Thank you Jason Brownlee for your keras tutorials. Check him out [here](http://machinelearningmastery.com/)
* Inspiration from TensorFlow's Neural Network Playgorund. Check it out [here](http://playground.tensorflow.org/#activation=tanh&batchSize=10&dataset=circle&regDataset=reg-plane&learningRate=0.03&regularizationRate=0&noise=0&networkShape=4,2&seed=0.42008&showTestData=false&discretize=false&percTrainData=50&x=true&y=true&xTimesY=false&xSquared=false&ySquared=false&cosX=false&sinX=false&cosY=false&sinY=false&collectStats=false&problem=classification&initZero=false)
*
