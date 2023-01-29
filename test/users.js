/* eslint-disable mocha/no-mocha-arrows */

const supertest = require('supertest');
const { expect } = require('chai');

const url = `http://127.0.0.1:${process.env.PORT}/`;
const request = supertest(url);

const adminTestUser = {
  email: process.env.ADMIN_TEST,
  password: process.env.ADMIN_TEST_PASSWORD,
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
  describe('POST users', () => {
    beforeEach(() => login());

    it('should sign up a new user', (done) => {
      request
        .post('api/v1/users')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test',
          email: 'test@gmail.com',
          password: 'test1234',
          passwordConfirm: 'test1234',
        })
        .expect(201)
        .then((res) => {
          const { data } = res.body.data;
          testUserId = data.id;

          expect(data.name).to.be.equal('Test');
          expect(data.email).to.be.equal('test@gmail.com');
          expect(data.password).to.not.equal('test1234');
          expect(data.passwordConfirm).to.equal(undefined);
          expect(data.role).to.be.equal('user');
          expect(data.active).to.be.equal(true);
          expect(data.photo).to.be.equal('default.jpg');

          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });
});
