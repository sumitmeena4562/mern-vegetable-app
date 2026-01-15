import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import Farmer from '../models/Farmer.js';
import Notification from '../models/Notification.js';
import { sendMail } from '../utils/sendMail.js';

// Validation Rules
export const validateCreateFarmer = [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('mobile').trim().matches(/^[6-9]\d{9}$/).withMessage('Valid Indian mobile number is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('farmName').trim().notEmpty().withMessage('Farm name is required'),
  body('farmSize').isNumeric().withMessage('Farm size must be a number')
];

// Register Farmer (Create User + Farmer Profile)
export const registerFarmer = async (req, res) => {
  try {
    console.log("🌾 Farmer Registration Started...");

    // 1. Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { fullName, mobile, password, email, ...farmerData } = req.body;

    // 2. Check duplicate
    const existing = await User.findOne({ mobile });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Mobile number already registered' });
    }

    // 3. Create Base User
    const user = await User.create({
      fullName,
      mobile,
      password,
      email: email || `${mobile}@agriconnect.com`,
      role: 'farmer',
      isVerified: true, // Assuming OTP verified on frontend before this call
      location: farmerData.location || { type: 'Point', coordinates: [0, 0] }
    });

    // 4. Create Farmer Profile
    const profile = await Farmer.create({
      user: user._id,
      farmName: farmerData.farmName || `${fullName}'s Farm`,
      farmSize: farmerData.farmSize,
      farmSizeUnit: farmerData.farmSizeUnit || 'acre',
      crops: farmerData.crops || [],
      farmingExperience: farmerData.farmingExperience || 0,
      preferredPickupTime: farmerData.preferredPickupTime || 'morning',
      location: farmerData.location || { type: 'Point', coordinates: [0, 0] },
      address: farmerData.address || {}
    });

    // 5. Notifications
    await Notification.create({
      user: user._id,
      title: "Welcome Farmer! 🌾",
      message: `Hello ${fullName}, your farmer account is ready. Start listing your crops!`,
      type: "success"
    });

    // 6. Generate Token
    const token = user.generateAuthToken();

    res.status(201).json({
      success: true,
      message: 'Farmer registered successfully',
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          mobile: user.mobile,
          role: user.role,
          isVerified: user.isVerified
        },
        profile,
        token
      }
    });

  } catch (error) {
    console.error('Farmer Registration Error:', error);
    // Cleanup if user created but profile failed
    if (req.body.mobile) {
      await User.findOneAndDelete({ mobile: req.body.mobile }).catch(e => console.error(e));
    }
    res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
  }
};

// Get Farmer Profile (Own)
export const getMyProfile = async (req, res) => {
  try {
    const farmer = await Farmer.findOne({ user: req.user.id }).populate('user', '-password');
    if (!farmer) return res.status(404).json({ success: false, message: 'Farmer profile not found' });
    res.status(200).json({ success: true, data: farmer });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Update Farmer Profile
export const updateProfile = async (req, res) => {
  try {
    const { fullName, email, ...farmData } = req.body;

    // Update User basic info
    if (fullName || email) {
      await User.findByIdAndUpdate(req.user.id, { fullName, email });
    }

    // Update Farmer specific info
    const farmer = await Farmer.findOneAndUpdate(
      { user: req.user.id },
      farmData,
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, message: 'Profile updated', data: farmer });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Update failed', error: error.message });
  }
};

export default {
  validateCreateFarmer,
  registerFarmer,
  getMyProfile,
  updateProfile
};
