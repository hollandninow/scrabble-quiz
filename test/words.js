/* eslint-disable mocha/no-mocha-arrows */

const supertest = require('supertest');
const { expect } = require('chai');

const url = `http://127.0.0.1:${process.env.PORT}/`;
const request = supertest(url);

const adminTestUser = {
  email: process.env.ADMIN_TEST,
  password: process.env.ADMIN_TEST_PASSWORD,
};

const testWord = {
  word: 'test',
  valid: true,
};

const testWord2 = {
  word: 'foo',
  valid: false,
  totalFlash: 1000,
  correctFlash: 8,
};

let testWordId;
let token;

const login = () =>
  request
    .post('api/v1/users/login')
    .send(adminTestUser)
    .then((res) => {
      // eslint-disable-next-line prefer-destructuring
      token = res.body.token;
    });

describe('words', () => {
  beforeEach(() => login());

  describe('POST words', () => {
    it('should create a test word', (done) => {
      request
        .post('api/v1/words')
        .set('Authorization', `Bearer ${token}`)
        .send(testWord)
        .expect(201)
        .then((res) => {
          const { data } = res.body.data;

          expect(data.word).to.be.equal('test');
          expect(data.valid).to.be.equal(true);
          testWordId = data.id;
          done();
        })
        .catch((err) => done(err));
    });
  });

  describe('GET all words', () => {
    it('should get all words', (done) => {
      request
        .get('api/v1/words')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then((res) => {
          expect(res.body.results).to.be.equal(1);
          done();
        })
        .catch((err) => done(err));
    });
  });

  describe('GET word by id', () => {
    it('should get all words', (done) => {
      request
        .get(`api/v1/words/${testWordId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then((res) => {
          const { data } = res.body.data;

          expect(data.word).to.be.equal(testWord.word);
          expect(data.valid).to.be.equal(testWord.valid);
          expect(data.totalFlash).to.be.equal(0);
          expect(data.correctFlash).to.be.equal(0);
          expect(data.tags).to.be.empty;
          expect(data.wordLength).to.be.equal(testWord.word.length);
          expect(data.accuracy).to.be.equal(null);

          done();
        })
        .catch((err) => done(err));
    });
  });

  describe('PATCH words', () => {
    it('should update the test word', (done) => {
      request
        .patch(`api/v1/words/${testWordId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(testWord2)
        .expect(200)
        .then((res) => {
          const { data } = res.body.data;

          expect(data.word).to.not.equal(testWord.word);
          expect(data.valid).to.not.equal(testWord.valid);
          expect(data.word).to.be.equal(testWord2.word);
          expect(data.valid).to.be.equal(testWord2.valid);
          done();
        })
        .catch((err) => done(err));
    });
  });

  describe('DELETE words', () => {
    it('should delete the test word', (done) => {
      request
        .delete(`api/v1/words/${testWordId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
        .then((res) => {
          expect(res.body.data).to.be.equal(undefined);
          done();
        })
        .catch((err) => done(err));
    });
  });
});
