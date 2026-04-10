const Solution = require('../models/Solution');

// @desc    Get all Solutions
// @route   GET /api/v1/solutions
// @access  Public
exports.getSolutions = async (req, res, next) => {
  try {
    const solutions = await Solution.find().sort({ order: 1 });
    res.status(200).json({
      success: true,
      count: solutions.length,
      data: solutions
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Update/Add Solution
// @route   POST /api/v1/solutions
// @access  Private/Admin
exports.createSolution = async (req, res, next) => {
  try {
    const solution = await Solution.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Solution added successfully',
      data: solution
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Update Solution
// @route   PUT /api/v1/solutions/:id
// @access  Private/Admin
exports.updateSolution = async (req, res, next) => {
  try {
    const solution = await Solution.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({
      success: true,
      message: 'Solution updated successfully',
      data: solution
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Delete Solution
// @route   DELETE /api/v1/solutions/:id
// @access  Private/Admin
exports.deleteSolution = async (req, res, next) => {
  try {
    await Solution.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Solution deleted successfully',
      data: {}
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};
