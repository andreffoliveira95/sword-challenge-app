const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();

router.route('/signup').post(authController.registerUser);
router.route('/signin').post(authController.authenticateUser);

module.exports = router;
