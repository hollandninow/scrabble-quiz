/* eslint-disable mocha/no-mocha-arrows */

const supertest = require('supertest');
const { expect } = require('chai');

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

const updatedTestUser = {
  name: 'Test McPass',
  email: 'test.mcpass@gmail.com',
  role: 'admin',
};

let testUserId;
let token;

const login = () =>
  request
    .post('api/v1/users/login')
    .send(adminTestUser)
    .then((res) => {
      // eslint-disable-next-line prefer-destructuring
      token = res.body.token;
    });

describe('users', () => {
  before(() => login());

  describe('POST user', () => {
    it('should sign up a new user', (done) => {
      request
        .post('api/v1/users')
        .set('Authorization', `Bearer ${token}`)
        .send(testUser)
        .expect(201)
        .then((res) => {
          const { data } = res.body.data;
          testUserId = data._id;

          expect(data.name).to.be.equal(testUser.name);
          expect(data.email).to.be.equal(testUser.email);
          expect(data.password).to.not.equal(testUser.password);
          expect(data.passwordConfirm).to.equal(undefined);
          expect(data.role).to.be.equal('user');
          expect(data.active).to.be.true;
          expect(data.photo).to.equal('default.jpg');

          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe('GET user(s)', () => {
    it('should get all users', (done) => {
      request
        .get('api/v1/users')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then((res) => {
          expect(res.body.results).to.be.equal(2); // admin user and test user

          done();
        })
        .catch((err) => done(err));
    });

    it('should get the test user by id', (done) => {
      request
        .get(`api/v1/users/${testUserId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then((res) => {
          const { data } = res.body.data;

          expect(data.name).to.be.equal(testUser.name);
          expect(data.email).to.be.equal(testUser.email);
          expect(data.photo).to.be.equal('default.jpg');
          expect(data.role).to.be.equal('user');
          expect(data.quizTokens).to.be.deep.equal([]);
          expect(data._id).to.be.equal(testUserId);

          done();
        })
        .catch((err) => done(err));
    });
  });

  describe('PATCH user', () => {
    it('should update the test user', (done) => {
      request
        .patch(`api/v1/users/${testUserId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedTestUser)
        .expect(200)
        .then((res) => {
          const { data } = res.body.data;

          expect(data.name).to.be.equal(updatedTestUser.name);
          expect(data.email).to.be.equal(updatedTestUser.email);
          expect(data.role).to.be.equal(updatedTestUser.role);

          done();
        })
        .catch((err) => done(err));
    });
  });

  describe('DELETE user', () => {
    it('should delete the test user', (done) => {
      request
        .delete(`api/v1/users/${testUserId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
        .then((res) => {
          expect(res.body.data).to.be.undefined;
          done();
        })
        .catch((err) => done(err));
    });
  });
});
