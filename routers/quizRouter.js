const express = require('express');
const quizController = require('../controllers/quizController');
const authController = require('../controllers/authController');
const quizAuthController = require('../controllers/quizAuthController');

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
  quizAuthController.generateQuizToken,
  quizController.getGeneratedQuiz
);

router.post(
  '/markQuiz',
  // quizAuthController.authenticateQuiz,
  quizController.markQuiz,
  quizController.createQuiz
);

module.exports = router;
