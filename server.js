const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

let DB = '';
if (process.env.NODE_ENV === 'testing') {
  DB = process.env.DATABASE_TEST.replace(
    '<PASSWORD>',
    process.env.DATABASE_TEST_PASSWORD
  );
} else if (
  process.env.NODE_ENV === 'development' ||
  process.env.NODE_ENV === 'production'
) {
  DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
  );
}

mongoose.set('strictQuery', false);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!'));

const app = require('./app');

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});

// Heroku
// process.on(
//   ('SIGTERM',
//   () => {
//     console.log('👋 SIGTERM RECEIVED. Shutting down gracefully.');
//     server.close(() => {
//       console.log('💥 Process Terminated!');
//     });
//   })
// );
