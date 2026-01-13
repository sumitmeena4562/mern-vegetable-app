import User from '../models/User.js';
import Farmer from '../models/Farmer.js';
import Notification from '../models/Notification.js';
import Otp from '../models/otp.js';
import jwt from 'jsonwebtoken';
import { validationResult, body } from 'express-validator';
import nodemailer from 'nodemailer';
import path from 'path';
import { sendMail } from '../utils/sendMail.js';

// ==========================================
// 1. REGISTER CONTROLLER (FIXED & SCALABLE)
// ==========================================
export const register = async (req, res) => {
    try {
        console.log("🟢 Registration started...");

        // 1. Validation Check
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        // 2. Data Extraction
        let { fullName, mobile, password, role, email, ...otherData } = req.body;
        console.log("🔍 Incoming Email:", email);

        // 3. OTP Fallback Logic (Agar frontend se email miss ho jaye)
        if (!email || email === "undefined" || email === "") {
            const otpRecord = await Otp.findOne({ mobile }).sort({ createdAt: -1 });
            if (otpRecord && otpRecord.email) {
                email = otpRecord.email;
                console.log("✅ Email recovered from OTP:", email);
            }
        }

        // 4. Duplicate Check
        const existing = await User.findOne({ mobile });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Mobile number already registered' });
        }

        // 5. Create Base User
        console.log("📝 Creating base user...");
        const user = await User.create({
            fullName,
            mobile,
            password,
            role,
            email: email || `${mobile}@user.com`,
            // User model mein bhi address save kar rahe hain (Login response ke liye fast access)
            address: otherData.address || {},
            isVerified: true,// ✅ Assuming frontend Verified OTP first
            location: otherData.location || {
                type: 'Point',
                coordinates: [0, 0]
            }

        });

        console.log("✅ Base user created:", user._id);

        // 6. Create Role-Specific Profile
        let profile;

        switch (role) {
            case 'farmer':
                console.log("🌾 Creating farmer profile...");

                // ✅ FIX: Address Data Preparation
                const addressData = otherData.address || {};

                profile = await Farmer.create({
                    user: user._id,
                    farmName: otherData.farmName || `${fullName}'s Farm`,
                    farmSize: otherData.farmSize || 1,
                    farmSizeUnit: otherData.farmSizeUnit || 'acre',

                    // ✅ FIXED: Text Address ko 'address' field mein map kiya
                    address: {
                        village: addressData.village,
                        city: addressData.city,
                        state: addressData.state,
                        fullAddress: addressData.fullAddress || `${addressData.village}, ${addressData.city}`
                    },

                    // ✅ FIXED: GPS Location (Future proofing ke liye default 0,0)
                    location: otherData.location || {
                        type: 'Point',
                        coordinates: [0, 0] // Future mein yahan frontend se coordinates bhej sakte hain
                    },

                    // ✅ FIXED: Crops array direct pass kiya (Enum hata diya hai model se)
                    crops: otherData.crops || [],

                    farmingExperience: otherData.farmingExperience || 0,
                    // Frontend 'pickup' bhejta hai, Backend 'preferredPickupTime' mangta hai
                    preferredPickupTime: otherData.pickup || 'morning',
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
                    preferredPickupTime: otherData.preferredPickupTime || 'morning'
                });
                break;

            case 'customer':
                console.log("👨‍👩‍👧‍👦 Creating customer profile...");
                profile = await Customer.create({
                    user: user._id,
                    familySize: otherData.familySize || 1,
                    subscription: otherData.subscription || 'none',
                    deliveryAddresses: otherData.deliveryAddresses || [],
                    paymentMethods: otherData.paymentMethods || []
                });
                break;

            default:
                // Future: Yahan naye roles add kar sakte hain
                throw new Error('Invalid role specified');
        }

        console.log(`✅ ${role} registration successful`);

        // 7. Send Welcome Notification (In-App)
        await Notification.create({
            user: user._id,
            title: "Account Created Successfully 🎉",
            message: `Welcome to AgriConnect, ${user.fullName}! Your dashboard is ready.`,
            type: "success",
            priority: "high",
            data: { email: user.email, action: "signup" }
        });

        // 8. Send Welcome Email (Email)
        console.log("📧 Attempting to send Welcome Email to:", user.email);
        try {
            await sendMail(user.email, 'WELCOME', {
                name: user.fullName,
                role: role.charAt(0).toUpperCase() + role.slice(1),
                mobile: user.mobile,
                location: user.address?.city ? `${user.address.city}, ${user.address.state}` : 'India'
            });
            console.log("✅ Welcome Email Processed");
        } catch (emailErr) {
            console.error("❌ Welcome Email Failed:", emailErr.message);
        }

        // 9. Generate Token & Send Response
        const token = user.generateAuthToken();

        res.status(201).json({
            success: true,
            message: `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully`,
            data: {
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    mobile: user.mobile,
                    email: user.email,
                    role: user.role,
                    isVerified: user.isVerified
                },
                profile,
                token
            }
        });

    } catch (error) {
        console.error('❌ Registration error:', error);

        // Cleanup: Agar user create ho gaya par profile fail ho gayi, toh user delete karo
        if (req.body.mobile) {
            try {
                await User.findOneAndDelete({ mobile: req.body.mobile });
                console.log("🧹 Cleaned up failed registration");
            } catch (e) { console.error("Cleanup failed", e); }
        }

        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: error.message
        });
    }
};

// ==========================================
// 2. EMAIL OTP SYSTEM
// ==========================================
export const sendOtp = async (req, res) => {
    try {
        const { mobile, email, type, identifier } = req.body; // Support identifier

        // Support both old 'mobile' field and new 'identifier' field
        const uniqueId = identifier || mobile || email;

        if (!uniqueId) {
            return res.status(400).json({ success: false, message: "Mobile number or Email is required." });
        }

        // Detect if Input is Email
        const isEmail = uniqueId.toString().includes('@');
        const query = isEmail ? { email: uniqueId.toLowerCase() } : { mobile: uniqueId };

        // Check if user already exists
        const existingUser = await User.findOne(query);

        // Logic check
        if (type === 'register' && existingUser) {
            return res.status(400).json({ success: false, message: "User already registered. Please Login." });
        }

        if (type === 'login' && !existingUser) {
            return res.status(404).json({ success: false, message: "User not found. Please Register first." });
        }

        // Determine Email for sending OTP
        let userEmail = isEmail ? uniqueId : email;

        if (type === 'login' && existingUser) {
            userEmail = existingUser.email;
        }

        if (!userEmail) {
            return res.status(400).json({ success: false, message: "Email is required for verification." });
        }

        // Determine Mobile (for saving in OTP collection)
        const userMobile = !isEmail ? uniqueId : (existingUser?.mobile || "NA");

        // Generate 4-digit OTP
        const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

        // Save to DB (Refresh existing OTP) - Query by whatever ID we have
        if (!isEmail) await Otp.deleteMany({ mobile: uniqueId });
        else await Otp.deleteMany({ email: uniqueId });

        await Otp.create({
            mobile: userMobile,
            email: userEmail,
            otp: otpCode
        });
        // Configure Nodemailer

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: `"AgriConnect Security" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: 'AgriConnect Verification Code',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="cid:agriconnectLogo" alt="AgriConnect" style="width: 100px; height: 100px; margin-bottom: 10px;">
                        <h2 style="color: #2E7D32; margin: 0;">AgriConnect 🌱</h2>
                    </div>
                    <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <p style="font-size: 16px; color: #333;">Use the code below to complete your registration:</p>
                        <div style="margin: 20px 0;">
                            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #2E7D32; background-color: #e8f5e9; padding: 10px 20px; border-radius: 5px; border: 1px dashed #2E7D32;">
                                ${otpCode}
                            </span>
                        </div>
                        <p style="font-size: 12px; color: #888;">Valid for <strong>10 minutes</strong>.</p>
                    </div>
                </div>
            `,
            attachments: [
                {
                    filename: 'logo.png',
                    path: path.join(process.cwd(), 'src', 'resource', 'Logo.png'),
                    cid: 'agriconnectLogo'
                }
            ]
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${userEmail} with OTP: ${otpCode}`);

        res.status(200).json({
            success: true,
            message: `OTP sent to ${email}.`
        });

    } catch (error) {
        console.error("❌ Email Error:", error);
        res.status(500).json({ success: false, message: "Failed to send email." });
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { mobile, otp } = req.body;

        const validOtp = await Otp.findOne({ mobile, otp });

        if (!validOtp) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP." });
        }

        // OTP Verified, delete it
        await Otp.deleteOne({ _id: validOtp._id });

        res.status(200).json({ success: true, message: "Mobile Verified Successfully!" });

    } catch (error) {
        console.error("OTP Verify Error:", error);
        res.status(500).json({ success: false, message: "Verification failed." });
    }
};

// ==========================================
// 3. LOGIN CONTROLLER
// ==========================================
export const login = async (req, res) => {
    try {
        let { mobile, email, identifier, password } = req.body;

        // Normalize identifier
        if (!identifier) {
            identifier = mobile || email;
        }

        console.log("Trying login for:", identifier);

        // Determine verify field (Email or Mobile)
        const isEmail = identifier && identifier.includes('@');
        const query = isEmail ? { email: identifier.toLowerCase() } : { mobile: identifier };

        // Find user & include password explicitly
        const user = await User.findOne(query).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        if (!user.isActive) {
            return res.status(401).json({ success: false, message: 'Account is deactivated' });
        }

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
        res.status(500).json({ success: false, message: 'Login failed', error: error.message });
    }
};

export const loginWithOtp = async (req, res) => {
    try {
        const { mobile, email, otp, identifier } = req.body;

        const uniqueId = identifier || mobile || email;

        if (!uniqueId || !otp) {
            return res.status(400).json({ success: false, message: 'Recent Identifier and OTP are required' });
        }

        const isEmail = uniqueId.toString().includes('@');

        // 1. Verify OTP
        const otpQuery = isEmail ? { email: uniqueId.toLowerCase(), otp } : { mobile: uniqueId, otp };
        const otpRecord = await Otp.findOne(otpQuery);

        if (!otpRecord) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        // 2. Find User
        const userQuery = isEmail ? { email: uniqueId.toLowerCase() } : { mobile: uniqueId };
        const user = await User.findOne(userQuery);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (!user.isActive) {
            return res.status(401).json({ success: false, message: 'Account is deactivated' });
        }

        // 3. Generate Token
        const token = user.generateAuthToken();

        // 4. Delete Used OTP
        await Otp.deleteOne({ _id: otpRecord._id });

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
        console.error('OTP Login error:', error);
        res.status(500).json({ success: false, message: 'Login failed' });
    }
};

// ==========================================
// 4. PROFILE CONTROLLERS
// ==========================================

// Get Current User (Context Loader)
export const getMe = async (req, res) => {
    try {
        const user = req.user; // Middleware injected
        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                mobile: user.mobile,
                role: user.role,
                isVerified: user.isVerified
            }
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Get Full Profile with Role Data
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        let profile = null;
        // Scalable Switch for Profiles
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
            data: { user, profile }
        });

    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ success: false, message: 'Failed to get profile' });
    }
};

// Update Profile
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const currentUser = await User.findById(userId);

        if (!currentUser) return res.status(404).json({ success: false, message: 'User not found' });

        const { password, mobile, role, ...updateData } = req.body;

        if (role && role !== currentUser.role) {
            return res.status(400).json({ success: false, message: 'Cannot change user role' });
        }

        // 1. Update Base User Fields
        const allowedUserFields = ['fullName', 'email', 'profilePhoto', 'address', 'location', 'fcmToken', 'settings'];
        const userUpdates = {};

        Object.keys(updateData).forEach(key => {
            if (allowedUserFields.includes(key)) userUpdates[key] = updateData[key];
        });

        let updatedUser = currentUser;
        if (Object.keys(userUpdates).length > 0) {
            updatedUser = await User.findByIdAndUpdate(userId, userUpdates, { new: true, runValidators: true }).select('-password');
        }

        // 2. Update Role Specific Fields
        let profileUpdate = {};
        let updatedProfile = null;

        // Role based filtering logic
        switch (currentUser.role) {
            case 'farmer':
                const farmerFields = ['farmName', 'farmSize', 'farmSizeUnit', 'crops', 'farmingExperience', 'preferredPickupTime', 'bankDetails', 'documents', 'address'];
                Object.keys(updateData).forEach(key => { if (farmerFields.includes(key)) profileUpdate[key] = updateData[key]; });

                if (Object.keys(profileUpdate).length > 0) {
                    updatedProfile = await Farmer.findOneAndUpdate({ user: userId }, profileUpdate, { new: true, runValidators: true });
                }
                break;

            case 'vendor':
                // ... existing vendor update logic ...
                const vendorFields = ['shopName', 'dailyCapacity', 'preferredVegetables', 'storeTimings']; // Add all vendor fields here
                Object.keys(updateData).forEach(key => { if (vendorFields.includes(key)) profileUpdate[key] = updateData[key]; });

                if (Object.keys(profileUpdate).length > 0) {
                    updatedProfile = await Vendor.findOneAndUpdate({ user: userId }, profileUpdate, { new: true, runValidators: true });
                }
                break;

            case 'customer':
                // ... existing customer logic ...
                const customerFields = ['familySize', 'deliveryAddresses'];
                Object.keys(updateData).forEach(key => { if (customerFields.includes(key)) profileUpdate[key] = updateData[key]; });

                if (Object.keys(profileUpdate).length > 0) {
                    updatedProfile = await Customer.findOneAndUpdate({ user: userId }, profileUpdate, { new: true, runValidators: true });
                }
                break;
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: { user: updatedUser, profile: updatedProfile }
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ success: false, message: 'Failed to update profile' });
    }
};

// ==========================================
// 5. VALIDATORS
// ==========================================
export const validateLogin = [
    body('mobile').trim().notEmpty().withMessage('Mobile number is required'),
    body('password').trim().notEmpty().withMessage('Password is required')
];

export const validateRegister = [
    body('fullName').trim().notEmpty().isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
    body('mobile').trim().notEmpty().matches(/^[6-9]\d{9}$/).withMessage('Valid Indian mobile number is required'),
    body('password').trim().notEmpty().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').trim().isIn(['farmer', 'vendor', 'customer']).withMessage('Invalid role'),

    // Role specific basic validation
    body('farmName').if(body('role').equals('farmer')).trim().notEmpty().withMessage('Farm name required'),
    body('farmSize').if(body('role').equals('farmer')).isNumeric().withMessage('Farm size must be a number'),
    body('shopName').if(body('role').equals('vendor')).trim().notEmpty().withMessage('Shop name required')
];

export const getUserName = async (req, res) => {
    // Basic getter
    res.status(200).json({ success: true, name: req.user.fullName });
};

export const test = (req, res) => {
    res.status(200).json({ success: true, message: 'Auth routes working!' });
};

// ==========================================
// 6. FORGOT PASSWORD SYSTEM (OTP BASED)
// ==========================================

// Step 1: Send OTP to Registered Email/Mobile
export const sendForgotPasswordOtp = async (req, res) => {
    try {
        const { identifier } = req.body; // Can be mobile or email

        if (!identifier) {
            return res.status(400).json({ success: false, message: "Please provide mobile or email" });
        }

        // Logic to detect if Email or Mobile
        const isEmail = identifier.includes('@');
        const query = isEmail ? { email: identifier.toLowerCase() } : { mobile: identifier };

        // 1. Check if User Exists
        const user = await User.findOne(query);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found with this ID" });
        }

        // 2. Generate OTP
        const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

        // 3. Save OTP (Delete old ones first)
        const otpPayload = { otp: otpCode };
        if (isEmail) otpPayload.email = user.email;
        else otpPayload.mobile = user.mobile;

        // Clear old OTPs
        if (isEmail) await Otp.deleteMany({ email: user.email });
        else await Otp.deleteMany({ mobile: user.mobile });

        await Otp.create(otpPayload);

        // 4. Send Email
        if (isEmail) {
            await sendMail(user.email, 'PASSWORD_RESET_OTP', { otp: otpCode });
            console.log(`🔑 Reset OTP sent to ${user.email}`);
        } else {
            console.log(`📱 SMS logic placeholder for ${user.mobile}. OTP: ${otpCode}`);
        }

        res.status(200).json({
            success: true,
            message: `OTP sent to ${isEmail ? 'email' : 'mobile'}`
        });

    } catch (error) {
        console.error("Forgot Password OTP Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Step 2: Verify OTP & Return Temporary Token
export const verifyResetOtp = async (req, res) => {
    try {
        const { identifier, otp } = req.body;

        const isEmail = identifier.includes('@');
        const query = isEmail ? { email: identifier, otp } : { mobile: identifier, otp };

        const validOtp = await Otp.findOne(query);
        if (!validOtp) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
        }

        // OTP Valid Hai! User ID find karo
        const user = await User.findOne(isEmail ? { email: identifier } : { mobile: identifier });

        // Generate Temprorary Token (Valid for 5 mins only)
        const tempToken = jwt.sign(
            { id: user._id, type: 'reset_password' },
            process.env.JWT_SECRET,
            { expiresIn: '5m' }
        );

        // OTP ka kaam khatam -> Delete it
        await Otp.deleteOne({ _id: validOtp._id });

        res.status(200).json({
            success: true,
            message: "OTP Verified",
            tempToken // Important!
        });

    } catch (error) {
        console.error("Verify Reset OTP Error:", error);
        res.status(500).json({ success: false, message: "Verification Failed" });
    }
};

// Step 3: Set New Password
export const resetPasswordWithOtp = async (req, res) => {
    try {
        // Auth Middleware se user automatic mil jayega (agar token valid hai)
        const { newPassword } = req.body;
        const userId = req.user.id; // From Temp Token

        // Validate
        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be 6+ chars" });
        }

        // Find & Update
        const user = await User.findById(userId);
        user.password = newPassword; // Mongoose Pre-save hook will Hash it automatically!
        await user.save();

        // 7. Send Success Email
        try {
            if (user.email) {
                await sendMail(user.email, 'PASSWORD_RESET_SUCCESS', { name: user.fullName });
            }
        } catch (mailError) {
            console.error("Success Email Failed:", mailError);
        }

        res.status(200).json({ success: true, message: "Password Changed Successfully! Please Login." });

    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ success: false, message: "Failed to reset password" });
    }
};