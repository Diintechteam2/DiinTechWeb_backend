const express = require('express');
const { 
  getSolutions, 
  createSolution, 
  updateSolution, 
  deleteSolution 
} = require('../controllers/solutionController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public Routes
router.get('/', getSolutions);

router.post('/', protect, createSolution);
router.put('/:id', protect, updateSolution);
router.delete('/:id', protect, deleteSolution);

module.exports = router;
