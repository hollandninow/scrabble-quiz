const Quiz = require('../models/quizModel');
const Word = require('../models/wordModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllQuizzes = factory.getAll(Quiz);
exports.getQuiz = factory.getOne(Quiz);
exports.createQuiz = factory.createOne(Quiz);
exports.updateQuiz = factory.updateOne(Quiz);
exports.deleteQuiz = factory.deleteOne(Quiz);

exports.getGeneratedQuiz = catchAsync(async (req, res, next) => {
  const { quizType } = req.params;
  const quizLength = +req.params.quizLength;

  const maxQuizLength = process.env.MAX_QUIZ_LENGTH || 100;

  if (quizLength > maxQuizLength)
    return next(
      new AppError(
        `Quiz length too large. Please try again with size equal to or less than ${maxQuizLength}`,
        400
      )
    );

  const generatedQuiz = await Word.aggregate([
    {
      $match: {
        tags: { $in: [quizType] },
      },
    },
    {
      $sample: {
        size: quizLength,
      },
    },
    {
      $project: {
        _id: 0,
        totalFlash: 0,
        correctFlash: 0,
        tags: 0,
        wordLength: 0,
        __v: 0,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    results: generatedQuiz.length,
    data: {
      generatedQuiz,
    },
  });
});
