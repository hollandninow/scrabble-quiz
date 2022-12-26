const express = require('express');
const morgan = require('morgan');

const wordRouter = require('./routers/wordRouter');
const quizRouter = require('./routers/quizRouter');
const userRouter = require('./routers/userRouter');

// Start express app
const app = express();

// Middlewares
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.get('/', (req, res) => {
  res.status(200).send('Hello!');
});

app.use('/api/v1/words', wordRouter);
app.use('/api/v1/quizzes', quizRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
