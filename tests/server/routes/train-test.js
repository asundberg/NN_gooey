var expect = require('chai').expect;
var should = require('chai').should;
var Sequelize = require('sequelize');
var db = require('../../../server/db');
var supertest = require('supertest');
var Promise = require('bluebird');

describe('User Routes', function () {

    var app, User, Training, agent;

    beforeEach('Sync DB', function () {
        return db.sync({force: true});
    });

    beforeEach('Create app', function () {
        app = require('../../../server/app');
        User = db.model('user');
        Training = db.model('training');
        agent = supertest.agent(app);
    });


    //NOT FINISHED
    describe('CRUD Training', function () {

        beforeEach(function(done) {
            var training = {name:'Iris Dataset', config: "/modelStuff/Irisconfig.json", weights: "/modelStuff/irisWeights.json", lib: "/modelStuff/irisLib.json"};
            var user = {name: "Irisy", email: "iris@gmail.com", password: "forest"};

            Promise.all([Training.create(training), User.create(user)])
            .spread(function(createdTraining, createdUser){
                // createdTraining.userId = createdUser.id;
                agent
                .post('/login')
                .send({
                    email: 'iris@gmail.com',
                    password: 'forest'
                })
                .expect(200)
                .end(function(err, res) {
                   if(err) return done(err);
                   // console.log("this is the user", res.body);
                   done();
                });
                return createdUser.addTraining(createdTraining)
            })
           
        })

        it('PUT Training', function (done) {
            agent
            .put('/train/1')
            .send({name: 'Updated Iris Dataset'})
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                console.log(res.body);
                expect(res.body.name).to.equal('Updated Iris Dataset')
                console.log(res.body[0])
                done();
            });
        });

        it('GETs all Trainings given a user ID', function (done) {
            agent
            .get('/train/all/1')
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body[0].name).to.equal('Iris Dataset')
                console.log(res.body[0])
                done();
            });
        });
    });
})