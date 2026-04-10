const Hero = require('../models/Hero');

// @desc    Get Hero Section data
// @route   GET /api/v1/hero
// @access  Public
exports.getHero = async (req, res, next) => {
  try {
    const hero = await Hero.findOne();
    
    if (!hero) {
      return res.status(404).json({
        success: false,
        message: 'Hero content not found'
      });
    }

    res.status(200).json({
      success: true,
      data: hero
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Update Hero Section data
// @route   PUT /api/v1/hero/:id
// @access  Private/Admin
exports.updateHero = async (req, res, next) => {
  try {
    let hero = await Hero.findById(req.params.id);

    if (!hero) {
      return res.status(404).json({
        success: false,
        message: 'Hero content not found'
      });
    }

    hero = await Hero.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Hero section updated successfully',
      data: hero
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};
