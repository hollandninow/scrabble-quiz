const Word = require('../models/wordModel');
const factory = require('./handlerFactory');

exports.getAllWords = factory.getAll(Word);
exports.getWord = factory.getOne(Word);
exports.createWord = factory.createOne(Word);
exports.updateWord = factory.updateOne(Word);
exports.deleteWord = factory.deleteOne(Word);
