const express = require('express');
const { 
  getProjects, 
  getProjectBySlug, 
  createProject, 
  updateProject, 
  deleteProject,
  generateProjectPrivacyDraft 
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public Routes
router.get('/', getProjects);
router.post('/generate-privacy-draft', protect, generateProjectPrivacyDraft);
router.get('/:slug', getProjectBySlug);

router.post('/', protect, createProject);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);

module.exports = router;
