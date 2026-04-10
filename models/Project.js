const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: [true, 'Please add a slug'],
    unique: true,
    trim: true,
    lowercase: true
  },
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  lastUpdated: {
    type: String,
    default: new Date().toLocaleDateString()
  },
  websiteUrl: {
    type: String,
    default: '#'
  },
  logoUrl: {
    type: String,
    default: ''
  },
  content: {
    introduction: String,
    informationCollect: {
      personal: [String],
      userContent: [String],
      deviceUsage: [String]
    },
    howWeUse: [String],
    dataSharing: [String],
    dataSecurity: String,
    dataRetention: String,
    dataDeletion: {
      instruction: String,
      email: {
        type: String,
        lowercase: true,
        trim: true
      },
      subject: String
    },
    childrenPrivacy: String,
    thirdParty: String,
    changesToPolicy: String,
    imageProcessing: String,
    disclaimer: String,
    contactUs: {
      instruction: String,
      email: {
        type: String,
        lowercase: true,
        trim: true
      }
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Project', ProjectSchema);
