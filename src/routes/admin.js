const express = require('express');
const adminController = require('../controllers/admin');
const router = express.Router();

router.route('/subscribe').get(adminController.checkNotifications);

module.exports = router;
