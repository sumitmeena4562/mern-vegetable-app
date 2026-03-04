import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import Vendor from '../models/Vendor.js';
import Notification from '../models/Notification.js';

// Validation Rules
export const validateCreateVendor = [
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    body('mobile').trim().matches(/^[6-9]\d{9}$/).withMessage('Valid Indian mobile number is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('shopName').trim().notEmpty().withMessage('Shop name is required'),
    body('dailyCapacity').isNumeric().withMessage('Daily capacity must be a number')
];

// Register Vendor
export const registerVendor = async (req, res) => {
    try {
        console.log("🏪 Vendor Registration Started...");

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { fullName, mobile, password, email, ...vendorData } = req.body;
        console.log(`🏪 [VendorFlow] Registration Payload:`, { fullName, mobile, email, ...vendorData });
        console.log(`🏪 [VendorFlow] Registering new vendor: ${fullName} (${mobile})`);

        // Handle shop photos from Multer
        const shopPhotos = req.files ? req.files.map(file => file.path) : [];

        const existing = await User.findOne({ mobile });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Mobile number already registered' });
        }

        const user = await User.create({
            fullName,
            mobile,
            password,
            email: email || `${mobile}@agriconnect.com`,
            role: 'vendor',
            isVerified: true,
            location: vendorData.location || { type: 'Point', coordinates: [0, 0] },
            address: vendorData.address || {}
        });

        const profile = await Vendor.create({
            user: user._id,
            shopName: vendorData.shopName || `${fullName}'s Shop`,
            businessType: vendorData.businessType || 'retailer',
            shopType: vendorData.shopType || 'kirana',
            dailyCapacity: vendorData.dailyCapacity || 10,
            preferredVegetables: vendorData.preferredVegetables || ['all'],
            storeTimings: vendorData.storeTimings || { open: '08:00', close: '20:00' },
            fssaiNumber: vendorData.fssaiNumber,
            deliveryRadius: vendorData.deliveryRadius || 5,
            acceptsOnlineOrders: vendorData.acceptsOnlineOrders !== undefined ? vendorData.acceptsOnlineOrders : true,
            shopPhotos: shopPhotos.length > 0 ? shopPhotos : (vendorData.shopPhotos || []),
            preferredCategories: vendorData.preferredCategories || ['all']
        });

        await Notification.create({
            user: user._id,
            title: "Welcome Vendor! 🏪",
            message: `Hello ${fullName}, your shop is now registered. Start buying fresh produce!`,
            type: "success"
        });

        const token = user.generateAuthToken();

        res.status(201).json({
            success: true,
            message: 'Vendor registered successfully',
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
        console.log(`✅ [VendorFlow] Vendor registered successfully: ${user._id}`);

    } catch (error) {
        console.error('Vendor Registration Error:', error);
        if (req.body.mobile) {
            await User.findOneAndDelete({ mobile: req.body.mobile }).catch(e => console.error(e));
        }
        res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
    }
};

// Get Vendor Profile
export const getMyProfile = async (req, res) => {
    try {
        const vendor = await Vendor.findOne({ user: req.user.id }).populate('user', '-password');
        if (!vendor) return res.status(404).json({ success: false, message: 'Vendor profile not found' });
        res.status(200).json({ success: true, data: vendor });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Update Vendor Profile
export const updateProfile = async (req, res) => {
    try {
        const { fullName, email, address, location, ...vendorData } = req.body;

        if (fullName || email || address || location) {
            const userUpdate = {};
            if (fullName) userUpdate.fullName = fullName;
            if (email) userUpdate.email = email;
            if (address) userUpdate.address = address;
            if (location) userUpdate.location = location;

            await User.findByIdAndUpdate(req.user.id, userUpdate);
        }

        // SECURITY FIX: Only allow safe fields to be updated by Vendor
        const allowedVendorFields = [
            'shopName', 'businessType', 'preferredCategories', 'shopType',
            'shopPhotos', 'fssaiNumber', 'deliveryRadius', 'acceptsOnlineOrders',
            'gstNumber', 'businessLicense', 'dailyCapacity', 'paymentTerms',
            'bankDetails', 'storeTimings', 'preferredPickupTime'
        ];

        const safeVendorData = {};
        for (const key of allowedVendorFields) {
            if (vendorData[key] !== undefined) safeVendorData[key] = vendorData[key];
        }

        const vendor = await Vendor.findOneAndUpdate(
            { user: req.user.id },
            safeVendorData,
            { new: true, runValidators: true }
        );

        res.status(200).json({ success: true, message: 'Profile updated', data: vendor });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Update failed', error: error.message });
    }
};
// Get Vendor Dashboard Stats (Aggregated from DB)
export const getDashboardStats = async (req, res) => {
    try {
        const Order = (await import('../models/Order.js')).default;
        const mongoose = (await import('mongoose')).default;
        const vendor = await Vendor.findOne({ user: req.user.id });
        console.log(`📊 [VendorFlow] Fetching dashboard stats for vendor: ${req.user.id}`);

        if (!vendor) {
            return res.status(404).json({ success: false, message: 'Vendor profile not found' });
        }

        const userObjectId = new mongoose.Types.ObjectId(req.user.id);

        // 1. Overall Order Stats
        const [orderStats] = await Order.aggregate([
            { $match: { buyer: userObjectId } },
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    deliveredOrders: { $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] } },
                    activeOrders: { $sum: { $cond: [{ $in: ['$status', ['pending', 'confirmed', 'processing', 'in_transit']] }, 1, 0] } },
                    pendingDeliveries: { $sum: { $cond: [{ $in: ['$status', ['ready_for_pickup', 'in_transit']] }, 1, 0] } },
                    totalSpent: {
                        $sum: {
                            $cond: [
                                { $eq: ['$status', 'delivered'] },
                                { $ifNull: ['$finalAmount', '$totalAmount'] },
                                0
                            ]
                        }
                    }
                }
            }
        ]);

        // 2. Weekly Sourcing Stats
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const weeklyAgg = await Order.aggregate([
            {
                $match: {
                    buyer: userObjectId,
                    createdAt: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", timezone: "Asia/Kolkata", date: "$createdAt" } },
                    orders: { $sum: 1 },
                    spent: {
                        $sum: { $ifNull: ['$finalAmount', '$totalAmount'] }
                    }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Format weeklySourcing to ensure all 7 days are present
        const weeklyDict = weeklyAgg.reduce((acc, curr) => {
            acc[curr._id] = curr;
            return acc;
        }, {});

        const weeklySourcing = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }); // YYYY-MM-DD
            const data = weeklyDict[dateStr] || { orders: 0, spent: 0 };

            weeklySourcing.push({
                name: date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'Asia/Kolkata' }),
                spent: data.spent,
                orders: data.orders
            });
        }

        res.status(200).json({
            success: true,
            data: {
                totalSpent: orderStats?.totalSpent || 0,
                activeOrders: orderStats?.activeOrders || 0,
                pendingDeliveries: orderStats?.pendingDeliveries || 0,
                creditUsed: vendor.currentCreditUsed || 0,
                creditLimit: vendor.creditLimit || 0,
                totalOrders: orderStats?.totalOrders || 0,
                deliveredOrders: orderStats?.deliveredOrders || 0,
                weeklySourcing
            }
        });
        console.log(`✅ [VendorFlow] Stats fetched successfully for vendor: ${req.user.id}`);
    } catch (error) {
        console.error('Vendor getDashboardStats error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch stats' });
    }
};

// Complete Vendor Onboarding
export const completeOnboarding = async (req, res) => {
    try {
        const { shopName, businessType, dailyCapacity, preferredCategories, deliveryRadius, storeTimings } = req.body;
        console.log(`🏪 [VendorFlow] Onboarding Payload:`, req.body);

        const updateData = { onboardingComplete: true };
        if (shopName) updateData.shopName = shopName;
        if (businessType) updateData.businessType = businessType;
        if (dailyCapacity) updateData.dailyCapacity = dailyCapacity;
        if (preferredCategories) updateData.preferredCategories = preferredCategories;
        if (deliveryRadius) updateData.deliveryRadius = deliveryRadius;
        if (storeTimings) updateData.storeTimings = storeTimings;

        const vendor = await Vendor.findOneAndUpdate(
            { user: req.user.id },
            updateData,
            { new: true }
        );

        if (!vendor) {
            return res.status(404).json({ success: false, message: 'Vendor profile not found' });
        }

        res.status(200).json({ success: true, message: 'Onboarding completed!', data: vendor });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Onboarding failed', error: error.message });
    }
};

export default {
    validateCreateVendor,
    registerVendor,
    getMyProfile,
    updateProfile,
    getDashboardStats,
    completeOnboarding
};
