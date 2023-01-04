const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema(
  {
    word: {
      type: String,
      required: [true, 'Word must have a word'],
      unique: true,
      trim: true,
      minlength: [2, 'Word must be greater than 2 characters'],
    },
    valid: {
      type: Boolean,
      required: [true, 'Word must be valid (true) or invalid (false).'],
    },
    // Total flash is the # of times the word has been put in front of a user, across all users
    totalFlash: {
      type: Number,
      default: 0,
    },
    // Correct flash is the # of times the word was correctly identified as valid in a quiz, across all users
    correctFlash: {
      type: Number,
      default: 0,
    },
    wordLength: {
      type: Number,
    },
    // Tags for special word lists
    tags: [String],
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

wordSchema.virtual('accuracy').get(function () {
  return this.correctFlash / this.totalFlash;
});

wordSchema.pre('save', function (next) {
  this.wordLength = this.word.length;

  next();
});

const Word = mongoose.model('Word', wordSchema);

module.exports = Word;
