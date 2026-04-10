const express = require('express');
const { getSiteContent, updateSiteContent } = require('../controllers/siteContentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(getSiteContent).put(protect, updateSiteContent);

module.exports = router;
