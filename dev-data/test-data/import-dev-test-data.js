const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const Word = require('../../models/wordModel');

const DB = process.env.DATABASE_TEST.replace(
  '<PASSWORD>',
  process.env.DATABASE_TEST_PASSWORD
);

mongoose.set('strictQuery', false);

mongoose
  .connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Test DB connection successful!'));

const validTwoLetterWords = JSON.parse(
  fs.readFileSync(`${__dirname}/test-2-letter-words--valid.json`, 'utf-8')
);

const validThreeLetterWords = JSON.parse(
  fs.readFileSync(`${__dirname}/test-3-letter-words--valid.json`, 'utf-8')
);

validTwoLetterWords.forEach((word) => {
  word.valid = true;
  word.tags = ['2-letter'];
});

validThreeLetterWords.forEach((word) => {
  word.valid = true;
  word.tags = ['3-letter'];
});

const validWords = [...validTwoLetterWords, ...validThreeLetterWords];

const importData = async () => {
  try {
    await Word.create(validWords);
    // await Word.create(validTwoLetterWords);
    // await Word.create(validThreeLetterWords);

    console.log('Test data successfully imported!');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await Word.deleteMany();

    console.log('Data successfully deleted!');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
