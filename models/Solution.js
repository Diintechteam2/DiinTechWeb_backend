const mongoose = require('mongoose');

const SolutionSchema = new mongoose.Schema({
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
    required: [true, 'Please add an icon name (from Lucide)']
  },
  features: [String],
  color: {
    type: String,
    default: 'from-cyan-500/20 to-blue-500/20'
  },
  borderColor: {
    type: String,
    default: 'border-cyan-500/30'
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

module.exports = mongoose.model('Solution', SolutionSchema);
