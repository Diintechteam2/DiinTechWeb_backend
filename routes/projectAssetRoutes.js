const express = require('express');
const {
  getAssets,
  getPresignedUrl,
  createAsset,
  deleteAsset,
  downloadAsset,
  getPresignedUrlsBulk,
  createAssetsBulk,
  updateAsset
} = require('../controllers/projectAssetController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public route to browse assets and download
router.get('/', getAssets);
router.get('/download', downloadAsset);

// Admin-protected routes
router.post('/presigned-url', protect, getPresignedUrl);
router.post('/presigned-urls-bulk', protect, getPresignedUrlsBulk);
router.post('/', protect, createAsset);
router.post('/bulk', protect, createAssetsBulk);
router.put('/:id', protect, updateAsset);
router.delete('/:id', protect, deleteAsset);

module.exports = router;
