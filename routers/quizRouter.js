const express = require('express');
const quizController = require('../controllers/quizController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(authController.restrictTo('admin'), quizController.getAllQuizzes)
  .post(authController.restrictTo('admin'), quizController.createQuiz);

router
  .route('/:id')
  .get(authController.restrictTo('admin'), quizController.getQuiz)
  .patch(authController.restrictTo('admin'), quizController.updateQuiz)
  .delete(authController.restrictTo('admin'), quizController.deleteQuiz);

router
  .route('/generateQuiz/:quizType/:quizLength')
  .get(quizController.getGeneratedQuiz);

module.exports = router;
