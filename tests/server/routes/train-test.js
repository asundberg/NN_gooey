var expect = require('chai').expect;
var should = require('chai').should;
var Sequelize = require('sequelize');
var db = require('../../../server/db');
var supertest = require('supertest');

describe('User Routes', function () {

    var app, User, agent;

    beforeEach('Sync DB', function () {
        return db.sync({force: true});
    });

    beforeEach('Create app', function () {
        app = require('../../../server/app');
        User = db.model('user');
        agent = supertest.agent(app);
    });


    //CHANGE EVERYTHING ON THIS TO TRAIN ROUTES
    describe('CRUD users', function () {

        beforeEach(function(done) {
            User.create({name: "Iris Dan", email: "iris@gmail.com", password: "forest"})
            .then(function(user){
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
            })
        })

        xit('GETs a user by ID', function (done) {
            agent
            .get('/user/1')
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                // console.log(res.body.name);
                expect(res.body.name).to.equal('Iris Dan')
                done();
            });
        });
    });
})