/* eslint-disable mocha/no-mocha-arrows */

const supertest = require('supertest');
const { expect } = require('chai');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const url = 'http://127.0.0.1:3000';

const request = supertest(url);

before(() => {});

describe('words', () => {
  it('gets all words', (done) => {
    request
      .get('/api/v1/words')
      .expect(200)
      .then((res) => {
        expect(res.body.results).to.be.equal(0);
        done();
      })
      .catch((err) => done(err));
  });
});
