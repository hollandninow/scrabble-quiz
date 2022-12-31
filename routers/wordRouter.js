const express = require('express');
const wordController = require('../controllers/wordController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(authController.restrictTo('user', 'admin'), wordController.getAllWords)
  .post(authController.restrictTo('admin'), wordController.createWord);

router
  .route('/:id')
  .get(authController.restrictTo('user', 'admin'), wordController.getWord)
  .patch(authController.restrictTo('admin'), wordController.updateWord)
  .delete(authController.restrictTo('admin'), wordController.deleteWord);

module.exports = router;
