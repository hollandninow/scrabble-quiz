const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const cors = require('cors');

const viewsRouter = require('./routers/viewsRouter');
const wordRouter = require('./routers/wordRouter');
const quizRouter = require('./routers/quizRouter');
const userRouter = require('./routers/userRouter');

// Start express app
const app = express();

app.enable('trust proxy'); // For heroku

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// GLOBAL MIDDLEWARES
app.use(cors());
app.options('*', cors());

app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP. Please try again in an hour.',
});
app.use('/api', limiter);

// Body parser and cookie parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Parameter pollution
app.use(
  hpp({
    whiteList: ['valid', 'wordLength', 'page', 'totalFlash', 'sort', 'word'],
  })
);

app.use(compression());

// Timestamps on requests
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/', viewsRouter);
app.use('/api/v1/words', wordRouter);
app.use('/api/v1/quizzes', quizRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
