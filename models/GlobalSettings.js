const mongoose = require('mongoose');

const GlobalSettingsSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please add a contact email']
  },
  phone: {
    type: String,
    required: [true, 'Please add a contact phone']
  },
  address: {
    type: String,
    required: [true, 'Please add an office address']
  },
  whatsapp: {
    number: String,
    message: String
  },
  socialLinks: {
    linkedin: String,
    twitter: String,
    instagram: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('GlobalSettings', GlobalSettingsSchema);
