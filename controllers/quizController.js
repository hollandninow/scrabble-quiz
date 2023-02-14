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

const buildQuiz = async (quizType, quizLength, quizToken) => {
  if (quizLength < 1) throw new AppError('Quiz length must be greater than 1.');
  if (!Quiz.quizTypes.includes(quizType))
    throw new AppError('Invalid quiz type.');

  const wordList = await Word.aggregate([
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

  return {
    wordList,
    token: quizToken,
    quizType,
    quizLength,
  };
};

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

  const quizObj = await buildQuiz(quizType, quizLength, req.token);

  res.status(200).json({
    status: 'success',
    results: quizObj.length,
    data: {
      quizObj,
    },
  });
});

// Assumes that the quiz submitted by the user is just a modified quizObj (from getGenereatedQuiz) where each obj in the array has an additional property "answer"=boolean. array e.g.:
// [{
//     "word": "rut",
//     "valid": true,
//     "answer": true,
// },
// {
//     "word": "del",
//     "valid": true
//     "answer": false,
// },
//]
exports.markQuiz = catchAsync(async (req, res, next) => {
  const { wordList, quizType, quizLength, authenticated } = req.body;

  const quizResult = wordList.map(({ word, valid, answer }) => ({
    word,
    correct: valid === answer,
  }));

  const correctWordArray = [];
  const incorrectWordArray = [];

  quizResult.forEach(({ word, correct }) =>
    correct ? correctWordArray.push(word) : incorrectWordArray.push(word)
  );

  if (authenticated) {
    await Word.updateMany(
      {
        word: {
          $in: correctWordArray,
        },
      },
      {
        $inc: { correctFlash: 1, totalFlash: 1 },
      }
    );

    await Word.updateMany(
      {
        word: {
          $in: incorrectWordArray,
        },
      },
      {
        $inc: { totalFlash: 1 },
      }
    );
  }

  req.body = {
    quizLength,
    quizType,
    correctAnswers: correctWordArray.length,
    user: req.user._id,
  };

  next();
});

exports.getMyQuizStats = catchAsync(async (req, res, next) => {
  // What to show:
  // # of quizzes taken by quiz type and total
  // avg score of quizzes by quiz type and total
  // total # of words guessed, total # of words guessed correctly - by quiz type and total

  const stats = await Quiz.aggregate([
    {
      $facet: {
        statsByQuiz: [
          {
            $match: { user: req.user._id },
          },
          {
            $group: {
              _id: '$quizType',
              totalQuizzes: { $count: {} },
              correctAnswers: { $sum: '$correctAnswers' },
              wordsQuizzed: { $sum: '$quizLength' },
              avgQuizLength: { $avg: '$quizLength' },
            },
          },
          {
            $project: {
              _id: 1,
              totalQuizzes: 1,
              correctAnswers: 1,
              wordsQuizzed: 1,
              avgQuizLength: 1,
              avgScore: { $divide: ['$correctAnswers', '$wordsQuizzed'] },
            },
          },
        ],
        statsTotal: [
          {
            $match: { user: req.user._id },
          },
          {
            $group: {
              _id: null,
              totalQuizzes: { $count: {} },
              correctAnswers: { $sum: '$correctAnswers' },
              wordsQuizzed: { $sum: '$quizLength' },
              avgQuizLength: { $avg: '$quizLength' },
            },
          },
          {
            $project: {
              _id: 1,
              totalQuizzes: 1,
              correctAnswers: 1,
              wordsQuizzed: 1,
              avgQuizLength: 1,
              avgScore: { $divide: ['$correctAnswers', '$wordsQuizzed'] },
            },
          },
        ],
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});
