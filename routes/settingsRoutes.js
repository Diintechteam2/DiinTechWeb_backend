const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getSettings,
  updateSettings
} = require('../controllers/settingsController');

router.route('/').get(getSettings).put(protect, updateSettings);

module.exports = router;
