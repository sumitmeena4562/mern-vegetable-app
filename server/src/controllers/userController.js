import User from '../models/User.js';
import Farmer from '../models/Farmer.js';
import { validationResult } from 'express-validator';
import Notification from '../models/Notification.js';
import Otp from '../models/otp.js';
import axios from 'axios';
import twilio from 'twilio';
import path from 'path';
import { body } from 'express-validator';



// ==========================
// 1. REGISTER User
// ==========================
export const register = async (req, res) => {
    try {
        console.log("🟢 Registration started...");

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { fullName, mobile, password, role, email, ...otherData } = req.body;
        console.log("🔍 Incoming Email:", email);
        console.log("📦 Full Body:", req.body);

        // Check if user already exists
        const existing = await User.findOne({ mobile });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'Mobile number already registered'
            });
        }

        // Step 1: Create Base User (common fields)
        console.log("📝 Creating base user...");
        const user = await User.create({
            fullName,
            mobile,
            password, // Password will be hashed by pre-save hook
            role,
            email: email || `${mobile}@user.com`,
            address: otherData.address || {},
            location: otherData.location || { type: 'Point', coordinates: [0, 0] }
        });

        console.log("✅ Base user created:", user._id);

        // Step 2: Create Role-Specific Profile
        let profile;

        switch (role) {
            case 'farmer':
                console.log("🌾 Creating farmer profile...");
                profile = await Farmer.create({
                    user: user._id,
                    farmName: otherData.farmName || `${fullName}'s Farm`,
                    farmSize: otherData.farmSize || 1,
                    farmSizeUnit: otherData.farmSizeUnit || 'acre',
                    crops: otherData.crops || [],
                    farmingExperience: otherData.farmingExperience || 0,
                    preferredPickupTime: otherData.preferredPickupTime || 'morning',
                    ...(otherData.farmerData || {})
                });
                break;

            case 'vendor':
                console.log("🏪 Creating vendor profile...");
                profile = await Vendor.create({
                    user: user._id,
                    shopName: otherData.shopName || `${fullName}'s Shop`,
                    businessType: otherData.businessType || 'retailer',
                    dailyCapacity: otherData.dailyCapacity || 10,
                    preferredVegetables: otherData.preferredVegetables || ['all'],
                    paymentTerms: otherData.paymentTerms || 'online',
                    storeTimings: otherData.storeTimings || { open: '06:00', close: '22:00' },
                    preferredPickupTime: otherData.preferredPickupTime || 'morning',
                    ...(otherData.vendorData || {})
                });
                break;

            case 'customer':
                console.log("👨‍👩‍👧‍👦 Creating customer profile...");
                profile = await Customer.create({
                    user: user._id,
                    familySize: otherData.familySize || 1,
                    subscription: otherData.subscription || 'none',
                    deliveryAddresses: otherData.deliveryAddresses || [],
                    paymentMethods: otherData.paymentMethods || [],
                    ...(otherData.customerData || {})
                });
                break;

            default:
                throw new Error('Invalid role specified');
        }

        console.log(`✅ ${role} registration successful`);

        // -------------------------------------------------------------
        // . NOTIFICATION SAVE (Tumhare naye Schema ke hisab se)
        // -------------------------------------------------------------


        await Notification.create(
            {
                user: user._id,
                title: "Account Created Successfully 🎉",
                message: `Welcome to AgriConnect, ${user.fullName || 'User'}! 
              We’re glad to have you as a ${user.role || 'member'}. 
              Your dashboard is ready. Start managing your activities, explore smart features, and grow with confidence using AgriConnect 🚜✨`,
                type: "success",
                priority: "high",
                data: {
                    email: user.email,
                    action: "signup"
                }

            }

        );
        // Generate token
        const token = user.generateAuthToken();

        // Prepare response
        const response = {
            success: true,
            message: `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully`,
            data: {
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    mobile: user.mobile,
                    email: user.email,
                    role: user.role,
                    isVerified: user.isVerified,
                    profilePhoto: user.profilePhoto
                },
                profile,
                token
            }
        };

        res.status(201).json(response);

    } catch (error) {
        console.error('❌ Registration error:', error);

        // Cleanup: If user was created but profile failed
        if (req.body.mobile) {
            try {
                await User.findOneAndDelete({ mobile: req.body.mobile });
                console.log("🧹 Cleaned up failed registration");
            } catch (cleanupError) {
                console.error('Cleanup error:', cleanupError);
            }
        }

        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: error.message
        });
    }
};

import nodemailer from 'nodemailer'; // 👈 Import add karein
// import Otp from '../models/Otp.js';

// ==========================
// EMAIL OTP LOGIC
// ==========================
export const sendOtp = async (req, res) => {
    try {
        const { mobile, email } = req.body; // 👈 Ab hum Email bhi maangenge

        // 1. Check existing user
        const existingUser = await User.findOne({ mobile });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Mobile number already registered. Please Login." });
        }

        // 2. Validation
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required for verification." });
        }

        // 3. Generate OTP
        const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

        // 4. Save OTP to DB (Mobile ke against save karenge taaki baad me verify kar sakein)
        await Otp.deleteMany({ mobile });
        await Otp.create({ mobile, otp: otpCode });

        // 5. Send Email using Nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: `"AgriConnect Security" <${process.env.EMAIL_USER}>`,
            to: email, // User ka email
            subject: 'AgriConnect Verification Code',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        
                        <img src="cid:agriconnectLogo" alt="AgriConnect Logo" style="width: 100px; height: 100px; margin-bottom: 10px;">
                        
                        <h2 style="color: #2E7D32; margin: 0;">AgriConnect 🌱</h2>
                        <p style="color: #666; font-size: 14px;">Farm to Vendor Direct Supply</p>
                    </div>
                    
                    <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <p style="font-size: 16px; color: #333;">Hello Farmer,</p>
                        <p style="color: #555;">Use the code below to complete your registration:</p>
                        
                        <div style="margin: 20px 0;">
                            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #2E7D32; background-color: #e8f5e9; padding: 10px 20px; border-radius: 5px; border: 1px dashed #2E7D32;">
                                ${otpCode}
                            </span>
                        </div>
                        
                        <p style="font-size: 12px; color: #888;">This OTP is valid for <strong>10 minutes</strong>.</p>
                    </div>

                    <div style="text-align: center; margin-top: 20px; color: #aaa; font-size: 12px;">
                        &copy; 2025 AgriConnect Tech Team.
                    </div>
                </div>
            `,

            // 👇 Attachments Section Add Karein
            attachments: [
                {
                    filename: 'logo.png',
                    path: path.join(process.cwd(), 'src', 'resource', 'Logo.png'), // 👈 Path adjust karein jahan image save ki hai
                    cid: 'agriconnectLogo' // Same ID jo HTML ke img src mein hai
                }
            ]
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${email} with OTP: ${otpCode}`);

        res.status(200).json({
            success: true,
            message: `OTP sent to ${email}. Please check your Inbox/Spam.`
        });

    } catch (error) {
        console.error("❌ Email Error:", error);
        res.status(500).json({ success: false, message: "Failed to send email. Check backend logs." });
    }
};
// ==========================
// VERIFY OTP
// ==========================
export const verifyOtp = async (req, res) => {
    try {
        const { mobile, otp } = req.body;

        // DB me check karo
        const validOtp = await Otp.findOne({ mobile, otp });

        if (!validOtp) {
            return res.status(400).json({ success: false, message: "Galat OTP hai ya expire ho gaya." });
        }

        // Verify hone ke baad OTP delete kar do (Optional)
        await Otp.deleteOne({ _id: validOtp._id });

        res.status(200).json({ success: true, message: "Mobile Verified Successfully!" });

    } catch (error) {
        console.error("OTP Verify Error:", error);
        res.status(500).json({ success: false, message: "Verification failed." });
    }
};

// ==========================
// 2. LOGIN USER
// ==========================
export const login = async (req, res) => {
    try {
        const { mobile, password } = req.body;
        console.log("Trying login for:", mobile); // 🟢 LOG 1
        // Find user & include password
        const user = await User.findOne({ mobile }).select('+password');

        if (!user) {
            console.log("❌ User not found in DB");
            return res.status(401).json({
                success: false,
                message: 'Invalid mobile number or password'
            });
        }
        console.log("✅ User found. Stored Hash:", user.password); // 🟢 LOG 3 (Hash check karne ke liye)
        console.log("🔑 Input Password:", password); // 🟢 LOG 4

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        console.log("🤔 Password Valid?", isPasswordValid);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid mobile number or password'
            });
        }

        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated'
            });
        }

        // Generate Token
        const token = user.generateAuthToken();

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    mobile: user.mobile,
                    role: user.role,
                    isVerified: user.isVerified
                },
                token
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message
        });
    }
};

// ==========================
// 3. GET USER NAME
// ==========================
export const getUserName = async (req, res) => {
    try {
        const user = req.user; // Auth middleware se mila
        res.status(200).json({
            success: true,
            name: user.fullName
        });
    } catch (error) {
        console.error("Error fetching name:", error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};


// ==========================
// 4. Full Profile for AuthContext
// ==========================


// ✅ NEW: Full Profile for AuthContext
export const getMe = async (req, res) => {
    try {
        const user = req.user; // Auth middleware se mila hua user

        // Hum pura user object bhejenge taaki AuthContext khush rahe
        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                mobile: user.mobile,
                role: user.role,
                isVerified: user.isVerified
                // Aur jo fields chahiye wo yahan add kar sakte ho
            }
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};


export const test = (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Auth routes are working!',
        timestamp: new Date().toISOString()
    });
};

// Get User Profile with Role-Specific Data
export const getProfile = async (req, res) => {
    try {
        // Get base user data
        const user = await User.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Get role-specific profile
        let profile = null;
        switch (user.role) {
            case 'farmer':
                profile = await Farmer.findOne({ user: user._id });
                break;
            case 'vendor':
                profile = await Vendor.findOne({ user: user._id });
                break;
            case 'customer':
                profile = await Customer.findOne({ user: user._id });
                break;
        }

        res.status(200).json({
            success: true,
            data: {
                user,
                profile
            }
        });

    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get profile',
            error: error.message
        });
    }
};

// Update Profile (Common + Role-Specific)
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Get current user to know role
        const currentUser = await User.findById(userId);
        if (!currentUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        // Separate common and role-specific data
        const { password, mobile, role, ...updateData } = req.body;
        
        // Don't allow role change
        if (role && role !== currentUser.role) {
            return res.status(400).json({
                success: false,
                message: 'Cannot change user role'
            });
        }
        
        // Prepare user updates (common fields only)
        const userUpdates = {};
        const allowedUserFields = [
            'fullName', 'email', 'profilePhoto', 'address', 
            'location', 'fcmToken', 'settings'
        ];
        
        Object.keys(updateData).forEach(key => {
            if (allowedUserFields.includes(key)) {
                userUpdates[key] = updateData[key];
            }
        });
        
        // Update common user data
        let updatedUser = currentUser;
        if (Object.keys(userUpdates).length > 0) {
            updatedUser = await User.findByIdAndUpdate(
                userId,
                userUpdates,
                { new: true, runValidators: true }
            ).select('-password');
        }
        
        // Update role-specific profile
        let profileUpdate = {};
        let updatedProfile = null;
        
        switch (currentUser.role) {
            case 'farmer':
                const farmerFields = [
                    'farmName', 'farmSize', 'farmSizeUnit', 'crops',
                    'farmingExperience', 'preferredPickupTime', 'bankDetails',
                    'documents', 'kycVerified', 'averageRating', 'totalSales'
                ];
                
                Object.keys(updateData).forEach(key => {
                    if (farmerFields.includes(key)) {
                        profileUpdate[key] = updateData[key];
                    }
                });
                
                if (Object.keys(profileUpdate).length > 0) {
                    updatedProfile = await Farmer.findOneAndUpdate(
                        { user: userId },
                        profileUpdate,
                        { new: true, runValidators: true }
                    );
                } else {
                    updatedProfile = await Farmer.findOne({ user: userId });
                }
                break;
                
            case 'vendor':
                const vendorFields = [
                    'shopName', 'businessType', 'gstNumber', 'businessLicense',
                    'dailyCapacity', 'preferredVegetables', 'paymentTerms',
                    'bankDetails', 'storeTimings', 'preferredPickupTime',
                    'warehouseAddress', 'creditLimit', 'currentCreditUsed',
                    'averageRating', 'totalPurchases'
                ];
                
                Object.keys(updateData).forEach(key => {
                    if (vendorFields.includes(key)) {
                        profileUpdate[key] = updateData[key];
                    }
                });
                
                if (Object.keys(profileUpdate).length > 0) {
                    updatedProfile = await Vendor.findOneAndUpdate(
                        { user: userId },
                        profileUpdate,
                        { new: true, runValidators: true }
                    );
                } else {
                    updatedProfile = await Vendor.findOne({ user: userId });
                }
                break;
                
            case 'customer':
                const customerFields = [
                    'preferences', 'deliveryInstructions', 'familySize',
                    'averageMonthlySpend', 'subscription', 'deliveryAddresses',
                    'paymentMethods', 'wishlist', 'cart', 'totalOrders',
                    'loyaltyPoints'
                ];
                
                Object.keys(updateData).forEach(key => {
                    if (customerFields.includes(key)) {
                        profileUpdate[key] = updateData[key];
                    }
                });
                
                if (Object.keys(profileUpdate).length > 0) {
                    updatedProfile = await Customer.findOneAndUpdate(
                        { user: userId },
                        profileUpdate,
                        { new: true, runValidators: true }
                    );
                } else {
                    updatedProfile = await Customer.findOne({ user: userId });
                }
                break;
        }
        
        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                user: updatedUser,
                profile: updatedProfile
            }
        });
        
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile',
            error: error.message
        });
    }
};

export const validateLogin = [
    body('mobile')
        .trim()
        .notEmpty().withMessage('Mobile number is required'),

    body('password')
        .trim()
        .notEmpty().withMessage('Password is required')
];

export const validateRegister = [
    body('fullName')
        .trim()
        .notEmpty().withMessage('Full name is required')
        .isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),

    body('mobile')
        .trim()
        .notEmpty().withMessage('Mobile number is required')
        .matches(/^[6-9]\d{9}$/).withMessage('Valid Indian mobile number is required'),

    body('password')
        .trim()
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

    body('role')
        .trim()
        .notEmpty().withMessage('Role is required')
        .isIn(['farmer', 'vendor', 'customer']).withMessage('Invalid role'),

    // Conditional farmer fields
    body('farmName')
        .if(body('role').equals('farmer'))
        .trim()
        .notEmpty().withMessage('Please provide your farm name'),

    body('farmSize')
        .if(body('role').equals('farmer'))
        .notEmpty().withMessage('Please provide farm size')
        .bail()
        .isNumeric().withMessage('Farm size must be a number'),

    // Conditional vendor fields
    body('shopName')
        .if(body('role').equals('vendor'))
        .trim()
        .notEmpty().withMessage('Please provide your shop name'),

    body('dailyCapacity')
        .if(body('role').equals('vendor'))
        .notEmpty().withMessage('Please provide daily buying capacity')
        .bail()
        .isNumeric().withMessage('Daily capacity must be a number')
];
