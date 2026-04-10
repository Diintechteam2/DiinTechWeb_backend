const express = require('express');
const { getHero, updateHero } = require('../controllers/heroController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public Routes
router.get('/', getHero);

router.put('/:id', protect, updateHero);

module.exports = router;
