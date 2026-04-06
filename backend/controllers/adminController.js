const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const DiatomClass = require('../models/DiatomClass');
const ClassificationRecord = require('../models/ClassificationRecord');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'superlongrandomstringwithsymbols123!@#changeit';

/**
 * Admin Login Controller
 */
const adminLogin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const validPassword = await bcrypt.compare(password, admin.password);

    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token with admin flag
    const token = jwt.sign(
      { id: admin._id, username: admin.username, isAdmin: true },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Admin login successful',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
      },
    });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

/**
 * Get Dashboard Statistics
 */
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalClassifications = await ClassificationRecord.countDocuments();
    const totalDiatomClasses = await DiatomClass.countDocuments();

    // Get most detected diatom classes
    const mostDetected = await ClassificationRecord.aggregate([
      {
        $group: {
          _id: '$predictedClass',
          count: { $sum: 1 },
          avgConfidence: { $avg: '$confidence' },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Get recent classifications
    const recentClassifications = await ClassificationRecord.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalClassifications,
        totalDiatomClasses,
        mostDetectedClasses: mostDetected,
        recentClassifications,
      },
    });
  } catch (err) {
    console.error('Stats fetch error:', err);
    res.status(500).json({ success: false, message: 'Error fetching stats', error: err.message });
  }
};

/**
 * Get Classification Logs
 */
const getClassificationLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const logs = await ClassificationRecord.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ClassificationRecord.countDocuments();

    res.json({
      success: true,
      logs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error('Logs fetch error:', err);
    res.status(500).json({ success: false, message: 'Error fetching logs', error: err.message });
  }
};

/**
 * Create Diatom Class
 */
const createDiatomClass = async (req, res) => {
  const { name, scientificDescription, environmentalSignificance, impacts } = req.body;

  if (!name || !scientificDescription || !environmentalSignificance || !impacts) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if class already exists
    const existing = await DiatomClass.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: 'Diatom class already exists' });
    }

    const diatomClass = new DiatomClass({
      name,
      scientificDescription,
      environmentalSignificance,
      impacts,
    });

    await diatomClass.save();

    res.status(201).json({
      success: true,
      message: 'Diatom class created successfully',
      diatomClass,
    });
  } catch (err) {
    console.error('Create class error:', err);
    res.status(500).json({ success: false, message: 'Error creating class', error: err.message });
  }
};

/**
 * Update Diatom Class
 */
const updateDiatomClass = async (req, res) => {
  const { classId } = req.params;
  const { name, scientificDescription, environmentalSignificance, impacts } = req.body;

  try {
    const diatomClass = await DiatomClass.findByIdAndUpdate(
      classId,
      {
        name,
        scientificDescription,
        environmentalSignificance,
        impacts,
      },
      { new: true, runValidators: true }
    );

    if (!diatomClass) {
      return res.status(404).json({ message: 'Diatom class not found' });
    }

    res.json({
      success: true,
      message: 'Diatom class updated successfully',
      diatomClass,
    });
  } catch (err) {
    console.error('Update class error:', err);
    res.status(500).json({ success: false, message: 'Error updating class', error: err.message });
  }
};

/**
 * Delete Diatom Class
 */
const deleteDiatomClass = async (req, res) => {
  const { classId } = req.params;

  try {
    const diatomClass = await DiatomClass.findByIdAndDelete(classId);

    if (!diatomClass) {
      return res.status(404).json({ message: 'Diatom class not found' });
    }

    res.json({
      success: true,
      message: 'Diatom class deleted successfully',
    });
  } catch (err) {
    console.error('Delete class error:', err);
    res.status(500).json({ success: false, message: 'Error deleting class', error: err.message });
  }
};

/**
 * Get All Diatom Classes
 */
const getAllDiatomClasses = async (req, res) => {
  try {
    const classes = await DiatomClass.find();
    res.json({
      success: true,
      classes,
    });
  } catch (err) {
    console.error('Fetch classes error:', err);
    res.status(500).json({ success: false, message: 'Error fetching classes', error: err.message });
  }
};

module.exports = {
  adminLogin,
  getDashboardStats,
  getClassificationLogs,
  createDiatomClass,
  updateDiatomClass,
  deleteDiatomClass,
  getAllDiatomClasses,
};
