const supertest = require('supertest');
const { expect } = require('chai');
const dotenv = require('dotenv');

dotenv.config({ path: '../config.env' });

const url = `http://127.0.0.1:${process.env.PORT}/`;

const request = supertest(url);
