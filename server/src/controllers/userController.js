import User from '../models/User.js';
import Notification from '../models/Notification.js';
import Otp from '../models/otp.js';
import jwt from 'jsonwebtoken';
import { validationResult, body } from 'express-validator';
import nodemailer from 'nodemailer';
import path from 'path';
import { sendMail } from '../utils/sendMail.js';

// ==========================================
// 1. LOGIN CONTROLLER (Common for all roles)
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
                    email: user.email,
                    role: user.role,
                    isVerified: user.isVerified,
                    address: user.address,     // ✅ Included Address
                    location: user.location    // ✅ Included Location
                },
                token
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Login failed', error: error.message });
    }
};

// ==========================================
// 2. EMAIL OTP SYSTEM
// ==========================================
export const sendOtp = async (req, res) => {
    try {
        const { mobile, email, type, identifier } = req.body;

        const uniqueId = identifier || mobile || email;

        if (!uniqueId) {
            return res.status(400).json({ success: false, message: "Mobile number or Email is required." });
        }

        const isEmail = uniqueId.toString().includes('@');
        const query = isEmail ? { email: uniqueId.toLowerCase() } : { mobile: uniqueId };

        const existingUser = await User.findOne(query);

        if (type === 'register' && existingUser) {
            return res.status(400).json({ success: false, message: "User already registered. Please Login." });
        }

        if (type === 'login' && !existingUser) {
            return res.status(404).json({ success: false, message: "User not found. Please Register first." });
        }

        let userEmail = isEmail ? uniqueId : email;
        if (type === 'login' && existingUser) {
            userEmail = existingUser.email;
        }

        if (!userEmail) {
            return res.status(400).json({ success: false, message: "Email is required for verification." });
        }

        const userMobile = !isEmail ? uniqueId : (existingUser?.mobile || "NA");
        const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

        if (!isEmail) await Otp.deleteMany({ mobile: uniqueId });
        else await Otp.deleteMany({ email: uniqueId });

        await Otp.create({
            mobile: userMobile,
            email: userEmail,
            otp: otpCode
        });

        // Send Email
        await sendMail(userEmail, 'OTP', { otp: otpCode });

        console.log(`✅ Email sent to ${userEmail} with OTP: ${otpCode}`);

        res.status(200).json({
            success: true,
            message: `OTP sent to ${userEmail}.`
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

        await Otp.deleteOne({ _id: validOtp._id });
        res.status(200).json({ success: true, message: "Mobile Verified Successfully!" });

    } catch (error) {
        console.error("OTP Verify Error:", error);
        res.status(500).json({ success: false, message: "Verification failed." });
    }
};

// ==========================================
// 3. OTP LOGIN
// ==========================================
export const loginWithOtp = async (req, res) => {
    try {
        const { mobile, email, otp, identifier } = req.body;
        const uniqueId = identifier || mobile || email;

        if (!uniqueId || !otp) {
            return res.status(400).json({ success: false, message: 'Recent Identifier and OTP are required' });
        }

        const isEmail = uniqueId.toString().includes('@');
        const otpQuery = isEmail ? { email: uniqueId.toLowerCase(), otp } : { mobile: uniqueId, otp };

        const otpRecord = await Otp.findOne(otpQuery);
        if (!otpRecord) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        const userQuery = isEmail ? { email: uniqueId.toLowerCase() } : { mobile: uniqueId };
        const user = await User.findOne(userQuery);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (!user.isActive) {
            return res.status(401).json({ success: false, message: 'Account is deactivated' });
        }

        const token = user.generateAuthToken();
        await Otp.deleteOne({ _id: otpRecord._id });

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
// 4. COMMON USER ROUTES
// ==========================================

// Get Current User (Context Loader)
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Unified Profile Getter (For Dashboard Compatibility)
export const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;
        let profileData = null;

        if (role === 'farmer') {
            const { default: Farmer } = await import('../models/Farmer.js');
            profileData = await Farmer.findOne({ user: userId }).populate('user', '-password');
        } else if (role === 'vendor') {
            const { default: Vendor } = await import('../models/Vendor.js');
            profileData = await Vendor.findOne({ user: userId }).populate('user', '-password');
        } else if (role === 'customer') {
            const { default: Customer } = await import('../models/Customer.js');
            profileData = await Customer.findOne({ user: userId }).populate('user', '-password');
        }

        if (!profileData) {
            return res.status(404).json({ success: false, message: "Profile data not found" });
        }

        res.status(200).json({ success: true, data: profileData });

    } catch (error) {
        console.error("Get Profile Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch profile" });
    }
};

// ==========================================
// 5. VALIDATORS
// ==========================================
export const validateLogin = [
    body('mobile').trim().notEmpty().withMessage('Mobile number is required'),
];

export const getUserName = async (req, res) => {
    res.status(200).json({ success: true, name: req.user.fullName });
};

export const test = (req, res) => {
    res.status(200).json({ success: true, message: 'Auth routes working!' });
};

// ==========================================
// 6. FORGOT PASSWORD SYSTEM
// ==========================================
export const sendForgotPasswordOtp = async (req, res) => {
    try {
        const { identifier } = req.body;

        if (!identifier) {
            return res.status(400).json({ success: false, message: "Please provide mobile or email" });
        }

        const isEmail = identifier.includes('@');
        const query = isEmail ? { email: identifier.toLowerCase() } : { mobile: identifier };

        const user = await User.findOne(query);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found with this ID" });
        }

        const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
        const otpPayload = { otp: otpCode };
        if (isEmail) otpPayload.email = user.email;
        else otpPayload.mobile = user.mobile;

        if (isEmail) await Otp.deleteMany({ email: user.email });
        else await Otp.deleteMany({ mobile: user.mobile });

        await Otp.create(otpPayload);

        if (isEmail) {
            await sendMail(user.email, 'PASSWORD_RESET', { otp: otpCode, name: user.fullName });
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

export const verifyResetOtp = async (req, res) => {
    try {
        const { identifier, otp } = req.body;

        const isEmail = identifier.includes('@');
        const query = isEmail ? { email: identifier, otp } : { mobile: identifier, otp };

        const validOtp = await Otp.findOne(query);
        if (!validOtp) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
        }

        const user = await User.findOne(isEmail ? { email: identifier } : { mobile: identifier });

        const tempToken = jwt.sign(
            { id: user._id, type: 'reset_password' },
            process.env.JWT_SECRET,
            { expiresIn: '5m' }
        );

        await Otp.deleteOne({ _id: validOtp._id });

        res.status(200).json({
            success: true,
            message: "OTP Verified",
            tempToken
        });

    } catch (error) {
        console.error("Verify Reset OTP Error:", error);
        res.status(500).json({ success: false, message: "Verification Failed" });
    }
};

export const resetPasswordWithOtp = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const userId = req.user.id;

        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be 6+ chars" });
        }

        const user = await User.findById(userId);
        user.password = newPassword;
        await user.save();

        res.status(200).json({ success: true, message: "Password Changed Successfully! Please Login." });

    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ success: false, message: "Failed to reset password" });
    }
};