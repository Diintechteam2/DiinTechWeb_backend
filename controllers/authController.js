const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// @desc    Authenticate admin & get token
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide an email and password' });
  }

  // Check for user
  const admin = await Admin.findOne({ email }).select('+password');

  if (!admin) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  // Check if password matches
  const isMatch = await admin.matchPassword(password);

  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  // Create token
  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });

  res.status(200).json({
    success: true,
    token
  });
};
