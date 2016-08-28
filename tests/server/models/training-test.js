var sinon = require('sinon');
var expect = require('chai').expect;
var supertest = require('supertest');
var Sequelize = require('sequelize');
var db = require('../../../server/db/db');
var Training = require('../../../server/db/models/training');
var Selection = require('../../../server/db/models/selection');
var Training = require('../../../server/db/models/training');
var Selection = require('../../../server/db/models/selection');

describe('Training Model', function () {

    var app, SelectionDetail, agent;


    beforeEach('Sync DB', function () {
        return db.sync({force: true});
    });

    beforeEach('Create app', function () {
        // app = require('../../../server/config')(require('../../../server/app'), require('../../../server/db'));
        var Selection = require('../../../server/db/models/selection');
        var Training = require('../../../server/db/models/training');
        // agent = supertest.agent(app);
    });

    describe('CRUD Training', function () {
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

        it('Creating, getting, and updating Training object', function (done) {

        	Training.create(training)
			.then(function(created){
				expect(created.id).to.equal(1);
				expect(created.config).to.be.a('string');
				expect(created.name).to.equal('Iris Dataset');
				return Training.findById(1)
			})
			.then(function(foundTraining){
				return foundTraining.update({name: 'Iris Classification'})
			})
			.then(function(updated){
				 expect(updated.name).to.equal('Iris Classification');
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

    	xit('Add Selection to Training', function (done) {
    		var createdTraining, createdSelection;
    		Training.create(training)
    		.then(function(created){
    			createdTraining = created;
    			return Selection.create(selection)
    		})
    		.then(function(createdSelection){
    			createdSelection = createdSelection;
    			createdSelection.trainingId = createdTraining.training_id;
    			return Training.findOne({where: {id: 1}, include: [Selection]})
    		})
    		.then(function(foundTraining){
				console.log(foundTraining.selection);
				expect(foundTraining.selection.headers).to.equal('');
			})
			done();
			// Promise.all(Training.create(training), Selection.create(selection))
			// .then(function(arr){
			// 	console.log(arr);
			// 	console.log(createdTraining);
			// 	createdTraining.selectionId = createdSelection.id
			// 	return Training.findOne({where: {id: 1}, include: [Selection]})
			// })
			// .then(function(foundTraining){
			// 	console.log(foundTraining.selection);
			// 	expect(foundTraining.selection.headers).to.equal('');
			// })
			// done();
        }); 
    }); 

})