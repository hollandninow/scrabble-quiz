const Word = require('../models/wordModel');
const factory = require('./handlerFactory');

exports.getAllWords = factory.getAll(Word);
exports.getWord = factory.getOne(Word);
exports.createWord = factory.createOne(Word);
exports.updateWord = factory.updateOne(Word);
exports.deleteWord = factory.deleteOne(Word);

/* 
Special word routes:

top 10 words by word type for:
-best accuracy
-worst accuracy
*/
