/* eslint-disable mocha/no-mocha-arrows */

const supertest = require('supertest');
const { expect } = require('chai');

const url = `http://127.0.0.1:${process.env.PORT}/`;
const request = supertest(url);

const adminTestUser = {
  email: process.env.ADMIN_TEST,
  password: process.env.ADMIN_TEST_PASSWORD,
};

let testQuizId;
let testUserId;
let token;

const testQuiz = {
  quizLength: 50,
  quizType: '2-letter',
  correctAnswers: 26,
  // add user id once we create a user
};

const updatedTestQuiz = {
  quizLength: 75,
  quizType: '3-letter',
  correctAnswers: 55,
};

const testUser = {
  name: 'Test',
  email: 'test@gmail.com',
  password: 'test1234',
  passwordConfirm: 'test1234',
};

const createTestUser = () =>
  request
    .post('api/v1/users')
    .set('Authorization', `Bearer ${token}`)
    .send(testUser)
    .then((res) => {
      testUserId = res.body.data.data._id;
      testQuiz.user = testUserId;
    })
    .catch((err) => console.log(err));

const deleteTestUser = () =>
  request
    .delete(`api/v1/users/${testUserId}`)
    .set('Authorization', `Bearer ${token}`);

const login = () =>
  request
    .post('api/v1/users/login')
    .send(adminTestUser)
    .then((res) => {
      // eslint-disable-next-line prefer-destructuring
      token = res.body.token;
    });

describe('quizzes', () => {
  before(() => login());
  after(() => deleteTestUser());

  describe('POST quizzes', () => {
    before(() => createTestUser());

    it('should create a new quiz', (done) => {
      request
        .post('api/v1/quizzes')
        .set('Authorization', `Bearer ${token}`)
        .send(testQuiz)
        .expect(201)
        .then((res) => {
          const { data } = res.body.data;
          testQuizId = data._id;

          expect(data.quizLength).to.be.equal(testQuiz.quizLength);
          expect(data.quizType).to.be.equal(testQuiz.quizType);
          expect(data.correctAnswers).to.be.equal(testQuiz.correctAnswers);
          expect(data.user).to.be.equal(testUserId);
          expect(data.score).to.be.equal(
            testQuiz.correctAnswers / testQuiz.quizLength
          );

          done();
        })
        .catch((err) => done(err));
    });
  });

  describe('GET quiz(zes)', () => {
    it('should get all quizzes', (done) => {
      request
        .get('api/v1/quizzes')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then((res) => {
          expect(res.body.results).to.be.equal(1); // test quiz

          done();
        })
        .catch((err) => done(err));
    });

    it('should get the test quiz by id', (done) => {
      request
        .get(`api/v1/quizzes/${testQuizId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then((res) => {
          const { data } = res.body.data;

          expect(data.quizLength).to.be.equal(testQuiz.quizLength);
          expect(data.quizType).to.be.equal(testQuiz.quizType);
          expect(data.correctAnswers).to.be.equal(testQuiz.correctAnswers);
          expect(data.user).to.be.equal(testUserId);
          expect(data.score).to.be.equal(
            testQuiz.correctAnswers / testQuiz.quizLength
          );
          expect(data.id).to.be.equal(testQuizId);

          done();
        })
        .catch((err) => done(err));
    });
  });

  describe('PATCH quiz', () => {
    it('should update the test quiz with new data', (done) => {
      request
        .patch(`api/v1/quizzes/${testQuizId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedTestQuiz)
        .expect(200)
        .then((res) => {
          const { data } = res.body.data;

          expect(data.quizLength).to.be.equal(updatedTestQuiz.quizLength);
          expect(data.quizType).to.be.equal(updatedTestQuiz.quizType);
          expect(data.correctAnswers).to.be.equal(
            updatedTestQuiz.correctAnswers
          );
          expect(data.score).to.be.equal(
            updatedTestQuiz.correctAnswers / updatedTestQuiz.quizLength
          );
          expect(data._id).to.be.equal(testQuizId);

          done();
        })
        .catch((err) => done(err));
    });
  });

  describe('DELETE quiz', () => {
    it('should delete the test quiz', (done) => {
      request
        .delete(`api/v1/quizzes/${testQuizId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
        .then((res) => {
          expect(res.body.data).to.be.undefined;
          done();
        });
    });
  });
});