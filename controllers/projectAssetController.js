const ProjectAsset = require('../models/ProjectAsset');
const Project = require('../models/Project');
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

// Helper to initialize S3 Client for Cloudflare R2
const getR2Client = () => {
  return new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });
};

// @desc    Get all Project Assets
// @route   GET /api/v1/project-assets
// @access  Public
exports.getAssets = async (req, res, next) => {
  try {
    const { project, type } = req.query;
    const filter = {};

    if (project) {
      filter.project = project;
    }
    if (type) {
      filter.type = type;
    }

    const assets = await ProjectAsset.find(filter)
      .populate('project', 'name slug logoUrl')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: assets.length,
      data: assets
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get presigned URL for direct upload to R2
// @route   POST /api/v1/project-assets/presigned-url
// @access  Private/Admin
exports.getPresignedUrl = async (req, res, next) => {
  try {
    const { filename, contentType } = req.body;

    if (!filename || !contentType) {
      return res.status(400).json({
        success: false,
        message: 'Please provide filename and contentType'
      });
    }

    // Generate unique storage key
    const uniqueId = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const key = `assets/${uniqueId}-${filename}`;
    const bucket = process.env.R2_BUCKET_NAME;

    // Initialize R2 client
    const r2Client = getR2Client();

    // Prepare S3 PutObject command
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType
    });

    // Create Presigned URL (valid for 15 minutes)
    const presignedUrl = await getSignedUrl(r2Client, command, { expiresIn: 900 });

    // Format public read URL using public mapper config
    const publicUrlBase = process.env.R2_PUBLIC_URL.replace(/\/$/, '');
    const fileUrl = `${publicUrlBase}/${key}`;

    res.status(200).json({
      success: true,
      data: {
        uploadUrl: presignedUrl,
        fileUrl: fileUrl,
        key: key
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to generate upload URL'
    });
  }
};

// @desc    Create new Project Asset entry in database
// @route   POST /api/v1/project-assets
// @access  Private/Admin
exports.createAsset = async (req, res, next) => {
  try {
    const { project, title, type, url, key } = req.body;

    if (!project || !type || !url || !key) {
      return res.status(400).json({
        success: false,
        message: 'Please provide project, type, url and storage key'
      });
    }

    // Verify project exists
    const projectExists = await Project.findById(project);
    if (!projectExists) {
      return res.status(404).json({
        success: false,
        message: 'Associated Project not found'
      });
    }

    const asset = await ProjectAsset.create({
      project,
      title: title || '',
      type,
      url,
      key
    });

    res.status(201).json({
      success: true,
      message: 'Asset recorded successfully',
      data: asset
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Delete Project Asset from database and Cloudflare R2
// @route   DELETE /api/v1/project-assets/:id
// @access  Private/Admin
exports.deleteAsset = async (req, res, next) => {
  try {
    const asset = await ProjectAsset.findById(req.params.id);

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      });
    }

    // Delete object from Cloudflare R2 storage bucket
    try {
      const r2Client = getR2Client();
      const command = new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: asset.key
      });
      await r2Client.send(command);
    } catch (storageErr) {
      console.error('Failed to delete asset from Cloudflare R2 storage', storageErr);
      // We will still proceed to delete the record in the database even if the file is already deleted or key is missing.
    }

    // Delete database record
    await asset.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Asset deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Download Project Asset (proxy file from R2 to force download)
// @route   GET /api/v1/project-assets/download
// @access  Public
exports.downloadAsset = async (req, res, next) => {
  try {
    const { url, filename } = req.query;
    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'Please provide url parameter'
      });
    }

    const http = require('http');
    const https = require('https');
    const client = url.startsWith('https') ? https : http;

    client.get(url, (fileRes) => {
      // Handle redirects if any
      if (fileRes.statusCode >= 300 && fileRes.statusCode < 400 && fileRes.headers.location) {
        return client.get(fileRes.headers.location, (redirectRes) => {
          res.setHeader('Content-Disposition', `attachment; filename="${filename || 'download'}"`);
          res.setHeader('Content-Type', redirectRes.headers['content-type'] || 'application/octet-stream');
          redirectRes.pipe(res);
        });
      }

      res.setHeader('Content-Disposition', `attachment; filename="${filename || 'download'}"`);
      res.setHeader('Content-Type', fileRes.headers['content-type'] || 'application/octet-stream');
      fileRes.pipe(res);
    }).on('error', (err) => {
      console.error('Download stream error:', err.message);
      res.status(500).json({
        success: false,
        message: 'Failed to stream download'
      });
    });
  } catch (err) {
    console.error('Download error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};
