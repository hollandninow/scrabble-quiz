const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
// const Quiz = require('../models/quizModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (id, quizType, quizLength) =>
  jwt.sign({ id, quizType, quizLength }, process.env.QUIZ_JWT_SECRET, {
    expiresIn: process.env.QUIZ_JWT_EXPIRES_IN,
  });

exports.generateQuizToken = catchAsync(async (req, res, next) => {
  const id = req.user._id;
  const { quizType } = req.params;
  const { quizLength } = req.params;

  const token = signToken(id, quizType, quizLength);
  req.token = token;

  const user = await User.findById(id);

  if (!user)
    return next(new AppError('User is not logged in or does not exist.'), 400);

  user.quizTokens.push(token);
  await user.save({ validateBeforeSave: false });

  next();
});

exports.authenticateQuiz = catchAsync(async (req, res, next) => {
  const { token } = req.body;

  const decodedToken = jwt.verify(token, process.env.QUIZ_JWT_SECRET);

  const user = await User.findById(req.user._id);

  if (!user) next(new AppError('User not found, please log in again.', 400));

  if (
    user.quizTokens.includes(token) &&
    decodedToken.quizType === req.body.quizType &&
    parseInt(decodedToken.quizLength, 10) === req.body.quizLength
  )
    req.body.authenticated = true;
  else req.body.authenticated = false;

  next();
});
