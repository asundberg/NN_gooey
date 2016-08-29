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

    describe('CRUD Training', function () {

        beforeEach(function(done) {
            var training = {name:'Iris Dataset', config: "/modelStuff/Irisconfig.json", weights: "/modelStuff/irisWeights.json", lib: "/modelStuff/irisLib.json"};

            var training2 = {name:'Soybean Dataset', config: "/modelStuff/Soybeanconfig.json", weights: "/modelStuff/soybeanWeights.json", lib: "/modelStuff/soybeanLib.json"};

            var user = {name: "Irisy", email: "iris@gmail.com", password: "forest"};

            Promise.all([Training.create(training), Training.create(training2), User.create(user)])
            .spread(function(createdTraining, createdTraining2, createdUser){
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
                return createdUser.addTrainings([createdTraining, createdTraining2])
            })
        })

        it('PUT Training', function (done) {
            agent
            .put('/train/1')
            .send({name: 'Updated Iris Dataset', config: '/modelStuff/config/updatedIrisConfig.json'})
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.model.name).to.equal('Updated Iris Dataset');
                expect(res.body.model.config).to.equal('/modelStuff/config/updatedIrisConfig.json');
                done();
            });
        });

        it('GETs all Trainings given a user ID', function (done) {
            agent
            .get('/train/all/1')
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body[0].name).to.equal('Iris Dataset');
                expect(res.body[1].name).to.equal('Soybean Dataset');
                done();
            });
        });
    });
})