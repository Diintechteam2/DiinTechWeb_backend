const GlobalSettings = require('../models/GlobalSettings');

// @desc    Get global settings
// @route   GET /api/v1/settings
// @access  Public
exports.getSettings = async (req, res, next) => {
  try {
    const settings = await GlobalSettings.findOne();
    if (!settings) {
      return res.status(404).json({ success: false, message: 'Settings not found' });
    }
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Update global settings
// @route   PUT /api/v1/settings
// @access  Private/Admin
exports.updateSettings = async (req, res, next) => {
  try {
    let settings = await GlobalSettings.findOne();

    if (!settings) {
      // If no settings exist yet, create one
      settings = await GlobalSettings.create(req.body);
      return res.status(201).json({ success: true, data: settings });
    }

    settings = await GlobalSettings.findByIdAndUpdate(settings._id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
