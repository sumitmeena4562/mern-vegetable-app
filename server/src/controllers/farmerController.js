import { body, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Farmer from '../models/Farmer.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
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
      isVerified: true,
      location: farmerData.location || { type: 'Point', coordinates: [0, 0] },
      address: farmerData.address || {}
    });

    // 4. Create Farmer Profile (Improved with specialized fields)
    const profile = await Farmer.create({
      user: user._id,
      farmName: farmerData.farmName || `${fullName}'s Farm`,
      farmSize: farmerData.farmSize,
      farmSizeUnit: farmerData.farmSizeUnit || 'acre',
      farmingType: farmerData.farmingType || 'regular',
      soilType: farmerData.soilType || 'other',
      irrigationSystem: farmerData.irrigationSystem || 'manual',
      waterSource: farmerData.waterSource || 'well',
      hasColdStorage: farmerData.hasColdStorage || false,
      landOwnership: farmerData.landOwnership || 'owned',
      farmPhotos: farmerData.farmPhotos || [],
      primaryCrop: farmerData.primaryCrop,
      crops: farmerData.crops || [],
      farmingExperience: farmerData.farmingExperience || 0,
      preferredPickupTime: farmerData.preferredPickupTime || 'morning'
    });

    // 5. Notifications
    await Notification.create({
      user: user._id,
      title: "Welcome Farmer! 🌾",
      message: `Hello ${fullName}, your farmer account is ready. Start listing your crops!`,
      type: "success"
    });

    // 6. Send Welcome Email 📧
    if (email) {
      await sendMail(email, 'WELCOME', {
        name: fullName,
        role: 'Farmer',
        mobile: mobile,
        location: `${farmerData.address?.city || 'Unknown City'}, ${farmerData.address?.state || ''}`
      });
    }

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

// Update Farmer Profile (SECURED: Only whitelisted fields allowed)
export const updateProfile = async (req, res) => {
  try {
    const { fullName, email, address, location, ...farmData } = req.body;

    // Update User common info
    if (fullName || email || address || location) {
      const userUpdate = {};
      if (fullName) userUpdate.fullName = fullName;
      if (email) userUpdate.email = email;
      if (address) userUpdate.address = address;
      if (location) userUpdate.location = location;

      await User.findByIdAndUpdate(req.user.id, userUpdate);
    }

    // SECURITY FIX: Only allow safe fields to be updated
    const allowedFarmFields = [
      'farmName', 'farmSize', 'farmSizeUnit', 'farmingType', 'soilType',
      'irrigationSystem', 'waterSource', 'hasColdStorage', 'landOwnership',
      'farmPhotos', 'primaryCrop', 'crops', 'farmingExperience',
      'preferredPickupTime', 'bankDetails'
    ];
    const safeFarmData = {};
    for (const key of allowedFarmFields) {
      if (farmData[key] !== undefined) safeFarmData[key] = farmData[key];
    }

    const farmer = await Farmer.findOneAndUpdate(
      { user: req.user.id },
      safeFarmData,
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, message: 'Profile updated', data: farmer });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Update failed', error: error.message });
  }
};

// Get Dashboard Stats (Optimized — DB-level aggregation)
export const getDashboardStats = async (req, res) => {
  try {
    const farmerId = req.user.id;
    const farmerObjectId = new mongoose.Types.ObjectId(farmerId);

    // 1. Product count
    const totalProducts = await Product.countDocuments({ farmer: farmerId, status: { $ne: 'removed' } });

    // 2. Order stats + Earnings — single aggregate query instead of loading all orders
    const [orderStats] = await Order.aggregate([
      { $match: { farmer: farmerObjectId } },
      {
        $group: {
          _id: null,
          pendingOrders: {
            $sum: { $cond: [{ $in: ['$status', ['pending', 'confirmed', 'ready_for_pickup']] }, 1, 0] }
          },
          completedOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
          },
          totalEarnings: {
            $sum: {
              $cond: [
                { $or: [{ $eq: ['$status', 'delivered'] }, { $eq: ['$payment.status', 'paid'] }] },
                { $ifNull: ['$finalAmount', '$totalAmount'] },
                0
              ]
            }
          }
        }
      }
    ]);

    // 3. Farmer profile
    const profile = await Farmer.findOne({ user: farmerId });

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalEarnings: orderStats?.totalEarnings || 0,
          activeProducts: totalProducts,
          pendingOrders: orderStats?.pendingOrders || 0,
          completedOrders: orderStats?.completedOrders || 0,
          rating: profile?.averageRating || 0,
          reviewsCount: 0
        },
        onboarding: {
          profileComplete: !!(profile?.farmName && profile?.farmSize),
          productsCount: totalProducts,
          isVerified: req.user.isVerified || profile?.kycVerified
        }
      }
    });

  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
};

// @desc    Get detailed analytics for farmer
// @access  Private (Farmer)
export const getFarmerAnalytics = async (req, res) => {
  try {
    const farmerId = req.user.id;
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // 1. Revenue Over Time (Aggregated by Month)
    const revenueStats = await Order.aggregate([
      {
        $match: {
          farmer: new mongoose.Types.ObjectId(farmerId),
          status: 'delivered',
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" }
          },
          revenue: { $sum: "$finalAmount" },
          orders: { $count: {} }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // 2. Product Performance
    const productPerformance = await Order.aggregate([
      {
        $match: {
          farmer: new mongoose.Types.ObjectId(farmerId),
          status: 'delivered'
        }
      },
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.name",
          sales: { $sum: "$products.quantity" },
          revenue: { $sum: "$products.totalPrice" }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 }
    ]);

    // 3. Buyer Types Distribution
    const buyerStats = await Order.aggregate([
      {
        $match: {
          farmer: new mongoose.Types.ObjectId(farmerId),
          status: 'delivered'
        }
      },
      {
        $group: {
          _id: "$buyerType",
          count: { $count: {} },
          totalSpent: { $sum: "$finalAmount" }
        }
      }
    ]);

    // 4. Market Trends (Simulated based on categories)
    const categoryDemand = await Product.aggregate([
      { $group: { _id: "$category", count: { $count: {} } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        revenueStats: revenueStats.map(s => ({
          name: new Date(s._id.year, s._id.month - 1).toLocaleString('default', { month: 'short' }),
          revenue: s.revenue,
          orders: s.orders
        })),
        productPerformance: productPerformance.map(p => ({
          name: p._id,
          sales: p.sales,
          revenue: p.revenue
        })),
        buyerStats,
        categoryDemand: categoryDemand.map(c => ({
          category: c._id,
          demand: c.count * 10 // Simulated demand multiplier
        }))
      }
    });
  } catch (error) {
    console.error("Analytics Error:", error);
    res.status(500).json({ success: false, message: 'Failed to fetch analytics', error: error.message });
  }
};

// Complete Onboarding (Mandatory First-Time Setup)
export const completeOnboarding = async (req, res) => {
  try {
    const farmerId = req.user.id;
    const {
      farmName, farmSize, farmSizeUnit, landOwnership,
      farmingType, soilType, irrigationSystem, waterSource, hasColdStorage,
      primaryCrop, crops, farmingExperience, preferredPickupTime
    } = req.body;

    // Validate required fields
    if (!farmName || !farmSize || !crops || crops.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Farm name, size, and at least one crop are required.'
      });
    }

    const farmer = await Farmer.findOneAndUpdate(
      { user: farmerId },
      {
        farmName,
        farmSize: parseFloat(farmSize),
        farmSizeUnit: farmSizeUnit || 'acre',
        landOwnership: landOwnership || 'owned',
        farmingType: farmingType || 'regular',
        soilType: soilType || 'other',
        irrigationSystem: irrigationSystem || 'manual',
        waterSource: waterSource || 'well',
        hasColdStorage: hasColdStorage || false,
        primaryCrop: primaryCrop || '',
        crops: crops || [],
        farmingExperience: parseInt(farmingExperience) || 0,
        preferredPickupTime: preferredPickupTime || 'morning',
        onboardingComplete: true
      },
      { new: true, runValidators: true }
    );

    if (!farmer) {
      return res.status(404).json({ success: false, message: 'Farmer profile not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Onboarding completed successfully!',
      data: farmer
    });

  } catch (error) {
    console.error('Onboarding completion error:', error);
    res.status(500).json({ success: false, message: 'Failed to complete onboarding' });
  }
};

export default {
  validateCreateFarmer,
  registerFarmer,
  getMyProfile,
  updateProfile,
  getDashboardStats,
  getFarmerAnalytics,
  completeOnboarding
};
