const mongoose = require('mongoose');

const ProjectAssetSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: [true, 'Please associate this asset with a project']
  },
  title: {
    type: String,
    trim: true,
    default: ''
  },
  type: {
    type: String,
    enum: ['image', 'video'],
    required: [true, 'Please specify the asset type (image or video)']
  },
  url: {
    type: String,
    required: [true, 'Asset URL is required']
  },
  key: {
    type: String,
    required: [true, 'Asset storage key is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ProjectAsset', ProjectAssetSchema);
