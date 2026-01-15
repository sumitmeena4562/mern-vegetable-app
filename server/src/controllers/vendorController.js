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
            location: vendorData.location || { type: 'Point', coordinates: [0, 0] }
        });

        const profile = await Vendor.create({
            user: user._id,
            shopName: vendorData.shopName || `${fullName}'s Shop`,
            businessType: vendorData.businessType || 'retailer',
            dailyCapacity: vendorData.dailyCapacity || 10,
            preferredVegetables: vendorData.preferredVegetables || ['all'],
            storeTimings: vendorData.storeTimings || { open: '08:00', close: '20:00' },
            location: vendorData.location || { type: 'Point', coordinates: [0, 0] }
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
        const { fullName, email, ...vendorData } = req.body;

        if (fullName || email) {
            await User.findByIdAndUpdate(req.user.id, { fullName, email });
        }

        const vendor = await Vendor.findOneAndUpdate(
            { user: req.user.id },
            vendorData,
            { new: true, runValidators: true }
        );

        res.status(200).json({ success: true, message: 'Profile updated', data: vendor });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Update failed', error: error.message });
    }
};

export default {
    validateCreateVendor,
    registerVendor,
    getMyProfile,
    updateProfile
};
