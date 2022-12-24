const express = require('express');
const wordController = require('../controllers/wordController');

const router = express.Router();

router
  .route('/')
  .get(wordController.getAllWords)
  .post(wordController.createWord);

router
  .route('/:id')
  .get(wordController.getWord)
  .patch(wordController.updateWord)
  .delete(wordController.deleteWord);

module.exports = router;
