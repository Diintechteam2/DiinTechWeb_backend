const mongoose = require('mongoose');

const HeroSchema = new mongoose.Schema({
  badgeText: {
    type: String,
    required: [true, 'Please add badge text'],
    default: 'Next-Generation Agentic AI'
  },
  mainHeading: {
    type: String,
    required: [true, 'Please add a main heading'],
    default: 'We Build AI Systems That Run Businesses'
  },
  subHeading: {
    type: String,
    required: [true, 'Please add a sub heading'],
    default: 'Diin Technologies designs autonomous AI agents that think, plan, act, and learn — delivering real, measurable business outcomes for enterprise organizations.'
  },
  stats: [
    {
      value: String,
      label: String
    }
  ],
  ctaButtons: [
    {
      text: String,
      link: String,
      variant: {
        type: String,
        enum: ['primary', 'outline'],
        default: 'primary'
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Hero', HeroSchema);
