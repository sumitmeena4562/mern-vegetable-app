import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import Customer from '../models/Customer.js';
import Notification from '../models/Notification.js';

// Validation Rules
export const validateCreateCustomer = [
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    body('mobile').trim().matches(/^[6-9]\d{9}$/).withMessage('Valid Indian mobile number is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

// Register Customer
export const registerCustomer = async (req, res) => {
    try {
        console.log("👨‍👩‍👧‍👦 Customer Registration Started...");

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { fullName, mobile, password, email, ...customerData } = req.body;

        const existing = await User.findOne({ mobile });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Mobile number already registered' });
        }

        const user = await User.create({
            fullName,
            mobile,
            password,
            email: email || `${mobile}@agriconnect.com`,
            role: 'customer',
            isVerified: true,
            location: customerData.location || { type: 'Point', coordinates: [0, 0] }
        });

        const profile = await Customer.create({
            user: user._id,
            familySize: customerData.familySize || 1,
            subscription: customerData.subscription || 'none',
            deliveryAddresses: customerData.deliveryAddresses || []
        });

        await Notification.create({
            user: user._id,
            title: "Welcome! 👨‍👩‍👧‍👦",
            message: `Hello ${fullName}, welcome to AgriConnect. Order fresh veggies now!`,
            type: "success"
        });

        const token = user.generateAuthToken();

        res.status(201).json({
            success: true,
            message: 'Customer registered successfully',
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
        console.error('Customer Registration Error:', error);
        if (req.body.mobile) {
            await User.findOneAndDelete({ mobile: req.body.mobile }).catch(e => console.error(e));
        }
        res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
    }
};

// Get Customer Profile
export const getMyProfile = async (req, res) => {
    try {
        const customer = await Customer.findOne({ user: req.user.id }).populate('user', '-password');
        if (!customer) return res.status(404).json({ success: false, message: 'Customer profile not found' });
        res.status(200).json({ success: true, data: customer });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

export default {
    validateCreateCustomer,
    registerCustomer,
    getMyProfile
};
