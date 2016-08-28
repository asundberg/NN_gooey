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

        it('GETs a user by ID', function (done) {
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

        it('SIGNUP User', function (done) {
            agent
            .post('/user/signup')
            .send({name: "obama", email: "obama@gmail.com", password: "forest"})
            .expect(201)
            .end(function (err, res) {
                if (err) return done(err);
                // console.log(res.body.name);
                expect(res.body.name).to.equal('obama')
                expect(res.body.email).to.equal('obama@gmail.com')
                done();
            });
        });

    })
})
