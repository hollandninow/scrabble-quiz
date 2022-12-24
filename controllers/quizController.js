const Quiz = require('../models/quizModel');
const factory = require('./handlerFactory');

exports.getAllQuizzes = factory.getAll(Quiz);
exports.getQuiz = factory.getOne(Quiz);
exports.createQuiz = factory.createOne(Quiz);
exports.updateQuiz = factory.updateOne(Quiz);
exports.deleteQuiz = factory.deleteOne(Quiz);
