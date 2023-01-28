/* eslint-disable mocha/no-mocha-arrows */

const supertest = require('supertest');
const { expect } = require('chai');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const url = `http://127.0.0.1:${process.env.PORT}/`;

const request = supertest(url);

// before(() => {});

let testUserId;

describe('users', () => {
  describe('POST users', () => {
    it('should sign up a new user', (done) => {
      request
        .post('api/v1/users')
        .send({
          name: 'Test McExam',
          email: 'test@gmail.com',
          password: 'test1234',
          passwordConfirm: 'test1234',
        })
        .expect(201)
        .then((res) => {
          const { data } = res.body.data;
          testUserId = data.id;

          expect(data.name).to.be.equal('Test McExam');
          expect(data.email).to.be.equal('test@gmail.com');
          expect(data.password).to.be.equal(undefined);
          expect(data.passwordConfirm).to.be.equal(undefined);

          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });
});
