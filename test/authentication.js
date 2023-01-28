/* eslint-disable mocha/no-mocha-arrows */

const supertest = require('supertest');
const { expect } = require('chai');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const url = `http://127.0.0.1:${process.env.PORT}/`;

const request = supertest(url);

const adminTestUser = {
  email: process.env.ADMIN_TEST,
  password: process.env.ADMIN_TEST_PASSWORD,
};

let jwt;

describe('authentication', () => {
  describe('logging in', () => {
    it('should log in when provided credentials for an existing user', (done) => {
      request
        .post('api/v1/users/login')
        .send(adminTestUser)
        .expect(200)
        .then((res) => {
          expect(res.body.data.user.email).to.be.equal(adminTestUser.email);

          jwt = res.body.token;

          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });
});
