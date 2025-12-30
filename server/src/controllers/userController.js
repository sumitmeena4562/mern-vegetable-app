import User from '../models/User.js';
import Farmer from '../models/Farmer.js';
import { validationResult } from 'express-validator';
import Notification from '../models/Notification.js';
import Otp from '../models/otp.js';
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
              data:{
                email:user.email,
                action :"signup"
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

// ==========================
// SEND OTP (Mock/Real)
// ==========================
export const sendOtp = async (req, res) => {
    try {
        const { mobile } = req.body;
        
        // 1. Check agar user pehle se registered hai
        const existingUser = await User.findOne({ mobile });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Mobile number pehle se registered hai. Please Login karein." });
        }

        // 2. Generate 4 digit OTP
        const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

        // 3. Purana OTP delete karein agar koi hai
        await Otp.deleteMany({ mobile });

        // 4. Save New OTP to DB
        await Otp.create({ mobile, otp: otpCode });

        // 5. Send SMS (Yahan Fast2SMS / Twilio ka code ayega)
        // Filhal development ke liye console me dikha rahe hain
        console.log(`📩 OTP for ${mobile} is: ${otpCode}`);

        res.status(200).json({ success: true, message: "OTP sent successfully!" });

    } catch (error) {
        console.error("OTP Send Error:", error);
        res.status(500).json({ success: false, message: "OTP bhejne me dikkat aayi." });
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