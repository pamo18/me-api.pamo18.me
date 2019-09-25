/* global it describe */

process.env.NODE_ENV = 'test';

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');
const jwt = require('jsonwebtoken');

chai.should();

chai.use(chaiHttp);

describe('Create report', () => {
    describe('POST /reports', () => {
        it('should get 201 HAPPY PATH with valid token', (done) => {
            let report = {
                title: "test1",
                content: "text"
            };
            const payload = { email: "test@mail.com" };
            const secret = process.env.JWT_SECRET;
            const token = jwt.sign(payload, secret, { expiresIn: '1h'});

            chai.request(server)
                .post("/reports")
                .set('x-access-token', token)
                .send(report)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an("object");

                    done();
                });
        });
    });

    describe('POST /reports', () => {
        it('should get 500 no content', (done) => {
            let report = {
                title: "test2",
                content: null
            };
            const payload = { email: "test@mail.com" };
            const secret = process.env.JWT_SECRET;
            const token = jwt.sign(payload, secret, { expiresIn: '1h'});

            chai.request(server)
                .post("/reports")
                .set('x-access-token', token)
                .send(report)
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.an("object");

                    done();
                });
        });
    });

    describe('POST /reports', () => {
        it('should get 500 invalid token', (done) => {
            let report = {
                title: "test3",
                content: "text"
            };

            chai.request(server)
                .post("/reports")
                .set('x-access-token', "fail")
                .send(report)
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.an("object");

                    done();
                });
        });
    });
});
