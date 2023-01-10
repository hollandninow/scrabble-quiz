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

// exports.authenticateQuiz = catchAsync(async (req, res, next) => {});
