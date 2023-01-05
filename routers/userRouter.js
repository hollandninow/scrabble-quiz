const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const quizRouter = require('./quizRouter');

const router = express.Router();

router.use('/:userId/quizzes', quizRouter);

router.post('/login', authController.login);
router.post('/logout', authController.logout);

router.post('/signup', authController.signup);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect);

router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

router.patch('/updateMyPassword', authController.updatePassword);

router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
