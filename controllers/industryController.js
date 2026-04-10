const Industry = require('../models/Industry');

// @desc    Get all Industries
// @route   GET /api/v1/industries
// @access  Public
exports.getIndustries = async (req, res, next) => {
  try {
    const industries = await Industry.find().sort({ order: 1 });
    res.status(200).json({
      success: true,
      count: industries.length,
      data: industries
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Create Industry
// @route   POST /api/v1/industries
// @access  Private/Admin
exports.createIndustry = async (req, res, next) => {
  try {
    const industry = await Industry.create(req.body);
    res.status(201).json({ success: true, data: industry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update Industry
// @route   PUT /api/v1/industries/:id
// @access  Private/Admin
exports.updateIndustry = async (req, res, next) => {
  try {
    const industry = await Industry.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({ success: true, data: industry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete Industry
// @route   DELETE /api/v1/industries/:id
// @access  Private/Admin
exports.deleteIndustry = async (req, res, next) => {
  try {
    await Industry.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
