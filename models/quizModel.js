const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema(
  {
    quizLength: {
      type: Number,
      required: [true, 'Quiz must have a length'],
    },
    quizType: {
      type: String,
      values: [
        '2-letter',
        '3-letter',
        'no-vowels',
        'Q-without-U',
        'Q-words',
        'J-words',
        'X-words',
        'Z-words',
        'vowel-heavy',
        'multiple-I-and-U',
        'greek-alphabet',
        'hebrew-alphabet',
        'legal-proper-names',
        'legal-place-names',
      ],
      required: [true, 'Quiz must have a quiz type'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    correctAnswers: {
      type: Number,
      default: 0,
    },
    // user: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: 'User',
    //   required: [true, 'Quiz must belong to a user'],
    // },
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

quizSchema.virtual('score').get(function () {
  return this.correctAnswers / this.quizLength;
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
