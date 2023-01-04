const express = require('express');
const quizController = require('../controllers/quizController');

const router = express.Router();

router
  .route('/')
  .get(quizController.getAllQuizzes)
  .post(quizController.createQuiz);

router
  .route('/:id')
  .get(quizController.getQuiz)
  .patch(quizController.updateQuiz)
  .delete(quizController.deleteQuiz);

router
  .route('/generateQuiz/:quizType/:quizLength')
  .get(quizController.getGeneratedQuiz);

module.exports = router;
