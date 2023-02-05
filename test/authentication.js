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

const testUser = {
  name: 'Test',
  email: 'test@gmail.com',
  password: 'test1234',
  passwordConfirm: 'test1234',
};

let testUserId;
let testUserToken;
let adminToken;

const loginAsAdmin = () =>
  request
    .post('api/v1/users/login')
    .send(adminTestUser)
    .then((res) => {
      // eslint-disable-next-line prefer-destructuring
      adminToken = res.body.token;
    });

const deleteTestUser = () =>
  request
    .delete(`api/v1/users/${testUserId}`)
    .set('Authorization', `Bearer ${adminToken}`);

describe('authentication', () => {
  before(() => loginAsAdmin());
  after(() => deleteTestUser());

  describe('sign up', () => {
    it('should sign up a user when provided valid credentials', (done) => {
      request
        .post('api/v1/users/signup')
        .send(testUser)
        .expect(201)
        .then((res) => {
          const { user } = res.body.data;

          testUserId = user._id;

          expect(user.name).to.be.equal(testUser.name);
          expect(user.email).to.be.equal(testUser.email);
          expect(user.password).to.not.equal(testUser.password);
          expect(user.passwordConfirm).to.be.undefined;
          expect(user.role).to.be.equal('user');
          expect(user.active).to.be.true;
          expect(user.photo).to.equal('default.jpg');

          done();
        })
        .catch((err) => done(err));
    });
  });

  describe('logging in and out', () => {
    it('should log in when provided credentials for an existing user', (done) => {
      request
        .post('api/v1/users/login')
        .send(testUser)
        .expect(200)
        .then((res) => {
          // eslint-disable-next-line prefer-destructuring
          testUserToken = res.body.token;

          expect(res.body.data.user.email).to.be.equal(testUser.email);

          done();
        })
        .catch((err) => done(err));
    });

    it('should log out the user', (done) => {
      request
        .post('api/v1/users/logout')
        .set('Authorization', `Bearer ${testUserToken}`)
        .expect(200)
        .then((res) => {
          done();
        })
        .catch((err) => done(err));
    });
  });

  describe('forgot password', () => {
    it('should send an email to the user email', (done) => {
      request
        .post('api/v1/users/forgotpassword')
        .expect(200)
        .send({ email: testUser.email })
        .then((res) => {
          expect(res.body.message).to.be.equal('Token sent to email.');

          done();
        })
        .catch((err) => done(err));
    });
  });
});
