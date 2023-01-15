// const Word = require('../models/wordModel');
// const User = require('../models/userModel');
// const Quiz = require('../models/quizModel');
const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');

exports.getHomePage = catchAsync(async (req, res, next) => {
  res.status(200).render('base', {
    title: 'Home',
  });
});
