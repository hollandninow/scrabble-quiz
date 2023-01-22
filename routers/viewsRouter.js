const express = require('express');
const viewsController = require('../controllers/viewsController');
// const authController = require('../controllers/authController');

const router = express.Router();

router.get('/app', viewsController.getAppView);

module.exports = router;
