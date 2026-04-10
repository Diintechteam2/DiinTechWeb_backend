const Project = require('../models/Project');
const { generatePrivacyDraft } = require('../services/geminiPrivacyGenerator');

// @desc    Get all Projects
// @route   GET /api/v1/projects
// @access  Public
exports.getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get single Project by slug
// @route   GET /api/v1/projects/:slug
// @access  Public
exports.getProjectBySlug = async (req, res, next) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Create new Project
// @route   POST /api/v1/projects
// @access  Private/Admin
exports.createProject = async (req, res, next) => {
  try {
    const project = await Project.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Project with this slug already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Update Project
// @route   PUT /api/v1/projects/:id
// @access  Private/Admin
exports.updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Delete Project
// @route   DELETE /api/v1/projects/:id
// @access  Private/Admin
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
      data: {}
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Generate privacy policy draft for project
// @route   POST /api/v1/projects/generate-privacy-draft
// @access  Private/Admin
exports.generateProjectPrivacyDraft = async (req, res, next) => {
  try {
    const { projectName, websiteUrl, promptInputs } = req.body || {};

    if (!projectName || !String(projectName).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Project name is required for AI draft generation'
      });
    }

    const draft = await generatePrivacyDraft({
      projectName: String(projectName).trim(),
      websiteUrl: String(websiteUrl || '').trim(),
      promptInputs: promptInputs || {}
    });

    res.status(200).json({
      success: true,
      message: 'Privacy policy draft generated successfully',
      data: draft
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to generate privacy policy draft'
    });
  }
};
