// file: controllers/authController.js
import User from '../models/User.js';
import Farmer from '../models/Farmer.js';
import Customer from '../models/Customer.js';
import Vendor from '../models/Vendor.js';
import { body, validationResult } from 'express-validator';

// Validation rules
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

export const validateLogin = [
    body('mobile')
        .trim()
        .notEmpty().withMessage('Mobile number is required'),

    body('password')
        .trim()
        .notEmpty().withMessage('Password is required')
];

// Register User
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

// Login User
// controllers/authController.js में login function
export const login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { mobile, password } = req.body;

        // Find user with password (select password explicitly)
        const user = await User.findOne({ mobile }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid mobile number or password'
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
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

        // Get role-specific profile
        let profile = null;
        let additionalData = {};
        
        switch (user.role) {
            case 'farmer':
                profile = await Farmer.findOne({ user: user._id });
                if (profile) {
                    additionalData = {
                        farmName: profile.farmName,
                        farmSize: profile.farmSize,
                        crops: profile.crops,
                        averageRating: profile.averageRating,
                        totalSales: profile.totalSales,
                        kycVerified: profile.kycVerified
                    };
                }
                break;
                
            case 'vendor':
                profile = await Vendor.findOne({ user: user._id });
                if (profile) {
                    additionalData = {
                        shopName: profile.shopName,
                        businessType: profile.businessType,
                        dailyCapacity: profile.dailyCapacity,
                        averageRating: profile.averageRating,
                        totalPurchases: profile.totalPurchases
                    };
                }
                break;
                
            case 'customer':
                profile = await Customer.findOne({ user: user._id });
                if (profile) {
                    additionalData = {
                        familySize: profile.familySize,
                        subscription: profile.subscription,
                        loyaltyPoints: profile.loyaltyPoints,
                        totalOrders: profile.totalOrders
                    };
                }
                break;
                
            case 'admin':
                // Admin might not have additional profile
                additionalData = {
                    isAdmin: true
                };
                break;
        }

        // Generate token
        const token = user.generateAuthToken();

        // Update last login
        user.lastLogin = Date.now();
        await user.save();
      
        res.status(200).json({
            success: true,
            message: 'Login successful',
    
            data: {
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    mobile: user.mobile,
                    email: user.email,
                    role: user.role,
                    isVerified: user.isVerified,
                    profilePhoto: user.profilePhoto,
                    ...additionalData // Include role-specific data
                },
                profile, // Full profile object
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


export const getUserName= async(req,res)=>{
    try {
        // req.user tumhare auth middleware se aa raha hai
        const user = req.user;
        

        res.status(200).json({
            success:true,
            name: user.fullname
        });
    } catch (error) {
        console.log("Error fetching user name:", error);
        res.status(500).json({
            success:false,
            message:"server error"
        });
        
    }
}
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

// Test endpoint
export const test = (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Auth routes are working!',
        timestamp: new Date().toISOString()
    });
};

export default {
    register,
    login,
    getProfile,
    updateProfile,
    test,
    validateRegister,
    validateLogin
};