const SiteContent = require('../models/SiteContent');
const defaultSiteContent = require('../data/siteContentDefaults');

const fillMissing = (currentValue, defaultValue) => {
  if (Array.isArray(defaultValue)) {
    return Array.isArray(currentValue) && currentValue.length > 0 ? currentValue : defaultValue;
  }

  if (defaultValue && typeof defaultValue === 'object') {
    const source = currentValue && typeof currentValue === 'object' ? currentValue : {};
    const result = { ...source };

    Object.keys(defaultValue).forEach((key) => {
      result[key] = fillMissing(source[key], defaultValue[key]);
    });

    return result;
  }

  return currentValue === undefined || currentValue === null || currentValue === '' ? defaultValue : currentValue;
};

// @desc    Get site content singleton
// @route   GET /api/v1/site-content
// @access  Public
exports.getSiteContent = async (req, res) => {
  try {
    let siteContent = await SiteContent.findOne();

    if (!siteContent) {
      siteContent = await SiteContent.create(defaultSiteContent);
    } else {
      const mergedContent = fillMissing(siteContent.toObject(), defaultSiteContent);
      siteContent = await SiteContent.findByIdAndUpdate(siteContent._id, mergedContent, {
        new: true,
        runValidators: true
      });
    }

    res.status(200).json({
      success: true,
      data: siteContent
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Update site content singleton
// @route   PUT /api/v1/site-content
// @access  Private/Admin
exports.updateSiteContent = async (req, res) => {
  try {
    let siteContent = await SiteContent.findOne();

    if (!siteContent) {
      siteContent = await SiteContent.create(req.body);
      return res.status(201).json({
        success: true,
        data: siteContent
      });
    }

    siteContent = await SiteContent.findByIdAndUpdate(siteContent._id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: siteContent
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
