/* eslint-disable mocha/no-mocha-arrows */

const supertest = require('supertest');
const { expect } = require('chai');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

// const User = require('../models/userModel');
// const Word = require('../models/wordModel');

const url = 'http://127.0.0.1:3000';

const request = supertest(url);

// before(() => {});

let testWordId;

describe('words', () => {
  describe('POST words', () => {
    it('should create a word', (done) => {
      request
        .post('/api/v1/words')
        .send({
          word: 'test',
          valid: 'true',
        })
        .expect(201)
        .then((res) => {
          expect(res.body.data.data.word).to.be.equal('test');
          expect(res.body.data.data.valid).to.be.equal(true);
          testWordId = res.body.data.data.id;
          done();
        })
        .catch((err) => done(err));
    });
  });

  describe('GET words', () => {
    it('should get all words', (done) => {
      request
        .get('/api/v1/words')
        .expect(200)
        .then((res) => {
          expect(res.body.results).to.be.equal(1);
          done();
        })
        .catch((err) => done(err));
    });
  });

  describe('DELETE words', () => {
    it('should delete the test word', (done) => {
      request
        .delete(`/api/v1/words/${testWordId}`)
        .expect(204)
        .then((res) => {
          expect(res.body.data).to.be.equal(undefined);
          done();
        })
        .catch((err) => done(err));
    });
  });
});
