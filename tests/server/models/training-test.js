var sinon = require('sinon');
var expect = require('chai').expect;
var supertest = require('supertest');
var Sequelize = require('sequelize');
var Promise = require('bluebird');
var db = require('../../../server/db');
// var Training = require('../../../server/db/models/training');
// var Selection = require('../../../server/db/models/selection');

var Training = db.model('training');
var Selection = db.model('selection');

describe('Training Model', function () {

    var app, agent;


    beforeEach('Sync DB', function () {
        return db.sync({force: true});
    });

    beforeEach('Create app', function () {
        app = require('../../../server/config')(require('../../../server/app'), require('../../../server/db'));
        var Selection = db.model('selection');
        var Training = db.model('training');
        agent = supertest.agent(app);
    });

    describe('CRUD Training', function () {
    	var training = 
	    	{
				name: 'Iris Dataset',
				config: '/Users/Ayako/BrainLab/modelStuff/irisConfig.json',
				weights: '/Users/Ayako/BrainLab/modelStuff/irisWeights.h5',
				lib: '/Users/Ayako/BrainLab/modelStuff/irisLib.json'
			}

        it('Creating, getting, and updating Training object', function (done) {
        	Training.create(training)
			.then(function(created){
				expect(created.id).to.equal(1);
				expect(created.config).to.be.a('string');
				expect(created.name).to.equal('Iris Dataset');
				return created.update({name: 'Updated Iris'})
			})
			.then(function(updated){
				expect(updated.name).to.equal('Updated Iris')
			})
			done();
        });      
        
    })
    describe('Add Association with Selection', function () {
    	var training = 
	    	{
				name: 'Iris Dataset',
				config: '/Users/Ayako/BrainLab/modelStuff/irisConfig.json',
				weights: '/Users/Ayako/BrainLab/modelStuff/irisWeights.h5',
				lib: '/Users/Ayako/BrainLab/modelStuff/irisLib.json'
			}

		var selection = 
			{
				headers: ['Iris Servosa', 'Iris Verginica'],
				rows: [[1,2],[3,4]],
				numColumns: 2
			}

		it('Selection create', function (done) {
			Promise.all([Training.create(training), Selection.create(selection)])
			.spread(function(createdTraining, createdSelection){
				createdSelection.trainingId = createdTraining.id;
				expect(createdSelection.trainingId).to.be.equal(1);
			})
			done()
        });     

    }); 

})