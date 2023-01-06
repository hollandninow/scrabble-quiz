const express = require('express');
const quizController = require('../controllers/quizController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(authController.restrictTo('admin'), quizController.getAllQuizzes)
  .post(authController.restrictTo('admin'), quizController.createQuiz);

router.get('/myQuizStats', quizController.getMyQuizStats);

router
  .route('/:id')
  .get(authController.restrictTo('admin'), quizController.getQuiz)
  .patch(authController.restrictTo('admin'), quizController.updateQuiz)
  .delete(authController.restrictTo('admin'), quizController.deleteQuiz);

router.get(
  '/generateQuiz/:quizType/:quizLength',
  quizController.getGeneratedQuiz
);

module.exports = router;
