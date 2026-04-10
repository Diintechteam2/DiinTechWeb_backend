const mongoose = require('mongoose');

const IndustrySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  icon: {
    type: String,
    required: [true, 'Please add an icon name (from Lucide)'],
    default: 'Rocket'
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Industry', IndustrySchema);
