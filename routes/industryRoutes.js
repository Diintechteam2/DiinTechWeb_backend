const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getIndustries,
  createIndustry,
  updateIndustry,
  deleteIndustry
} = require('../controllers/industryController');

router.route('/').get(getIndustries).post(protect, createIndustry);
router.route('/:id').put(protect, updateIndustry).delete(protect, deleteIndustry);

module.exports = router;
